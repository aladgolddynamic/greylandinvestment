interface StatCardProps {
    value: string;
    label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center border border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-primary-orange mb-2">
                {value}
            </div>
            <div className="text-sm md:text-base text-gray-200 font-medium">
                {label}
            </div>
        </div>
    );
}
