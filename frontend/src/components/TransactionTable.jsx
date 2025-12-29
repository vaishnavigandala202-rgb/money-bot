import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/utils';

const transactions = [
    { id: 1, date: '2023-10-01', description: 'Apple Store', category: 'Technology', amount: -999.00, status: 'Completed' },
    { id: 2, date: '2023-10-02', description: 'Deposit from Employer', category: 'Salary', amount: 4500.00, status: 'Completed' },
    { id: 3, date: '2023-10-03', description: 'Starbucks', category: 'Food & Drink', amount: -6.50, status: 'Pending' },
    { id: 4, date: '2023-10-04', description: 'Rent Payment', category: 'Housing', amount: -1200.00, status: 'Completed' },
    { id: 5, date: '2023-10-05', description: 'Amazon', category: 'Shopping', amount: -45.99, status: 'Cancelled' },
];

export function TransactionTable() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {transactions.map((tx, idx) => (
                            <motion.tr
                                key={tx.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{tx.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{tx.description}</td>
                                <td className="px-6 py-4 text-slate-600">{tx.category}</td>
                                <td className={`px-6 py-4 font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                        tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                            'bg-slate-50 text-slate-500'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
