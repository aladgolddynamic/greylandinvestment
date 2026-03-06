'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getJobByIdAction } from '@/lib/actions/careersActions';
import { Job } from '@/types/careers';
import JobForm from '@/components/Admin/Careers/JobForm';

export default function EditCareerPage() {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            if (typeof id === 'string') {
                const jobData = await getJobByIdAction(id);
                setJob(jobData || null);
            }
            setLoading(false);
        };
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Loading Job Details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Job listing not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <JobForm initialData={job} isEdit={true} />
        </div>
    );
}
