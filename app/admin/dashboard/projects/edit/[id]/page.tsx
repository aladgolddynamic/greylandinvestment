'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProjectByIdAction } from '@/lib/actions/projectActions';
import { Project } from '@/types/project';
import ProjectForm from '@/components/Admin/Projects/ProjectForm';

export default function EditProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (typeof id === 'string') {
                const projectData = await getProjectByIdAction(id);
                setProject(projectData || null);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Loading Project Details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Project not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-8">
            <ProjectForm initialData={project} isEdit={true} />
        </div>
    );
}
