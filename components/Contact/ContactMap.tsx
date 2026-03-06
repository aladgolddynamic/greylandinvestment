'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { getCompanyInfoAction } from '@/lib/actions/companyActions';
import { CompanyInfo } from '@/types/company';

export default function ContactMap() {
    const [info, setInfo] = useState<CompanyInfo | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await getCompanyInfoAction();
            setInfo(data);
        };
        fetchInfo();
    }, []);

    if (!info) return null;

    return (
        <section className="py-20 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h3 className="text-2xl font-extrabold text-primary-dark mb-2">Our Location</h3>
                    <div className="h-1 w-12 bg-primary-orange"></div>
                </div>

                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-xl group">
                    {/* Interactive Google Map */}
                    <div className="absolute inset-0 bg-gray-200">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${info.location.lat},${info.location.lng}&z=${info.location.zoom}&output=embed`}
                        ></iframe>
                    </div>

                    {/* HQ Floating Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="absolute bottom-10 left-4 md:left-10 right-4 md:right-auto bg-white/95 backdrop-blur-md p-6 rounded-lg border border-gray-200 shadow-2xl max-w-sm"
                    >
                        <h4 className="text-primary-orange font-black text-[10px] uppercase tracking-widest mb-3">HEADQUARTERS</h4>
                        <p className="text-primary-dark font-bold text-sm leading-tight">{info.address}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
