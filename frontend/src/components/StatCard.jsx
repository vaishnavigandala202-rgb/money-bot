import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, CreditCard, Activity } from 'lucide-react';
import { cn } from '../utils/utils';

const icons = {
    balance: CreditCard,
    credit: ArrowUpRight,
    debit: ArrowDownRight,
    activity: Activity,
};

export function StatCard({ title, amount, change, type, icon }) {
    const Icon = icons[icon] || icons.balance;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn(
                    "p-2 rounded-xl",
                    type === 'increase' ? "bg-emerald-50 text-emerald-600" :
                        type === 'decrease' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                )}>
                    <Icon size={24} />
                </div>
                {change && (
                    <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        type === 'increase' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        {change}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {amount}
                </h3>
            </div>
        </motion.div>
    );
}
