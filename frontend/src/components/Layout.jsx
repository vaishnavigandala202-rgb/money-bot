import React from 'react';
import { Home, PieChart, Wallet, Settings, LogOut, Bell, User } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../utils/utils';

export function Sidebar({ onLogout }) {
    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Wallet, label: 'Accounts', path: '/accounts' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 border-r border-slate-200 h-screen bg-white fixed left-0 top-0 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">M</div>
                <span className="font-bold text-xl tracking-tight text-slate-900">MoneyBot</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                            isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

export function Header({ title }) {
    return (
        <header className="h-20 border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full relative transition-all duration-200">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right flex flex-col">
                        <span className="text-sm font-bold text-slate-900">John Doe</span>
                        <span className="text-[10px] text-slate-400 font-medium">Premium Member</span>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 overflow-hidden">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export function MainLayout({ onLogout, title }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar onLogout={onLogout} />
            <div className="ml-64 flex flex-col min-h-screen">
                <Header title={title} />
                <main className="p-8 flex-1">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
