import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

// Next.js 15+ async params handling wrapper
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await the params in Next 15+ (if using Turbopack Next 16)
  const { slug } = await params;
  
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return {
      title: 'Project Not Found | Greyland Investment Ltd',
    };
  }

  // Fallback to basic project title and description if SEO fields are empty
  const metaTitle = project.metaTitle || `${project.title} | Greyland Projects`;
  const metaDesc = project.metaDescription || project.description;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: project.image ? [project.image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.metaTitle || project.title,
    description: project.metaDescription || project.description,
    image: project.image,
    author: {
      "@type": "Organization",
      name: "Greyland Investment Ltd"
    },
    publisher: {
      "@type": "Organization",
      name: "Greyland Investment Ltd",
      logo: {
        "@type": "ImageObject",
        url: "https://greylandinvest.com.ng/logo.png"
      }
    },
    datePublished: project.createdAt.toISOString(),
    dateModified: project.updatedAt.toISOString(),
  };

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-gradient-to-r from-[#3F4A5A] to-[#5B5F73] pt-32 pb-24 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-orange blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="text-primary-orange font-black text-[10px] uppercase tracking-widest bg-white px-3 py-1 rounded-sm mb-4 inline-block">
              {project.industry}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6 drop-shadow-sm">
              {project.title}
            </h1>
            <p className="text-gray-300 font-medium text-sm md:text-lg max-w-2xl">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {project.image && (
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-auto rounded-2xl shadow-xl border border-gray-100"
              />
            )}
            
            <div className="prose prose-lg max-w-none prose-headings:text-primary-dark prose-a:text-primary-orange">
              <h2>Project Overview</h2>
              <p>{project.description}</p>
              
              <h3>Key Deliverables</h3>
              <ul>
                {Array.isArray(project.deliverables) && project.deliverables.map((item, idx) => (
                  <li key={idx} className="font-semibold text-gray-700">{String(item)}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
              <h3 className="text-primary-dark font-black uppercase tracking-widest text-sm border-b pb-4">Project Details</h3>
              
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Client</p>
                <p className="text-gray-800 font-semibold">{project.client || 'Confidential'}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Location</p>
                <p className="text-gray-800 font-semibold">{project.location}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Duration</p>
                <p className="text-gray-800 font-semibold">{project.duration}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">Status</p>
                <p className="text-primary-orange font-bold">{project.status}</p>
              </div>
            </div>
            
            {project.tags && project.tags.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-primary-dark font-black uppercase tracking-widest text-sm border-b pb-4 mb-6">Technologies & Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
