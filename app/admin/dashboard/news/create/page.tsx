'use client';

import React from 'react';
import NewsForm from '@/components/Admin/News/NewsForm';

export default function CreateNewsPage() {
    return (
        <div className="max-w-7xl mx-auto pb-20">
            <NewsForm isEdit={false} />
        </div>
    );
}
