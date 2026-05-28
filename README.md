# PayrollOS — Intelligent Enterprise Payroll Monorepo

PayrollOS is a modern, SOC2-compliant, intelligent global payroll platform designed for future-proof organizations. The system automates localized tax computations, manages multi-currency wallets, verifies staff identity documentation, and utilizes machine learning anomaly detection to protect company treasuries.

---

## 🛠 Core Capabilities

- **Automated Tax Engine**: Instant calculation of basic pay, HRA, allowance, bonus, overtime (1.5x), and statutory deductions (TDS Tax at 10%, PF, ESI).
- **KYC Onboarding Gateway**: Photo document verification checks for passports, national IDs, and licenses before employees are eligible for payroll.
- **AI Fraud Sentinel**: Live Python FastAPI Isolation Forest outlier algorithm to audit processed payroll runs, flagging ghost employees, duplicate routing IBANs, and salary spikes.
- **Biometric GPS Timecards**: Mobile geofenced GPS clock-ins and dynamic QR scans syncing direct attendance records to calculation sheets.
- **Multi-Currency Wallets**: Multi-currency ledger balances ($ USD, ₹ INR, € EUR, د.إ AED) with hourly cached Open Exchange rates and Socket.io disbursement rails.
- **AI Chatbot Assistant**: 24/7 conversational payroll specialist explaining payslips, leave balances, and tax brackets in English, Hindi, and Arabic.

---

## 🏗 Monorepo Architecture

This project is organized as a modular monorepo:

```
├── api/                   # Root-level Vercel serverless API entrypoint
├── payrollos/
│   ├── backend/           # Node.js Express & Sequelize API Gateway
│   ├── frontend/          # React.js & Vite Client Web Application
│   └── fraud-service/     # Python FastAPI Machine Learning Microservice
├── vercel.json            # Unified single-project deployment configurations
└── package.json           # Monorepo build orchestrator
```

---

## 🚀 One-Click Vercel Deployment

Both the React frontend and Node.js Express backend are configured to deploy together under a **single Vercel Project** on one domain.

### Step-by-Step Deployment:
1. **Push the repository** to GitHub, GitLab, or Bitbucket.
2. In the **Vercel Dashboard**, click **Add New** > **Project** and select your repository.
3. Keep the **Root Directory** at the repository root (`./` - do not select a subfolder).
4. Expand the **Environment Variables** section and configure your database parameters:
   - `DB_DIALECT` = `mysql` (Recommended for production persistence)
   - `DB_HOST` = `<your-hosted-database-host>`
   - `DB_PORT` = `3306`
   - `DB_NAME` = `<your-database-name>`
   - `DB_USER` = `<your-database-user>`
   - `DB_PASS` = `<your-database-password>`
   - `JWT_SECRET` = `<your-secure-signature-key>`
5. Click **Deploy**. Vercel will compile the Vite assets and host the Express routes as stateless serverless functions!

> [!WARNING]
> **Database Persistence in Serverless Environments**
> Vercel's runtime filesystem is read-only.
> - **SQLite Fallback**: If `DB_DIALECT` is set to `sqlite`, PayrollOS automatically routes database files to `/tmp/payrollos.sqlite` to prevent filesystem write crashes. However, `/tmp` is ephemeral and gets wiped frequently.
> - **Production Recommendation**: Provide environment variables pointing to a hosted, persistent database (like MySQL or PostgreSQL) to keep your payroll records permanently intact.

---

## 💻 Local Development Setup

To run the services concurrently on your local machine without Docker:

### 1. Pre-requisites
Make sure you have **Node.js** (v18+) and **Python** (v3.9+) installed.

### 2. Run the Backend Gateway
1. Navigate to the backend directory:
   ```bash
   cd payrollos/backend
   ```
2. Configure `.env` file (if custom options are needed). By default, it connects to SQLite:
   ```env
   PORT=5000
   DB_DIALECT=sqlite
   JWT_SECRET=payrollos_super_jwt_secret_key_rs255_here
   ```
3. Start the Express gateway:
   ```bash
   npm start
   ```
   *The backend will boot up, auto-sync database tables, and run on [http://localhost:5000](http://localhost:5000).*

### 3. Run the Frontend App
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Launch Vite dev server:
   ```bash
   npm run dev
   ```
   *The client app will boot on [http://localhost:5173](http://localhost:5173).*

### 4. Run the AI Fraud Microservice
1. Navigate to the fraud service directory:
   ```bash
   cd ../fraud-service
   ```
2. Activate virtual environment:
   - **Windows**: `.venv\Scripts\activate`
   - **macOS/Linux**: `source .venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start FastAPI service:
   ```bash
   python main.py
   ```
   *The ML service will listen on [http://127.0.0.1:8000](http://127.0.0.1:8000).*

---

## 🐳 Docker Deployment

If you have Docker and Docker Compose installed, run the entire ecosystem (MySQL, Redis, Backend, Frontend, and Fraud-service) with a single command:

```bash
docker compose up --build -d
```
- **Web App URL**: [http://localhost](http://localhost) (Nginx reverse-proxy on Port 80)
- **API Gateway**: [http://localhost:5000](http://localhost:5000)
- **FastAPI ML Service**: [http://localhost:8000](http://localhost:8000)
