'use client';

import React, { useState, useEffect } from 'react';
import {
    getServicesAction,
    deleteServiceAction,
    updateServiceAction
} from '@/lib/actions/serviceActions';
import { ServiceItem } from '@/types/service';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/utils/useDebounce';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaIcons,
    FaEllipsisV,
    FaCode, FaCogs, FaProjectDiagram, FaShieldAlt, FaChartBar, FaNetworkWired,
    FaBuilding, FaHardHat, FaTools, FaTruckLoading, FaDesktop, FaBoxOpen,
    FaWarehouse, FaClipboardCheck, FaChartPie, FaUserShield, FaSearchPlus,
    FaFileAlt, FaLock, FaTasks, FaGraduationCap, FaCheckCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
    FaCode: <FaCode />,
    FaCogs: <FaCogs />,
    FaProjectDiagram: <FaProjectDiagram />,
    FaShieldAlt: <FaShieldAlt />,
    FaChartBar: <FaChartBar />,
    FaNetworkWired: <FaNetworkWired />,
    FaBuilding: <FaBuilding />,
    FaHardHat: <FaHardHat />,
    FaTools: <FaTools />,
    FaTruckLoading: <FaTruckLoading />,
    FaDesktop: <FaDesktop />,
    FaBoxOpen: <FaBoxOpen />,
    FaWarehouse: <FaWarehouse />,
    FaClipboardCheck: <FaClipboardCheck />,
    FaChartPie: <FaChartPie />,
    FaUserShield: <FaUserShield />,
    FaSearchPlus: <FaSearchPlus />,
    FaFileAlt: <FaFileAlt />,
    FaLock: <FaLock />,
    FaTasks: <FaTasks />,
    FaGraduationCap: <FaGraduationCap />,
    FaCheckCircle: <FaCheckCircle />
};

export default function ServicesManager() {
    const router = useRouter();
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 300);
    const [activeCategory, setActiveCategory] = useState<string>('ALL');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        const data = await getServicesAction();
        setServices(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Permanently decommission this service offering?')) {
            await deleteServiceAction(id);
            fetchServices();
        }
    };

    const categories = ['ALL', 'TECHNOLOGY', 'AUDIT & PROTECTION', 'ENGINEERING', 'PROCUREMENT'];

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchesCategory = activeCategory === 'ALL' || service.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">
                        Service <span className="text-primary-orange">Architecture</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Define Business Offerings, Value Propositions, and Strategic Capabilities
                    </p>
                </div>
                <button
                    onClick={() => router.push('/admin/dashboard/services/deploy')}
                    className="flex items-center gap-3 px-8 py-4 bg-primary-dark hover:bg-primary-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary-orange/20"
                >
                    <FaPlus /> Deploy New Service
                </button>
            </div>

            {/* Categorization and Search */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat
                                ? 'bg-primary-dark text-white border-primary-dark shadow-lg'
                                : 'bg-white text-gray-400 border-gray-100 hover:border-primary-orange/30'
                                }`}
                        >
                            {cat.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Filter by Service Designation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-gray-100 shadow-xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active services matching criteria.</p>
                    </div>
                ) : (
                    filteredServices.map((service) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 flex flex-col group hover:border-primary-orange/20 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] text-primary-orange flex items-center justify-center group-hover:bg-primary-orange group-hover:text-white transition-all">
                                    {ICON_COMPONENTS[service.icon] || <FaIcons size={20} />}
                                </div>
                                <button className="p-2 text-gray-200 hover:text-primary-dark transition-colors">
                                    <FaEllipsisV size={14} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{service.category}</span>
                                    {service.updatedAt && (
                                        <span className="text-[8px] font-bold text-primary-orange uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md">
                                            Upd: {new Date(service.updatedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xs font-black text-primary-dark uppercase tracking-tight">{service.title}</h3>
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                                {service.bullets.slice(0, 3).map((bullet: string, idx: number) => (
                                    <div key={idx} className="flex gap-3 text-[10px] text-gray-400 font-medium leading-relaxed">
                                        <div className="mt-1 w-1 h-1 rounded-full bg-primary-orange shrink-0"></div>
                                        <p className="line-clamp-2 italic">"{bullet}"</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex gap-4">
                                <a href={`/admin/dashboard/services/edit/${service.id}`} title="Edit Specifications" className="flex-1 py-3.5 bg-[#F8FAFC] text-gray-400 hover:bg-primary-dark hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                    <FaEdit /> Modify
                                </a>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    title="Decommission"
                                    className="px-4 py-3.5 bg-[#F8FAFC] text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
