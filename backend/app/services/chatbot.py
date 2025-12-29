import re
import locale
from datetime import date, timedelta
from typing import List, Optional
from app.schemas.transaction import Transaction

class ChatbotService:
    @staticmethod
    def format_inr(amount: float) -> str:
        # Simple Indian numbering system formatter (Lakhs/Crores)
        # 123456.78 -> 1,23,456.78
        is_negative = amount < 0
        amount = abs(amount)
        s = f"{amount:.2f}"
        parts = s.split('.')
        integer_part = parts[0]
        decimal_part = parts[1]
        
        if len(integer_part) <= 3:
            res = integer_part
        else:
            last_three = integer_part[-3:]
            remaining = integer_part[:-3]
            # Group by 2 for the rest
            groups = []
            while len(remaining) > 0:
                groups.append(remaining[-2:])
                remaining = remaining[:-2]
            res = ",".join(reversed(groups)) + "," + last_three
        
        final = f"₹{res}.{decimal_part}"
        return f"-{final}" if is_negative else final

    @staticmethod
    def process_message(message: str, transactions: List[Transaction]) -> str:
        message = message.lower()
        today = date.today()
        start_of_month = today.replace(day=1)
        
        # 1. What is my balance?
        if any(kw in message for kw in ["balance", "how much money"]):
            total_credit = sum(tx.amount for tx in transactions if tx.type == "credit")
            total_debit = sum(tx.amount for tx in transactions if tx.type == "debit")
            balance = total_credit - total_debit
            return f"Your current balance is {ChatbotService.format_inr(balance)}."

        # 2. Total credited this month
        if any(kw in message for kw in ["credited", "income", "received"]) and "this month" in message:
            credited = sum(tx.amount for tx in transactions if tx.date >= start_of_month and tx.type == "credit")
            return f"Total credited this month: {ChatbotService.format_inr(credited)}."

        # 3. Total debited this month
        if any(kw in message for kw in ["debited", "spent", "expenses"]) and "this month" in message:
            debited = sum(tx.amount for tx in transactions if tx.date >= start_of_month and tx.type == "debit")
            return f"Total debited this month: {ChatbotService.format_inr(debited)}."

        # 4. Last 5 transactions
        if any(kw in message for kw in ["last 5", "recent", "latest"]) and "transaction" in message:
            sorted_txs = sorted(transactions, key=lambda x: x.date, reverse=True)[:5]
            if not sorted_txs:
                return "I couldn't find any recent transactions."
            
            tx_list = "\n".join([f"• {tx.date}: {tx.description} ({ChatbotService.format_inr(tx.amount)} - {tx.type})" for tx in sorted_txs])
            return f"Here are your last 5 transactions:\n{tx_list}"

        # 5. Spending by category
        if "category" in message or "spending by" in message:
            category_totals = {}
            for tx in transactions:
                if tx.type == "debit":
                    category_totals[tx.category] = category_totals.get(tx.category, 0) + tx.amount
            
            if not category_totals:
                return "You haven't had any spending yet."
            
            # Sort categories by spending amount
            sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
            cat_list = "\n".join([f"• {cat}: {ChatbotService.format_inr(amt)}" for cat, amt in sorted_categories])
            return f"Here is your spending by category:\n{cat_list}"

        return "I can help you with questions like 'What is my balance?', 'Total spent this month', 'Recent transactions', or 'Spending by category'. How can I assist you today?"

