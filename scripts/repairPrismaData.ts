/**
 * scripts/repairPrismaData.ts
 *
 * Comprehensive Prisma data integrity repair script.
 * Scans all models, detects common issues, and repairs records safely.
 *
 * Usage:
 *   DRY RUN (no writes):    npx ts-node scripts/repairPrismaData.ts
 *   APPLY REPAIRS:          DRY_RUN=false npx ts-node scripts/repairPrismaData.ts
 */

import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const DRY_RUN = process.env.DRY_RUN !== 'false';
const BATCH_SIZE = 50;

// ─── Counters ────────────────────────────────────────────────────────────────

interface RepairSummary {
    model: string;
    scanned: number;
    repaired: number;
    issues: string[];
}

const summaries: RepairSummary[] = [];

function log(msg: string) {
    console.log(`  ${msg}`);
}

function warn(msg: string) {
    console.warn(`  ⚠ ${msg}`);
}

function repaired(label: string, id: string, field: string, from: any, to: any) {
    const action = DRY_RUN ? '[DRY RUN] Would repair' : 'Repaired';
    console.log(`  ✓ ${action}: [${label}] id=${id} | ${field}: ${JSON.stringify(from)} → ${JSON.stringify(to)}`);
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
}

function validateSlug(slug: string | null | undefined): boolean {
    if (!slug) return false;
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function normalizeStatus(status: string | null | undefined, allowed: string[], defaultVal: string): string {
    if (!status) return defaultVal;
    const upper = status.toUpperCase();
    const match = allowed.find(a => a.toUpperCase() === upper);
    return match ?? defaultVal;
}

function fixDateField(date: any, fallback: Date): Date {
    if (!date) return fallback;
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return d;
}

function sanitizeString(val: string | null | undefined, fallback: string): string {
    if (!val || val.trim() === '') return fallback;
    return val.trim().substring(0, 2000); // Cap at 2000 chars for safety
}

function sanitizeRichText(val: any): any {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch {
            return null;
        }
    }
    if (typeof val === 'object') return val;
    return null;
}

function isValidJsonArray(val: any): boolean {
    if (val === null || val === undefined) return false;
    return Array.isArray(val);
}

function ensureJsonArray(val: any): any[] {
    if (Array.isArray(val)) return val;
    if (val === null || val === undefined) return [];
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

function isValidImageUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('/') || url.startsWith('data:');
}

// ─── Model: NewsArticle ───────────────────────────────────────────────────────

async function repairNews() {
    console.log('\n━━━ Scanning NewsArticle ━━━');
    const summary: RepairSummary = { model: 'NewsArticle', scanned: 0, repaired: 0, issues: [] };
    const seenSlugs = new Map<string, string>();

    let skip = 0;
    while (true) {
        const articles = await prisma.newsArticle.findMany({ take: BATCH_SIZE, skip });
        if (articles.length === 0) break;
        summary.scanned += articles.length;

        for (const article of articles) {
            const updates: Record<string, any> = {};

            // Title
            if (!article.title || article.title.trim() === '') {
                repaired('NewsArticle', article.id, 'title', article.title, 'Untitled Article');
                updates.title = 'Untitled Article';
                summary.issues.push('missing title');
            }

            // Slug
            const title = updates.title ?? article.title;
            let slug = article.slug;
            if (!validateSlug(slug)) {
                const newSlug = slugify(title || `article-${article.id}`);
                repaired('NewsArticle', article.id, 'slug', slug, newSlug);
                slug = newSlug;
                updates.slug = newSlug;
                summary.issues.push('invalid slug');
            }

            // Duplicate slug
            if (seenSlugs.has(slug) && seenSlugs.get(slug) !== article.id) {
                const newSlug = `${slug}-${article.id.slice(-4)}`;
                repaired('NewsArticle', article.id, 'slug (duplicate)', slug, newSlug);
                updates.slug = newSlug;
                slug = newSlug;
                summary.issues.push('duplicate slug');
            }
            seenSlugs.set(slug, article.id);

            // Image
            if (!isValidImageUrl(article.image)) {
                repaired('NewsArticle', article.id, 'image', article.image, null);
                updates.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
                summary.issues.push('invalid image URL');
            }

            // Excerpt
            if (!article.excerpt || article.excerpt.trim() === '') {
                repaired('NewsArticle', article.id, 'excerpt', article.excerpt, '');
                updates.excerpt = '';
                summary.issues.push('missing excerpt');
            }

            // Status
            const allowed = ['PUBLISHED', 'DRAFT'];
            const status = normalizeStatus(article.status, allowed, 'DRAFT');
            if (status !== article.status) {
                repaired('NewsArticle', article.id, 'status', article.status, status);
                updates.status = status;
                summary.issues.push('invalid status');
            }

            // Date (not DateTime – stored as string. Just check it exists)
            if (!article.date || article.date.trim() === '') {
                const fallback = article.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                repaired('NewsArticle', article.id, 'date', article.date, fallback);
                updates.date = fallback;
                summary.issues.push('missing date string');
            }

            // ContentBlocks
            const blocks = sanitizeRichText(article.contentBlocks);
            if (article.contentBlocks !== null && blocks === null) {
                repaired('NewsArticle', article.id, 'contentBlocks', article.contentBlocks, null);
                updates.contentBlocks = null;
                summary.issues.push('broken contentBlocks JSON');
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.newsArticle.update({ where: { id: article.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (articles.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: Project ───────────────────────────────────────────────────────────

async function repairProjects() {
    console.log('\n━━━ Scanning Project ━━━');
    const summary: RepairSummary = { model: 'Project', scanned: 0, repaired: 0, issues: [] };
    const seenSlugs = new Map<string, string>();

    let skip = 0;
    while (true) {
        const projects = await prisma.project.findMany({ take: BATCH_SIZE, skip });
        if (projects.length === 0) break;
        summary.scanned += projects.length;

        for (const project of projects) {
            const updates: Record<string, any> = {};

            // Title
            if (!project.title || project.title.trim() === '') {
                repaired('Project', project.id, 'title', project.title, 'Untitled Project');
                updates.title = 'Untitled Project';
                summary.issues.push('missing title');
            }

            // Slug
            const title = updates.title ?? project.title;
            let slug = project.slug;
            if (!validateSlug(slug)) {
                const newSlug = slugify(title || `project-${project.id}`);
                repaired('Project', project.id, 'slug', slug, newSlug);
                slug = newSlug;
                updates.slug = newSlug;
                summary.issues.push('invalid slug');
            }

            // Duplicate slug
            if (seenSlugs.has(slug) && seenSlugs.get(slug) !== project.id) {
                const newSlug = `${slug}-${project.id.slice(-4)}`;
                repaired('Project', project.id, 'slug (duplicate)', slug, newSlug);
                updates.slug = newSlug;
                slug = newSlug;
                summary.issues.push('duplicate slug');
            }
            seenSlugs.set(slug, project.id);

            // Required strings
            for (const field of ['industry', 'duration', 'location', 'description'] as const) {
                if (!project[field] || project[field].trim() === '') {
                    repaired('Project', project.id, field, project[field], 'N/A');
                    updates[field] = 'N/A';
                    summary.issues.push(`missing ${field}`);
                }
            }

            // deliverables — must be a JSON array
            if (!isValidJsonArray(project.deliverables)) {
                const fixed = ensureJsonArray(project.deliverables);
                repaired('Project', project.id, 'deliverables', project.deliverables, fixed);
                updates.deliverables = fixed;
                summary.issues.push('deliverables not array');
            }

            // Nullable JSON arrays
            for (const field of ['objectives', 'technologies', 'achievements', 'gallery'] as const) {
                const val = project[field];
                if (val !== null && val !== undefined && !isValidJsonArray(val)) {
                    const fixed = ensureJsonArray(val);
                    repaired('Project', project.id, field, val, fixed);
                    updates[field] = fixed;
                    summary.issues.push(`${field} not array`);
                }
            }

            // Image
            if (!isValidImageUrl(project.image)) {
                repaired('Project', project.id, 'image', project.image, '');
                updates.image = '';
                summary.issues.push('invalid image');
            }

            // Status
            const allowedStatus = ['Ongoing', 'Completed', 'Planned'];
            const status = allowedStatus.find(s => s.toLowerCase() === (project.status ?? '').toLowerCase()) ?? 'Planned';
            if (status !== project.status) {
                repaired('Project', project.id, 'status', project.status, status);
                updates.status = status;
                summary.issues.push('invalid status');
            }

            // Publication status
            const allowedPub = ['PUBLISHED', 'DRAFT'];
            const pubStatus = normalizeStatus(project.publicationStatus, allowedPub, 'DRAFT');
            if (pubStatus !== project.publicationStatus) {
                repaired('Project', project.id, 'publicationStatus', project.publicationStatus, pubStatus);
                updates.publicationStatus = pubStatus;
                summary.issues.push('invalid publicationStatus');
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.project.update({ where: { id: project.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (projects.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: Service ───────────────────────────────────────────────────────────

async function repairServices() {
    console.log('\n━━━ Scanning Service ━━━');
    const summary: RepairSummary = { model: 'Service', scanned: 0, repaired: 0, issues: [] };
    const seenSlugs = new Map<string, string>();

    let skip = 0;
    while (true) {
        const services = await prisma.service.findMany({ take: BATCH_SIZE, skip });
        if (services.length === 0) break;
        summary.scanned += services.length;

        for (const service of services) {
            const updates: Record<string, any> = {};

            // Title
            if (!service.title || service.title.trim() === '') {
                repaired('Service', service.id, 'title', service.title, 'Untitled Service');
                updates.title = 'Untitled Service';
                summary.issues.push('missing title');
            }

            // Slug
            const title = updates.title ?? service.title;
            let slug = service.slug;
            if (!validateSlug(slug)) {
                const newSlug = slugify(title || `service-${service.id}`);
                repaired('Service', service.id, 'slug', slug, newSlug);
                slug = newSlug;
                updates.slug = newSlug;
                summary.issues.push('invalid slug');
            }

            // Duplicate slug
            if (seenSlugs.has(slug) && seenSlugs.get(slug) !== service.id) {
                const newSlug = `${slug}-${service.id.slice(-4)}`;
                repaired('Service', service.id, 'slug (duplicate)', slug, newSlug);
                updates.slug = newSlug;
                slug = newSlug;
                summary.issues.push('duplicate slug');
            }
            seenSlugs.set(slug, service.id);

            // Required text fields
            if (!service.shortDescription || service.shortDescription.trim() === '') {
                repaired('Service', service.id, 'shortDescription', service.shortDescription, '');
                updates.shortDescription = '';
                summary.issues.push('missing shortDescription');
            }

            if (!service.fullDescription || service.fullDescription.trim() === '') {
                repaired('Service', service.id, 'fullDescription', service.fullDescription, '');
                updates.fullDescription = '';
                summary.issues.push('missing fullDescription');
            }

            if (!service.icon || service.icon.trim() === '') {
                repaired('Service', service.id, 'icon', service.icon, 'FaTools');
                updates.icon = 'FaTools';
                summary.issues.push('missing icon');
            }

            // Status
            const allowed = ['PUBLISHED', 'DRAFT'];
            const status = normalizeStatus(service.status, allowed, 'DRAFT');
            if (status !== service.status) {
                repaired('Service', service.id, 'status', service.status, status);
                updates.status = status;
                summary.issues.push('invalid status');
            }

            // Category
            const allowedCats = ['TECHNOLOGY', 'AUDIT & PROTECTION', 'ENGINEERING', 'PROCUREMENT'];
            if (!allowedCats.includes(service.category)) {
                warn(`Service [${service.id}] has non-standard category: "${service.category}" – keeping as-is`);
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.service.update({ where: { id: service.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (services.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: ServiceFeature ────────────────────────────────────────────────────

async function repairServiceFeatures() {
    console.log('\n━━━ Scanning ServiceFeature ━━━');
    const summary: RepairSummary = { model: 'ServiceFeature', scanned: 0, repaired: 0, issues: [] };

    let skip = 0;
    while (true) {
        const features = await prisma.serviceFeature.findMany({ take: BATCH_SIZE, skip });
        if (features.length === 0) break;
        summary.scanned += features.length;

        for (const feat of features) {
            const updates: Record<string, any> = {};

            if (!feat.title || feat.title.trim() === '') {
                repaired('ServiceFeature', feat.id, 'title', feat.title, 'Feature');
                updates.title = 'Feature';
                summary.issues.push('missing title');
            }

            if (!feat.description || feat.description.trim() === '') {
                repaired('ServiceFeature', feat.id, 'description', feat.description, '');
                updates.description = '';
                summary.issues.push('missing description');
            }

            if (!feat.icon || feat.icon.trim() === '') {
                repaired('ServiceFeature', feat.id, 'icon', feat.icon, 'FaCheckCircle');
                updates.icon = 'FaCheckCircle';
                summary.issues.push('missing icon');
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.serviceFeature.update({ where: { id: feat.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (features.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: Career ────────────────────────────────────────────────────────────

async function repairCareers() {
    console.log('\n━━━ Scanning Career ━━━');
    const summary: RepairSummary = { model: 'Career', scanned: 0, repaired: 0, issues: [] };
    const seenSlugs = new Map<string, string>();

    let skip = 0;
    while (true) {
        const careers = await prisma.career.findMany({ take: BATCH_SIZE, skip });
        if (careers.length === 0) break;
        summary.scanned += careers.length;

        for (const career of careers) {
            const updates: Record<string, any> = {};

            // Title
            if (!career.title || career.title.trim() === '') {
                repaired('Career', career.id, 'title', career.title, 'Untitled Position');
                updates.title = 'Untitled Position';
                summary.issues.push('missing title');
            }

            // Slug
            const title = updates.title ?? career.title;
            let slug = career.slug;
            if (!validateSlug(slug)) {
                const newSlug = slugify(title || `career-${career.id}`);
                repaired('Career', career.id, 'slug', slug, newSlug);
                slug = newSlug;
                updates.slug = newSlug;
                summary.issues.push('invalid slug');
            }

            // Duplicate slug
            if (seenSlugs.has(slug) && seenSlugs.get(slug) !== career.id) {
                const newSlug = `${slug}-${career.id.slice(-4)}`;
                repaired('Career', career.id, 'slug (duplicate)', slug, newSlug);
                updates.slug = newSlug;
                slug = newSlug;
                summary.issues.push('duplicate slug');
            }
            seenSlugs.set(slug, career.id);

            // Required strings
            for (const field of ['department', 'location', 'employmentType', 'experienceLevel', 'excerpt'] as const) {
                if (!career[field] || career[field].trim() === '') {
                    repaired('Career', career.id, field, career[field], 'N/A');
                    (updates as any)[field] = 'N/A';
                    summary.issues.push(`missing ${field}`);
                }
            }

            // JSON arrays
            for (const field of ['responsibilities', 'requirements'] as const) {
                const val = career[field];
                if (!isValidJsonArray(val)) {
                    const fixed = ensureJsonArray(val);
                    repaired('Career', career.id, field, val, fixed);
                    updates[field] = fixed;
                    summary.issues.push(`${field} not array`);
                }
            }

            // descriptionBlocks
            const blocks = sanitizeRichText(career.descriptionBlocks);
            if (career.descriptionBlocks !== null && blocks === null) {
                repaired('Career', career.id, 'descriptionBlocks', career.descriptionBlocks, null);
                updates.descriptionBlocks = null;
                summary.issues.push('broken descriptionBlocks JSON');
            }

            // Deadline (required DateTime)
            const deadlineFixed = fixDateField(career.deadline, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
            if (!career.deadline || isNaN(career.deadline.getTime())) {
                repaired('Career', career.id, 'deadline', career.deadline, deadlineFixed.toISOString());
                updates.deadline = deadlineFixed;
                summary.issues.push('invalid deadline');
            }

            // Status
            const allowed = ['OPEN', 'CLOSED'];
            const status = normalizeStatus(career.status, allowed, 'OPEN');
            if (status !== career.status) {
                repaired('Career', career.id, 'status', career.status, status);
                updates.status = status;
                summary.issues.push('invalid status');
            }

            // employmentType (map "type" field values)
            const validTypes = ['Full-Time', 'Part-Time', 'Contract', 'Hybrid', 'Remote'];
            if (!validTypes.some(t => t.toLowerCase() === (career.employmentType ?? '').toLowerCase())) {
                warn(`Career [${career.id}] has unusual employmentType: "${career.employmentType}" – keeping as-is`);
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.career.update({ where: { id: career.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (careers.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: Comment ───────────────────────────────────────────────────────────

async function repairComments() {
    console.log('\n━━━ Scanning Comment ━━━');
    const summary: RepairSummary = { model: 'Comment', scanned: 0, repaired: 0, issues: [] };

    let skip = 0;
    while (true) {
        const comments = await prisma.comment.findMany({ take: BATCH_SIZE, skip });
        if (comments.length === 0) break;
        summary.scanned += comments.length;

        for (const comment of comments) {
            const updates: Record<string, any> = {};

            if (!comment.fullName || comment.fullName.trim() === '') {
                repaired('Comment', comment.id, 'fullName', comment.fullName, 'Anonymous');
                updates.fullName = 'Anonymous';
                summary.issues.push('missing fullName');
            }

            if (!comment.email || !comment.email.includes('@')) {
                repaired('Comment', comment.id, 'email', comment.email, 'unknown@example.com');
                updates.email = 'unknown@example.com';
                summary.issues.push('invalid email');
            }

            if (!comment.text || comment.text.trim() === '') {
                repaired('Comment', comment.id, 'text', comment.text, '[empty comment]');
                updates.text = '[empty comment]';
                summary.issues.push('missing text');
            }

            // Status
            const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'SPAM'];
            const status = normalizeStatus(comment.status, allowed, 'PENDING');
            if (status !== comment.status) {
                repaired('Comment', comment.id, 'status', comment.status, status);
                updates.status = status;
                summary.issues.push('invalid status');
            }

            // contentType
            const allowedTypes = ['news', 'project', 'service'];
            if (!allowedTypes.includes(comment.contentType ?? '')) {
                warn(`Comment [${comment.id}] has invalid contentType: "${comment.contentType}" – keeping as-is`);
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.comment.update({ where: { id: comment.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (comments.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: User ─────────────────────────────────────────────────────────────

async function repairUsers() {
    console.log('\n━━━ Scanning User ━━━');
    const summary: RepairSummary = { model: 'User', scanned: 0, repaired: 0, issues: [] };

    let skip = 0;
    while (true) {
        const users = await prisma.user.findMany({ take: BATCH_SIZE, skip });
        if (users.length === 0) break;
        summary.scanned += users.length;

        for (const user of users) {
            const updates: Record<string, any> = {};

            if (!user.name || user.name.trim() === '') {
                repaired('User', user.id, 'name', user.name, 'Unknown User');
                updates.name = 'Unknown User';
                summary.issues.push('missing name');
            }

            if (!user.username || user.username.trim() === '') {
                const fallback = `user-${user.id.slice(-6)}`;
                repaired('User', user.id, 'username', user.username, fallback);
                updates.username = fallback;
                summary.issues.push('missing username');
            }

            // Role
            const allowedRoles = ['SUPER_ADMIN', 'EDITOR', 'MODERATOR'];
            const role = normalizeStatus(user.role, allowedRoles, 'EDITOR');
            if (role !== user.role) {
                repaired('User', user.id, 'role', user.role, role);
                updates.role = role;
                summary.issues.push('invalid role');
            }

            // Status
            const allowedStatuses = ['ACTIVE', 'DISABLED'];
            const status = normalizeStatus(user.status, allowedStatuses, 'ACTIVE');
            if (status !== user.status) {
                repaired('User', user.id, 'status', user.status, status);
                updates.status = status;
                summary.issues.push('invalid status');
            }

            if (Object.keys(updates).length > 0) {
                summary.repaired++;
                if (!DRY_RUN) {
                    await prisma.user.update({ where: { id: user.id }, data: updates });
                }
            }
        }

        skip += BATCH_SIZE;
        if (users.length < BATCH_SIZE) break;
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: Subscriber ───────────────────────────────────────────────────────

async function repairSubscribers() {
    console.log('\n━━━ Scanning Subscriber ━━━');
    const summary: RepairSummary = { model: 'Subscriber', scanned: 0, repaired: 0, issues: [] };

    const subscribers = await prisma.subscriber.findMany();
    summary.scanned = subscribers.length;

    for (const sub of subscribers) {
        const updates: Record<string, any> = {};

        // email
        if (!sub.email || !sub.email.includes('@')) {
            warn(`Subscriber [${sub.id}] has invalid email: "${sub.email}" – skipping (no destructive ops)`);
            continue;
        }

        // Source
        const allowedSources = ['FOOTER', 'NEWS_PAGE', 'MANUAL'];
        const source = normalizeStatus(sub.source, allowedSources, 'FOOTER');
        if (source !== sub.source) {
            repaired('Subscriber', sub.id, 'source', sub.source, source);
            updates.source = source;
            summary.issues.push('invalid source');
        }

        // Status
        const allowedStatuses = ['SUBSCRIBED', 'UNSUBSCRIBED'];
        const status = normalizeStatus(sub.status, allowedStatuses, 'SUBSCRIBED');
        if (status !== sub.status) {
            repaired('Subscriber', sub.id, 'status', sub.status, status);
            updates.status = status;
            summary.issues.push('invalid status');
        }

        if (Object.keys(updates).length > 0) {
            summary.repaired++;
            if (!DRY_RUN) {
                await prisma.subscriber.update({ where: { id: sub.id }, data: updates });
            }
        }
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Model: Campaign ─────────────────────────────────────────────────────────

async function repairCampaigns() {
    console.log('\n━━━ Scanning Campaign ━━━');
    const summary: RepairSummary = { model: 'Campaign', scanned: 0, repaired: 0, issues: [] };

    const campaigns = await prisma.campaign.findMany();
    summary.scanned = campaigns.length;

    for (const campaign of campaigns) {
        const updates: Record<string, any> = {};

        if (!campaign.title || campaign.title.trim() === '') {
            repaired('Campaign', campaign.id, 'title', campaign.title, 'Untitled Campaign');
            updates.title = 'Untitled Campaign';
            summary.issues.push('missing title');
        }

        if (!campaign.subject || campaign.subject.trim() === '') {
            repaired('Campaign', campaign.id, 'subject', campaign.subject, '(No Subject)');
            updates.subject = '(No Subject)';
            summary.issues.push('missing subject');
        }

        if (!campaign.content || campaign.content.trim() === '') {
            repaired('Campaign', campaign.id, 'content', campaign.content, '');
            updates.content = '';
            summary.issues.push('missing content');
        }

        const allowed = ['DRAFT', 'SENT'];
        const status = normalizeStatus(campaign.status, allowed, 'DRAFT');
        if (status !== campaign.status) {
            repaired('Campaign', campaign.id, 'status', campaign.status, status);
            updates.status = status;
            summary.issues.push('invalid status');
        }

        if (Object.keys(updates).length > 0) {
            summary.repaired++;
            if (!DRY_RUN) {
                await prisma.campaign.update({ where: { id: campaign.id }, data: updates });
            }
        }
    }

    log(`${summary.scanned} records scanned, ${summary.repaired} repaired`);
    summaries.push(summary);
}

// ─── Orphan Cleanup (Read-only Detection) ────────────────────────────────────

async function detectOrphans() {
    console.log('\n━━━ Detecting Orphaned Records ━━━');

    // ServiceFeatures without valid parent Service
    const allServices = await prisma.service.findMany({ select: { id: true } });
    const serviceIds = new Set(allServices.map((s: { id: string }) => s.id));
    const allFeatures = await prisma.serviceFeature.findMany({ select: { id: true, serviceId: true, title: true } });
    const orphanFeatures = allFeatures.filter((f: { id: string; serviceId: string; title: string }) => !serviceIds.has(f.serviceId));

    if (orphanFeatures.length > 0) {
        warn(`Found ${orphanFeatures.length} orphaned ServiceFeature(s) with no parent Service:`);
        for (const f of orphanFeatures) {
            warn(`  • id=${f.id}, title="${f.title}", serviceId=${f.serviceId} (service not found)`);
        }
        if (!DRY_RUN) {
            // Safe deletion since parent is gone (cascade should have handled this)
            await prisma.serviceFeature.deleteMany({
                where: { id: { in: orphanFeatures.map((f: { id: string }) => f.id) } }
            });
            log(`Deleted ${orphanFeatures.length} orphaned ServiceFeature(s).`);
        } else {
            log('[DRY RUN] Would delete orphaned ServiceFeatures listed above.');
        }
    } else {
        log('No orphaned ServiceFeatures detected.');
    }

    // Applications without valid career
    const careers = await prisma.career.findMany({ select: { id: true } });
    const careerIds = new Set(careers.map((c: { id: string }) => c.id));
    const applications = await prisma.application.findMany({ select: { id: true, careerId: true } });
    const orphanApps = applications.filter((a: { id: string; careerId: string }) => !careerIds.has(a.careerId));
    if (orphanApps.length > 0) {
        warn(`Found ${orphanApps.length} Application(s) referencing non-existent Career records.`);
        warn('These were not deleted automatically. Review and clean up manually if needed.');
    } else {
        log('No orphaned Applications detected.');
    }

    // Comments without any parent record
    const allComments = await prisma.comment.findMany({
        select: { id: true, contentType: true, newsArticleId: true, projectId: true, serviceId: true, parentId: true }
    });
    const danglingComments = allComments.filter(
        (c: { id: string; contentType: string; newsArticleId: string | null; projectId: string | null; serviceId: string | null; parentId: string | null }) =>
            !c.newsArticleId && !c.projectId && !c.serviceId && !c.parentId
    );
    if (danglingComments.length > 0) {
        warn(`Found ${danglingComments.length} Comment(s) not linked to any record (no parent, no article/project/service).`);
    } else {
        log('No dangling Comments detected.');
    }

    // News articles with no content (neither content field nor contentBlocks)
    const allArticles = await prisma.newsArticle.findMany({
        select: { id: true, title: true, content: true, contentBlocks: true }
    });
    const emptyArticles = allArticles.filter(
        (a: { id: string; title: string; content: string | null; contentBlocks: unknown }) =>
            !a.content && !a.contentBlocks
    );
    if (emptyArticles.length > 0) {
        warn(`Found ${emptyArticles.length} NewsArticle(s) with no content and no contentBlocks — they will render empty.`);
        for (const a of emptyArticles) {
            warn(`  • id=${a.id}, title="${a.title}"`);
        }
    } else {
        log('No empty NewsArticles detected.');
    }
}


// ─── Final Summary ────────────────────────────────────────────────────────────

function printSummary() {
    console.log('\n' + '═'.repeat(60));
    console.log(DRY_RUN
        ? '  DRY RUN COMPLETE — No data was modified'
        : '  REPAIR COMPLETE — Data has been updated');
    console.log('═'.repeat(60));

    let totalScanned = 0;
    let totalRepaired = 0;

    for (const s of summaries) {
        const issues = [...new Set(s.issues)];
        console.log(`  ${s.model}: ${s.scanned} scanned, ${s.repaired} repaired${issues.length > 0 ? ` — [${issues.join(', ')}]` : ''}`);
        totalScanned += s.scanned;
        totalRepaired += s.repaired;
    }

    console.log('─'.repeat(60));
    console.log(`  TOTAL: ${totalScanned} records scanned, ${totalRepaired} records repaired`);

    if (DRY_RUN) {
        console.log('\n  💡 To apply repairs, run:');
        console.log('     DRY_RUN=false npx ts-node scripts/repairPrismaData.ts\n');
    }
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

async function main() {
    console.log('\n' + '═'.repeat(60));
    console.log(`  Prisma Data Integrity Repair Script`);
    console.log(`  Mode: ${DRY_RUN ? '🔍 DRY RUN (read-only)' : '🔧 APPLY REPAIRS'}`);
    console.log(`  Started: ${new Date().toISOString()}`);
    console.log('═'.repeat(60));

    await repairUsers();
    await repairNews();
    await repairProjects();
    await repairServices();
    await repairServiceFeatures();
    await repairCareers();
    await repairComments();
    await repairSubscribers();
    await repairCampaigns();
    await detectOrphans();

    printSummary();
}

main()
    .catch((e) => {
        console.error('\n❌ Repair script encountered a fatal error:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
