import { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white p-8 rounded-xl border border-gray-100 hover:border-primary-orange/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
            <div className="w-14 h-14 bg-primary-orange rounded-lg flex items-center justify-center mb-6 text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-4 group-hover:text-primary-orange transition-colors duration-300">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
        </div>
    );
}
