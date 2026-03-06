'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaChevronRight, FaArrowLeft } from 'react-icons/fa';

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login(identifier, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-orange/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-dark/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Back to Site */}
                <motion.a
                    href="/"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-12 hover:text-primary-orange transition-colors"
                >
                    <FaArrowLeft size={10} /> Back to Greyland
                </motion.a>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 md:p-12 rounded-[2rem] border border-gray-100 shadow-2xl relative"
                >
                    <div className="mb-12">
                        <img src="/logo.png" alt="Greyland" className="h-10 w-auto mb-6 grayscale" />
                        <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mb-2">Admin Portal</h1>
                        <div className="h-1 w-12 bg-primary-orange rounded-full mb-4"></div>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Email or Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-orange transition-colors">
                                    <FaEnvelope size={14} />
                                </div>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="admin or admin@greyland.com"
                                    required
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Secret Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-orange transition-colors">
                                    <FaLock size={14} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••shakefire"
                                    required
                                    className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-orange/10 focus:border-primary-orange transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 border border-red-100 p-4 rounded-xl"
                                >
                                    <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-dark hover:bg-primary-orange text-white font-black py-5 rounded-xl uppercase tracking-widest text-[10px] shadow-xl hover:shadow-primary-orange/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Request Access <FaChevronRight size={10} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Note */}
                    <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed px-4">
                            Access is strictly monitored for security compliance. Unauthorized attempts will be logged.
                        </p>
                    </div>
                </motion.div>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Greyland Investment Ltd. &copy; {new Date().getFullYear()} Digital Sentinel v1.0
                    </p>
                </div>
            </div>
        </main>
    );
}
