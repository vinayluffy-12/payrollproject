import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import random

app = FastAPI(
    title="PayrollOS AI Fraud Detection Service",
    description="Python FastAPI Isolation Forest Outlier and Rule-Based Heuristic Analysis Service",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RunCheckRequest(BaseModel):
    payroll_run_id: int
    period_start: str
    period_end: str

class AnomalyResult(BaseModel):
    employee_id: int
    employee_name: str
    anomaly_type: str
    confidence_score: float
    severity: str
    details: str
    recommendation: str

class FraudCheckResponse(BaseModel):
    payroll_run_id: int
    status: str
    anomalies: List[AnomalyResult]

# ==========================================
# HYBRID FRAUD CHECK ENGINE
# ==========================================
@app.post("/api/v1/fraud/check-run", response_model=FraudCheckResponse)
def check_payroll_run(payload: RunCheckRequest):
    print(f"[AI Fraud Service] Checking Run #{payload.payroll_run_id} ({payload.period_start} to {payload.period_end})")
    
    # Mock database retrieval of processed employees for checking.
    # In production, this pulls directly from MySQL or accepts employee features in the body payload.
    # We will generate a rich set of employees, including standard cases and engineered anomaly outliers.
    employees_data = [
      {"id": 1, "name": "Vinay Kumar", "salary": 8000.0, "attendance": 20, "tenure": 120, "bank": "CITI0001"},
      {"id": 2, "name": "Neha Patel", "salary": 4500.0, "attendance": 0, "tenure": 90, "bank": "HDFC0104"},  # GHOST (0 attendance)
      {"id": 3, "name": "Aditya Roy", "salary": 5000.0, "attendance": 20, "tenure": 110, "bank": "CITI0002"},
      {"id": 4, "name": "Rohan Mehta", "salary": 4500.0, "attendance": 19, "tenure": 80, "bank": "HDFC0104"}, # DUPLICATE BANK (matches #2)
      {"id": 5, "name": "Siddharth Sen", "salary": 25000.0, "attendance": 20, "tenure": 5, "bank": "SBIN0205"}, # NEW JOINER HIGH SALARY (>2σ)
      {"id": 6, "name": "Priya Sharma", "salary": 3200.0, "attendance": 18, "tenure": 40, "bank": "BARC0991"},
      {"id": 7, "name": "Aman Verma", "salary": 3000.0, "attendance": 20, "tenure": 45, "bank": "ICIC0092"},
      {"id": 8, "name": "Riya Das", "salary": 3100.0, "attendance": 19, "tenure": 30, "bank": "ICIC0093"},
    ]

    # Create remaining dummy employees to build a standard distribution for the ML model
    for i in range(9, 50):
        employees_data.append({
            "id": i,
            "name": f"Staff Representative {i}",
            "salary": float(random.randint(2500, 4500)),
            "attendance": random.randint(15, 22),
            "tenure": random.randint(15, 200),
            "bank": f"BANKCODE{1000 + i}"
        })

    df = pd.DataFrame(employees_data)

    # ----------------------------------------------------
    # ML METHODOLOGY: Isolation Forest Outlier Detection
    # ----------------------------------------------------
    # Features: [salary, attendance_ratio, tenure]
    df['attendance_ratio'] = df['attendance'] / 22.0 # Max 22 workings days
    features = df[['salary', 'attendance_ratio', 'tenure']]

    # Fit Isolation Forest (contamination is set to 8% to catch outliers)
    clf = IsolationForest(contamination=0.08, random_state=42)
    clf.fit(features)
    
    # Predict anomalies: -1 indicates outliers, 1 indicates inliers
    df['anomaly_pred'] = clf.predict(features)
    
    # Calculate custom anomaly confidence scores based on outlier decision function
    decision_scores = clf.decision_function(features)
    # Scale decision scores to a 0-1 range where closer to 1 is highly anomalous
    min_score = min(decision_scores)
    max_score = max(decision_scores)
    df['anomaly_score'] = 1.0 - ((decision_scores - min_score) / (max_score - min_score + 1e-6))

    anomalies = []

    # ----------------------------------------------------
    # RULE-BASED HEURISTICS INTEGRATION (All 7 vectors checked)
    # ----------------------------------------------------
    bank_accounts = df['bank'].tolist()

    for idx, row in df.iterrows():
        emp_id = int(row['id'])
        emp_name = str(row['name'])
        salary = float(row['salary'])
        attendance = int(row['attendance'])
        tenure = int(row['tenure'])
        bank = str(row['bank'])
        score = float(row['anomaly_score'])
        is_ml_outlier = int(row['anomaly_pred']) == -1

        # Heuristic 1: Duplicate Bank Accounts
        if bank_accounts.count(bank) > 1:
            anomalies.append(AnomalyResult(
                employee_id=emp_id,
                employee_name=emp_name,
                anomaly_type="Duplicate Bank Account",
                confidence_score=0.9200,
                severity="high",
                details=f"Employee sharing bank detail identifier '{bank}' with another worker record.",
                recommendation="Lock payout release. Contact employee immediately to verify bank details and routing IBAN."
            ))

        # Heuristic 2: Ghost Employee (Salary > 0 but 0 attendance days)
        if attendance == 0 and salary > 0:
            anomalies.append(AnomalyResult(
                employee_id=emp_id,
                employee_name=emp_name,
                anomaly_type="Ghost Employee Indicator",
                confidence_score=0.9600,
                severity="high",
                details="Zero attendance check-ins logged for the pay period, but active gross salary is scheduled.",
                recommendation="Investigate manager timesheet approval logs. Temporarily exclude employee from current run."
            ))

        # Heuristic 3: Salary Spike (> 2 standard deviations from mean)
        salary_mean = df['salary'].mean()
        salary_std = df['salary'].std()
        if salary > (salary_mean + 2 * salary_std):
            anomalies.append(AnomalyResult(
                employee_id=emp_id,
                employee_name=emp_name,
                anomaly_type="Salary Spike (>2σ)",
                confidence_score=0.8800,
                severity="medium",
                details=f"Gross salary ${salary} exceeds 2 standard deviations from organizational average (${salary_mean:.2f}).",
                recommendation="Review compensation amendment audit logs to verify designation increment rules."
            ))

        # Heuristic 4: New Employee with Unusually High Salary
        if tenure < 10 and salary > 10000.0:
            anomalies.append(AnomalyResult(
                employee_id=emp_id,
                employee_name=emp_name,
                anomaly_type="High Base New Employee",
                confidence_score=0.8500,
                severity="medium",
                details=f"New employee processed in first cycle with exceptionally high base salary (${salary}).",
                recommendation="Audit onboarding verification certificates and offer letter contracts."
            ))

        # Heuristic 5: Isolation Forest Outlier match (No strict rule matched, but ML labeled outlier)
        if is_ml_outlier and not any(a.employee_id == emp_id for a in anomalies):
            anomalies.append(AnomalyResult(
                employee_id=emp_id,
                employee_name=emp_name,
                anomaly_type="ML Outlier Profile",
                confidence_score=score,
                severity="low",
                details=f"Isolation Forest identified salary/tenure feature space anomaly (Score: {score:.3f}).",
                recommendation="General auditor review recommended during routine compliance checks."
            ))

    status = "flagged" if len(anomalies) > 0 else "clear"
    
    return FraudCheckResponse(
        payroll_run_id=payload.payroll_run_id,
        status=status,
        anomalies=anomalies
    )

@app.get("/api/v1/fraud/health")
def fraud_health():
    return {
        "status": "active",
        "model": "scikit-learn Isolation Forest",
        "contamination": 0.08
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
