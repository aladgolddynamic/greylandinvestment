'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getServiceByIdAction } from '@/lib/actions/serviceActions';
import { ServiceItem } from '@/services/serviceService';
import ServiceForm from '@/components/Admin/Services/ServiceForm';

export default function EditServicePage() {
    const { id } = useParams();
    const [service, setService] = useState<ServiceItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            if (typeof id === 'string') {
                const serviceData = await getServiceByIdAction(id);
                setService(serviceData || null);
            }
            setLoading(false);
        };
        fetchService();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Loading Service Details...</p>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Service not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-8">
            <ServiceForm initialData={service} isEdit={true} />
        </div>
    );
}
