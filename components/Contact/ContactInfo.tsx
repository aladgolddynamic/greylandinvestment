'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

export default function ContactInfo() {
    const info = [
        {
            icon: <FaMapMarkerAlt />,
            label: 'OUR OFFICE',
            content: (
                <p className="text-gray-600 font-medium leading-relaxed">
                    Suite 302, Engineering Plaza,<br />
                    Airport Road, Lugbe, Abuja, Nigeria
                </p>
            )
        },
        {
            icon: <FaEnvelope />,
            label: 'EMAIL US',
            content: (
                <div className="space-y-1">
                    <p className="text-gray-600 font-medium">info@greylandinvestment.com</p>
                    <p className="text-gray-600 font-medium">support@greylandinvestment.com</p>
                </div>
            )
        },
        {
            icon: <FaPhoneAlt />,
            label: 'CALL US',
            content: (
                <div className="space-y-1">
                    <p className="text-gray-600 font-medium">+234 (0) 803 123 4567</p>
                    <p className="text-gray-600 font-medium">+234 (0) 901 987 6543</p>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            {info.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-8 rounded-xl border border-gray-100 hover:border-primary-orange/50 hover:shadow-2xl transition-all duration-300 group"
                >
                    <div className="w-14 h-14 bg-orange-50 rounded-lg flex items-center justify-center text-primary-orange text-2xl group-hover:bg-primary-orange group-hover:text-white transition-all duration-300">
                        {item.icon}
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-primary-orange font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3">
                            {item.label}
                        </h4>
                        {item.content}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
