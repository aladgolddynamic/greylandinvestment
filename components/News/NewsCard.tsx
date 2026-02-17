'use client';

import { motion } from 'framer-motion';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

interface NewsCardProps {
    title: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    slug: string;
    index: number;
}

export default function NewsCard({ title, category, date, image, excerpt, slug, index }: NewsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-orange/30 transition-all duration-300 shadow-xl"
        >
            {/* Featured Image */}
            <div className="relative h-56 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-40"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-primary-orange text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm shadow-lg">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <FaCalendarAlt className="text-primary-orange" />
                    {date}
                </div>

                <h3 className="text-xl font-bold text-primary-dark mb-4 leading-tight group-hover:text-primary-orange transition-colors line-clamp-2">
                    {title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                    {excerpt}
                </p>

                <a
                    href={`/news/${slug}`}
                    className="inline-flex items-center gap-2 text-primary-orange font-black text-[10px] uppercase tracking-[0.2em] hover:gap-4 transition-all"
                >
                    Read Article <FaArrowRight />
                </a>
            </div>
        </motion.div>
    );
}
