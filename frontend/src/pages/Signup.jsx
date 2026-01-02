import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, ShieldCheck, User } from 'lucide-react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConfigured) {
            setError("App not configured.");
            return;
        }

        setLoading(true);
        setError(null);

        const cleanEmail = email.trim();

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signUpError) {
                // If user already exists, try to log in automatically to satisfy "frictionless" request
                if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
                    console.log("User exists, attempting auto-login...");
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email: cleanEmail,
                        password,
                    });

                    if (signInError) {
                        // Keep the original specific error (e.g. Invalid login credentials) if auto-login fails
                        if (signInError.message.includes("Invalid login credentials")) {
                            throw new Error("Account exists, but password was incorrect.");
                        }
                        throw signInError;
                    }

                    // Auto-login success
                    navigate('/');
                    return;
                }

                throw signUpError;
            }

            if (data) {
                if (data.session) {
                    navigate('/');
                } else if (data.user) {
                    alert('Registration successful! Please check your email for verification if enabled, or log in.');
                    navigate('/login');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const debugUrl = import.meta.env.VITE_SUPABASE_URL || "undefined";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/40 p-10 border border-slate-100 glass relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create Account (Debug)</h1>
                        <p className="text-slate-500 font-medium">Join MoneyBot today</p>
                    </div>

                    {!isConfigured && (
                        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 text-sm">
                            <p className="font-bold mb-1">Configuration Error</p>
                            <p>Supabase keys missing in Vercel.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                            Supabase says: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ""))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                            {!loading && <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
                        </p>

                        <div className="mt-8 p-4 bg-slate-100 rounded text-xs text-left overflow-auto font-mono text-slate-500">
                            <p className="font-bold">DEBUG INFO:</p>
                            <p>Configured: {isConfigured ? 'YES' : 'NO'}</p>
                            <p>URL: {debugUrl.substring(0, 15)}...</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
