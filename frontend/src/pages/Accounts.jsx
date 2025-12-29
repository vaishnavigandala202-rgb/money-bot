import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn, formatCurrency } from '../utils/utils';

const accounts = [
    {
        id: 1,
        name: 'Main Savings',
        number: '**** 4290',
        balance: 8450.00,
        type: 'Savings',
        color: 'bg-blue-600',
    },
    {
        id: 2,
        name: 'Investment Portfolio',
        number: '**** 8812',
        balance: 3200.50,
        type: 'Investment',
        color: 'bg-emerald-600',
    },
    {
        id: 3,
        name: 'Daily Expenses',
        number: '**** 1102',
        balance: 1199.50,
        type: 'Checking',
        color: 'bg-slate-800',
    }
];


export default function Accounts() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accounts.map((account, index) => (
                    <motion.div
                        key={account.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 items-start flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className={cn("w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white", account.color)}>
                            <Landmark size={24} />
                        </div>
                        <div className="space-y-1 mb-8">
                            <h3 className="text-slate-500 font-medium text-sm">{account.name}</h3>
                            <p className="text-slate-400 text-xs">{account.number}</p>
                        </div>
                        <div className="mt-auto w-full flex items-end justify-between">
                            <span className="text-2xl font-bold text-slate-900">{formatCurrency(account.balance)}</span>
                            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 transition-colors">

                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden"
            >
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-3xl font-bold leading-tight">Apply for a New <br /> Premium Credit Card</h2>
                        <p className="text-slate-400 max-w-sm">Enjoy up to 5% cashback on all travel expenses and exclusive airport lounge access.</p>
                        <button className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-50 transition-colors">Apply Now</button>
                    </div>
                    <div className="relative w-full max-w-[300px] aspect-[1.6/1] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="flex justify-between items-start mb-12">
                            <Wallet size={24} />
                            <span className="font-medium">Premium</span>
                        </div>
                        <div className="space-y-4">
                            <p className="tracking-[0.2em] font-mono">**** **** **** 5521</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase text-blue-200">Card Holder</p>
                                    <p className="font-semibold">JOHN DOE</p>
                                </div>
                                <div className="w-10 h-6 bg-yellow-400/20 rounded-md backdrop-blur-sm border border-yellow-400/30"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full -ml-10 -mb-10"></div>
            </motion.div>
        </div>
    );
}
