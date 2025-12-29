import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Loader2, Calendar, FileType } from 'lucide-react';
import { cn } from '../utils/utils';

export default function ReportModal({ isOpen, onClose, onGenerate }) {
    const [reportType, setReportType] = useState('PDF');
    const [timeRange, setTimeRange] = useState('Last 1 month');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            await onGenerate({ reportType, timeRange });
            onClose();
        } catch (error) {
            console.error("Failed to generate report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-50 to-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                                    <FileText size={24} />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">MoneyBot Financial Report</h2>
                            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                This report includes transactions, credits, debits, and analytics.
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <FileType size={16} className="text-blue-500" />
                                    Report Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['PDF', 'CSV (Coming Soon)'].map((type) => (
                                        <button
                                            key={type}
                                            disabled={type.includes('Soon')}
                                            onClick={() => setReportType(type)}
                                            className={cn(
                                                "px-4 py-3 rounded-2xl text-sm font-medium transition-all border-2",
                                                reportType === type
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                                    : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100",
                                                type.includes('Soon') && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-500" />
                                    Time Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Last 1 month', 'Last 3 months', 'Last 6 months', 'Custom'].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setTimeRange(range)}
                                            className={cn(
                                                "px-4 py-3 rounded-2xl text-sm font-medium transition-all border-2 text-left",
                                                timeRange === range
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                                    : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-100"
                                            )}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-200 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} />
                                        Generate & Download
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full py-4 bg-white hover:bg-slate-50 text-slate-500 font-bold rounded-2xl transition-all border border-slate-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
