export default function Stats() {
    const stats = [
        { value: '120+', label: 'TECH SOLUTIONS' },
        { value: '45', label: 'ACTIVE SITES' },
        { value: '300+', label: 'EMPLOYEES' },
        { value: '100%', label: 'CLIENT RETENTION' },
    ];

    return (
        <section id="projects" className="bg-[#3D405B] py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center items-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="text-3xl md:text-5xl font-black text-white mb-1.5 md:mb-2 leading-none">
                                {stat.value}
                            </div>
                            <div className="text-[8px] md:text-[10px] font-extrabold text-primary-orange uppercase tracking-[.25em]">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
