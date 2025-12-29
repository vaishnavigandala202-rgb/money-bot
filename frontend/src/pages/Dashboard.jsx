import React from 'react';
import { StatCard } from '../components/StatCard';
import { TransactionTable } from '../components/TransactionTable';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/utils';

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    amount={formatCurrency(12850.00)}
                    change="+2.5%"
                    type="increase"
                    icon="balance"
                />
                <StatCard
                    title="Total Credited"
                    amount={formatCurrency(4500.00)}
                    change="+12%"
                    type="increase"
                    icon="credit"
                />
                <StatCard
                    title="Total Debited"
                    amount={formatCurrency(3240.50)}
                    change="-5%"
                    type="decrease"
                    icon="debit"
                />
                <StatCard
                    title="Transactions Count"
                    amount="48"
                    change="+8"
                    type="increase"
                    icon="activity"
                />
            </div>


            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <TransactionTable />
                </motion.div>
            </div>
        </div>
    );
}
