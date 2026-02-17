import { ReactNode } from 'react';

interface BulletPointProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function BulletPoint({ icon, title, description }: BulletPointProps) {
    return (
        <div className="flex items-start space-x-4 mb-8">
            <div className="flex-shrink-0 w-5 h-5 bg-primary-orange rounded-full flex items-center justify-center text-white text-[10px] mt-1 shadow-sm">
                {icon}
            </div>
            <div>
                <h4 className="text-base font-bold text-primary-dark mb-1 leading-tight">{title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
