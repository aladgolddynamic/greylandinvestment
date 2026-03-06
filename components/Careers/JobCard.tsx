import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaArrowRight, FaPaperPlane } from 'react-icons/fa';

interface JobCardProps {
    title: string;
    department: string;
    location: string;
    employmentType: string;
    excerpt: string;
    slug: string;
    deadline?: string;
    index: number;
}

export default function JobCard({ title, department, location, employmentType, excerpt, slug, deadline, index }: JobCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-primary-orange/20 transition-all duration-300 flex flex-col h-full"
        >
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-orange-50 text-primary-orange text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">
                    {department}
                </span>
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <FaMapMarkerAlt className="text-primary-orange/60" />
                    {location}
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-primary-dark mb-4 leading-tight group-hover:text-primary-orange transition-colors">
                {title}
            </h3>

            <p className="text-gray-600 text-sm font-medium mb-8 leading-relaxed line-clamp-2">
                {excerpt}
            </p>

            {deadline && (
                <div className="mt-auto mb-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 w-fit px-3 py-1 rounded-sm border border-red-100">
                    <FaClock size={10} /> Deadline: {deadline}
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <FaBriefcase className="text-primary-orange/60" />
                    {employmentType}
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href={`/careers/${slug}`}
                        className="text-gray-400 hover:text-primary-dark font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                    >
                        View Details
                    </a>
                    <a
                        href={`/careers/${slug}#apply`}
                        className="inline-flex items-center gap-2 bg-primary-orange text-white px-5 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 shadow-md shadow-primary-orange/10"
                    >
                        Apply Now <FaPaperPlane size={10} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
