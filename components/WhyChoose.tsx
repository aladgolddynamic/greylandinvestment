import BulletPoint from './BulletPoint';
import { FaCheck } from 'react-icons/fa';

export default function WhyChoose() {
    const benefits = [
        {
            title: 'Dual-Domain Expertise',
            description: 'Expert combined in-depth software engineering and physical construction.',
        },
        {
            title: 'Agile Methodology',
            description: 'Efficient delivery timelines across IT and Engineering workflows.',
        },
        {
            title: 'Quality Assurance',
            description: 'Rigorous testing and safety standards in every digital and physical project.',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left side: Content */}
                    <div className="order-2 lg:order-1">
                        <div className="mb-10 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4 md:mb-6 leading-tight">
                                Why Choose <span className="text-primary-orange">Greyland</span>?
                            </h2>
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                                We combine technical digital expertise with a deep-seated commitment to physical infrastructure development and quality.
                            </p>
                        </div>

                        <div className="space-y-1">
                            {benefits.map((benefit, index) => (
                                <BulletPoint
                                    key={index}
                                    icon={<FaCheck />}
                                    title={benefit.title}
                                    description={benefit.description}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right side: Image + Badge */}
                    <div className="relative order-1 lg:order-2 mb-12 lg:mb-0">
                        <div
                            className="w-full h-[300px] md:h-[500px] rounded-2xl bg-cover bg-center shadow-2xl relative z-10"
                            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80)' }}
                        >
                            {/* Overlay for better badge visibility if needed */}
                            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                        </div>

                        {/* Experience Badge - Adjusted for mobile */}
                        <div className="absolute -bottom-4 lg:-bottom-6 -left-2 lg:-left-6 bg-white p-4 lg:p-6 rounded-xl shadow-2xl flex items-center gap-3 lg:gap-4 border border-gray-100 z-20 animate-fade-in group hover:scale-105 transition-transform duration-300 cursor-default">
                            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-primary-orange flex items-center justify-center text-primary-orange text-[10px] font-bold">
                                <span>✔</span>
                            </div>
                            <div>
                                <div className="text-lg lg:text-2xl font-black text-primary-dark leading-none">15+ Years</div>
                                <div className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Experience</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
