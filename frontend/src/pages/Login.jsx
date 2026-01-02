import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { supabase, isConfigured } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConfigured) {
            setError("Cannot sign in: Application is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
            return;
        }

        setLoading(true);
        setError(null);

        const cleanEmail = email.trim();

        try {
            // Attempt to Login first
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });

            if (signInError) {
                // If login fails (user doesn't exist OR wrong password) and it's a Gmail address, try to auto-signup.
                // We removed the strict error message check to be more robust.
                if (cleanEmail.toLowerCase().endsWith('@gmail.com')) {
                    console.log("Auto-signup attempt for Gmail user...");
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email: cleanEmail,
                        password,
                    });

                    if (signUpError) {
                        // If signup also fails...
                        console.error("Auto-signup failed:", signUpError);

                        // If user already exists, it means the Login failed due to Wrong Password.
                        // We should show the original Login error (Invalid credentials) to avoid leaking user existence logic
                        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
                            throw signInError;
                        }

                        // For other errors (e.g. Rate limit, Validation), show the Signup error as it's more specific
                        throw signUpError;
                    }

                    if (signUpData.session) {
                        // Success! Session created immediately
                        navigate('/');
                        return;
                    } else if (signUpData.user) {
                        throw new Error("Account created! Please check your email to confirm.");
                    }
                } else {
                    // Not a gmail address, just show the login error
                    throw signInError;
                }
            } else {
                // Login successful
                navigate('/');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
                    </div>

                    {!isConfigured && (
                        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 text-sm">
                            <p className="font-bold mb-1">Configuration Error</p>
                            <p>Supabase connection keys are missing. Please add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your Vercel Environment Variables.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    onChange={(e) => setEmail(e.target.value)}
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

                        <div className="flex items-center justify-between text-sm py-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign up for free</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
