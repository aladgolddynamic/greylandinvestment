'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { getCompanyInfoAction } from '@/lib/actions/companyActions';
import { CompanyInfo } from '@/services/companyService';

export default function ContactInfo() {
    const [info, setInfo] = useState<CompanyInfo | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await getCompanyInfoAction();
            setInfo(data);
        };
        fetchInfo();
    }, []);

    if (!info) return null;

    const contactDetails = [
        {
            icon: <FaMapMarkerAlt />,
            label: 'OUR OFFICE',
            content: (
                <p className="text-gray-600 font-medium leading-relaxed">
                    {info.address.split(',').map((part, i) => (
                        <React.Fragment key={i}>
                            {part.trim()}
                            {i < info.address.split(',').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            )
        },
        {
            icon: <FaEnvelope />,
            label: 'EMAIL US',
            content: (
                <div className="space-y-1">
                    {info.emails.map((email, i) => (
                        <p key={i} className="text-gray-600 font-medium">{email}</p>
                    ))}
                </div>
            )
        },
        {
            icon: <FaPhoneAlt />,
            label: 'CALL US',
            content: (
                <div className="space-y-1">
                    {info.phones.map((phone, i) => (
                        <p key={i} className="text-gray-600 font-medium">{phone}</p>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            {contactDetails.map((item, index) => (
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
