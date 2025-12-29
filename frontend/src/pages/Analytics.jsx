import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart3, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency } from '../utils/utils';
import ReportModal from '../components/ReportModal';

export default function Analytics() {
    const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

    const categories = [
        { name: 'Shopping', amount: formatCurrency(1240.00), percentage: '35%', color: 'bg-blue-500' },
        { name: 'Food & Drink', amount: formatCurrency(850.00), percentage: '24%', color: 'bg-emerald-500' },
        { name: 'Entertainment', amount: formatCurrency(620.00), percentage: '18%', color: 'bg-amber-500' },
        { name: 'Bills & Utilities', amount: formatCurrency(480.00), percentage: '14%', color: 'bg-rose-500' },
        { name: 'Other', amount: formatCurrency(310.00), percentage: '9%', color: 'bg-slate-400' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                            <TrendingUp size={12} /> +12.5%
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(45280.00)}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                            <TrendingDown size={20} />
                        </div>
                        <span className="text-rose-500 text-xs font-bold bg-rose-50 px-2 py-1 rounded-lg flex items-center gap-1">
                            <TrendingDown size={12} /> +4.2%
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(12450.00)}</h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                            <TrendingUp size={12} /> +8.1%
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Net Profit</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(32830.00)}</h3>
                </motion.div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Chart Mock for Spending - Simple Bars instead of real chart lib for brevity unless asked */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Spending by Category</h3>
                            <p className="text-slate-400 text-sm">Monthly breakdown</p>
                        </div>
                        <PieIcon className="text-slate-300" size={24} />
                    </div>

                    <div className="space-y-6">
                        {categories.map((cat, i) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 font-medium">{cat.name}</span>
                                    <span className="text-slate-900 font-bold">{cat.amount}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: cat.percentage }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className={cn("h-full rounded-full", cat.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Monthly Trend Mock */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-200"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Money Flow</h3>
                            <p className="text-slate-400 text-sm">Last 6 months trend</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-slate-400">Credit</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                <span className="text-slate-400">Debit</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 mt-12 px-2">
                        {[45, 78, 52, 90, 65, 85].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="w-full flex gap-1 items-end justify-center h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 + (i * 0.1) }}
                                        className="w-full max-w-[12px] bg-blue-600 rounded-t-full"
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val * 0.6}%` }}
                                        transition={{ duration: 0.8, delay: 0.7 + (i * 0.1) }}
                                        className="w-full max-w-[12px] bg-rose-500 rounded-t-full opacity-60"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        Download Full Report <ArrowUpRight size={16} />
                    </button>
                </motion.div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onGenerate={async ({ reportType, timeRange }) => {
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reports/generate`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // In a real app, include auth token: 'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ report_type: reportType, date_range: timeRange })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('Report error response:', errorText);
                            throw new Error('Failed to generate report');
                        }

                        const contentType = response.headers.get('Content-Type');
                        const disposition = response.headers.get('Content-Disposition');
                        let filename = `moneybot_financial_report_${new Date().toISOString().split('T')[0]}`;

                        if (disposition && disposition.includes('filename=')) {
                            filename = disposition.split('filename=')[1].replace(/"/g, '');
                        } else {
                            filename += contentType === 'text/csv' ? '.csv' : '.pdf';
                        }

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    } catch (error) {
                        console.error('Error downloading report:', error);
                        alert('Failed to generate report. Please try again.');
                    }
                }}
            />
        </div>
    );
}
