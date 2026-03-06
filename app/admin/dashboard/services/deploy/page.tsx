'use client';

import React from 'react';
import ServiceForm from '@/components/Admin/Services/ServiceForm';

export default function DeployServicePage() {
    return (
        <div className="max-w-7xl mx-auto pb-10">
            <ServiceForm isEdit={false} />
        </div>
    );
}
