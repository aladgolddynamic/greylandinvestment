import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const all = await prisma.serviceFeature.findMany({ include: { service: true } });
const services = await prisma.service.findMany({ select: { id: true, title: true, slug: true } });

console.log('Services in DB:', JSON.stringify(services, null, 2));
console.log('\nService Features:', JSON.stringify(all.map(f => ({
    id: f.id,
    title: f.title,
    serviceId: f.serviceId,
    hasService: !!f.service
})), null, 2));

await prisma.$disconnect();
