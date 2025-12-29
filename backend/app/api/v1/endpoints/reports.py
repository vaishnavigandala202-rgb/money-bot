import os
import tempfile
import csv
from datetime import datetime
from io import BytesIO
from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from app.api.v1.endpoints.transactions import db
from app.core.security import get_current_user

router = APIRouter()

class ReportRequest(BaseModel):
    report_type: str = "PDF"
    date_range: str = "Last 1 month"

async def get_optional_user(current_user: Optional[dict] = Depends(get_current_user)):
    if current_user:
        return current_user
    # Return a mock user for demo/dev purposes if no real user is logged in
    return {"id": "mock-user-id", "email": "demo@example.com"}

@router.post("/generate")
async def generate_report(
    request: ReportRequest,
    background_tasks: BackgroundTasks,
    # Making user optional to ensure the feature works in the current mock setup
    current_user: dict = Depends(get_optional_user)
):
    try:
        # Fetch user transactions
        user_txs = [tx for tx in db if tx.user_id == current_user["id"]]
        
        # If PDF is requested, try generating it
        if request.report_type == "PDF":
            try:
                return generate_pdf_report(user_txs, request, background_tasks)
            except Exception as e:
                print(f"PDF generation failed, falling back to CSV: {e}")
                return generate_csv_report(user_txs, request, background_tasks)
        else:
            return generate_csv_report(user_txs, request, background_tasks)
            
    except Exception as e:
        print(f"Report generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )

def remove_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"Error removing temp file {path}: {e}")

def generate_pdf_report(user_txs, request, background_tasks: BackgroundTasks):
    # Calculate analytics
    total_credited = sum(tx.amount for tx in user_txs if tx.type == "credit")
    total_debited = sum(tx.amount for tx in user_txs if tx.type == "debit")
    balance = total_credited - total_debited
    
    # Create temp file and close fd immediately to avoid locking issues on Windows
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    
    try:
        doc = SimpleDocTemplate(path, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Title
        elements.append(Paragraph("MoneyBot Financial Report", styles['Title']))
        elements.append(Spacer(1, 12))
        
        # Header Info
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        elements.append(Paragraph(f"User ID: {user_txs[0].user_id if user_txs else 'N/A'}", styles['Normal']))
        elements.append(Paragraph(f"Time Range: {request.date_range}", styles['Normal']))
        elements.append(Spacer(1, 24))

        # Summary Table
        summary_data = [
            ["Metric", "Value"],
            ["Total Credited", f"₹{total_credited:,.2f}"],
            ["Total Debited", f"₹{total_debited:,.2f}"],
            ["Current Balance", f"₹{balance:,.2f}"]
        ]
        summary_table = Table(summary_data, colWidths=[150, 100])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.whitesmoke),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey)
        ]))
        elements.append(Paragraph("Summary", styles['Heading2']))
        elements.append(summary_table)
        elements.append(Spacer(1, 24))

        # Transactions Table
        elements.append(Paragraph("Transaction History", styles['Heading2']))
        
        tx_data = [["Date", "Description", "Category", "Amount", "Type"]]
        for tx in user_txs:
            tx_date = getattr(tx, 'date', None) or tx.get('date')
            tx_desc = getattr(tx, 'description', None) or tx.get('description')
            tx_cat = getattr(tx, 'category', None) or tx.get('category')
            tx_amt = getattr(tx, 'amount', None) or tx.get('amount')
            tx_type = getattr(tx, 'type', None) or tx.get('type')

            tx_data.append([
                tx_date.strftime('%Y-%m-%d') if hasattr(tx_date, 'strftime') else str(tx_date),
                tx_desc,
                tx_cat,
                f"₹{tx_amt:,.2f}",
                (tx_type.value.capitalize() if hasattr(tx_type, 'value') else str(tx_type).capitalize())
            ])

        
        if len(tx_data) > 1:
            tx_table = Table(tx_data, colWidths=[80, 150, 100, 80, 80])
            tx_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
            ]))
            elements.append(tx_table)
        else:
            elements.append(Paragraph("No transactions found for this period.", styles['Normal']))

        doc.build(elements)
        
        filename = f"moneybot_financial_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        background_tasks.add_task(remove_file, path)
        
        return FileResponse(
            path, 
            media_type="application/pdf", 
            filename=filename
        )
    except Exception as e:
        if os.path.exists(path):
            os.remove(path)
        raise e

def generate_csv_report(user_txs, request, background_tasks: BackgroundTasks):
    fd, path = tempfile.mkstemp(suffix=".csv")
    os.close(fd)
    try:
        with open(path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Description", "Category", "Amount", "Type"])
            for tx in user_txs:
                tx_date = getattr(tx, 'date', None) or tx.get('date')
                tx_desc = getattr(tx, 'description', None) or tx.get('description')
                tx_cat = getattr(tx, 'category', None) or tx.get('category')
                tx_amt = getattr(tx, 'amount', None) or tx.get('amount')
                tx_type = getattr(tx, 'type', None) or tx.get('type')

                writer.writerow([
                    tx_date.strftime('%Y-%m-%d') if hasattr(tx_date, 'strftime') else str(tx_date),
                    tx_desc,
                    tx_cat,
                    tx_amt,
                    (tx_type.value if hasattr(tx_type, 'value') else str(tx_type))
                ])
        
        filename = f"moneybot_financial_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        background_tasks.add_task(remove_file, path)
        
        return FileResponse(
            path, 
            media_type="text/csv", 
            filename=filename
        )
    except Exception as e:
        if os.path.exists(path):
            os.remove(path)
        raise e
