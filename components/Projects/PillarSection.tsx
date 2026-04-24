'use client';

import ProjectCard from './ProjectCard';
import { Project } from '@/constants/projectData';

interface PillarSectionProps {
    id: string;
    number: string;
    title: string;
    themeStatement: string;
    projects: Project[];
    badgeText: string;
    isLast?: boolean;
}

export default function PillarSection({
    id,
    number,
    title,
    themeStatement,
    projects,
    badgeText,
    isLast = false
}: PillarSectionProps) {
    return (
        <section id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${!isLast ? 'mb-32' : 'pb-10'}`}>
            <div className="max-w-3xl mx-auto text-center mb-16">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-[2px] w-12 bg-primary-orange"></div>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark">{number}. {title}</h2>
                    <div className="h-[2px] w-12 bg-primary-orange"></div>
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold text-primary-dark leading-tight mb-6">
                    {themeStatement}
                </h3>
                <div className="inline-block bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                    <span className="text-primary-dark font-black text-[10px] uppercase tracking-widest">{badgeText}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((project, index) => (
                    <ProjectCard key={index} index={index} {...project} slug={(project as any).slug || 'project'} />
                ))}
            </div>
        </section>
    );
}
