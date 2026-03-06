'use client';

import React from 'react';
import ProjectForm from '@/components/Admin/Projects/ProjectForm';

export default function InitializeProjectPage() {
    return (
        <div className="max-w-7xl mx-auto pb-8">
            <ProjectForm isEdit={false} />
        </div>
    );
}
