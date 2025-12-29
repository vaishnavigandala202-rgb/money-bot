import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Moon, Sun, Globe, Mail, Phone, Lock, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '../utils/utils';

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const sections = [
        {
            title: 'Profile Settings',
            items: [
                { icon: User, label: 'Personal Information', description: 'Update your name, email and avatar', action: 'Edit' },
                { icon: Mail, label: 'Email Address', description: 'john.doe@example.com', action: 'Change' },
                { icon: Phone, label: 'Phone Number', description: '+1 (555) 000-0000', action: 'Verify' },
            ]
        },
        {
            title: 'Security',
            items: [
                { icon: Shield, label: 'Two-Factor Authentication', description: 'Enhance your account security', toggle: true, value: true },
                { icon: Lock, label: 'Change Password', description: 'Update regularly for better security', action: 'Update' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: Globe, label: 'Language', description: 'English (United States)', action: 'Change' },
                { icon: darkMode ? Moon : Sun, label: 'Appearance', description: 'Switch between light and dark mode', toggle: true, value: darkMode, onChange: () => setDarkMode(!darkMode) },
                { icon: Bell, label: 'Notifications', description: 'Manage your alert preferences', toggle: true, value: notifications, onChange: () => setNotifications(!notifications) },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header / Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-8"
            >
                <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center text-blue-600 border-4 border-white shadow-inner">
                    <User size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">John Doe</h2>
                    <p className="text-slate-500 font-medium">Premium Member since 2023</p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">Verified</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">Gold Account</span>
                    </div>
                </div>
            </motion.div>

            {/* Settings Sections */}
            <div className="space-y-12">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="space-y-4"
                    >
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4">{section.title}</h3>
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            {section.items.map((item, i) => (
                                <div
                                    key={item.label}
                                    className={cn(
                                        "p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group",
                                        i !== section.items.length - 1 && "border-b border-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 group-hover:bg-white text-slate-400 group-hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-bold text-sm">{item.label}</p>
                                            <p className="text-slate-400 text-xs font-medium">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {item.toggle ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); item.onChange && item.onChange(); }}
                                                className={cn(
                                                    "w-12 h-6 rounded-full p-1 transition-colors relative",
                                                    item.value ? "bg-blue-600" : "bg-slate-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 bg-white rounded-full transition-transform",
                                                    item.value ? "translate-x-6" : "translate-x-0"
                                                )} />
                                            </button>
                                        ) : (
                                            <>
                                                <span className="text-blue-600 text-xs font-bold">{item.action}</span>
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-10 flex flex-col items-center"
            >
                <button className="flex items-center gap-3 px-8 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl font-bold transition-colors">
                    <LogOut size={20} />
                    Log out from all devices
                </button>
                <p className="text-slate-300 text-xs mt-4 italic font-medium">Version 2.4.0 (Build 541)</p>
            </motion.div>
        </div>
    );
}
