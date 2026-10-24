# RuralCare Action | Healthcare for Everyone, Care Within Reach
> A secure, responsive, accessible, National Health Mission (NHM)-compliant primary healthcare coordination platform engineered for rural patient empowerment, elder digital inclusion, and ASHA/ANM field worker agility.

---

## 1. Architectural Overview

RuralCare Action transforms a static Stitch prototype into a complete, full-stack, production-ready healthcare management system. It bridges clinical authority with community-first accessibility across desktop, tablet, and low-connectivity mobile devices.

```
                          ┌────────────────────────────────────────────────────────┐
                          │               CLIENT LAYER (WCAG 2.2 AAA)              │
                          │   Bilingual UI (Telugu & English) • Audio Guides       │
                          │   Patient Portal • ASHA Workspace • AI Health Nav      │
                          └───────────────────────────┬────────────────────────────┘
                                                      │ REST JSON / Bearer JWT
                                                      ▼
                          ┌────────────────────────────────────────────────────────┐
                          │                SECURE EXPRESS.JS BACKEND               │
                          │   Helmet CSP • CORS • Sliding Window Rate Limiter      │
                          │   Least-Privilege RBAC • Ownership Verification        │
                          │   Centralized Sanitized Error Logging • Zod Validator  │
                          └───────────────────────────┬────────────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
         ┌───────────────────────────┐                                 ┌───────────────────────────┐
         │  CLINICAL TRIAGE ENGINE   │                                 │   SQLITE RELATIONAL CORE  │
         │  WHO/NHM Primary Triage   │                                 │   Native node:sqlite WAL  │
         │  BP, Sugar, SpO2, Pulse   │                                 │   Prepared Statements     │
         │  Risk: Normal/Follow/Urgent│                                │   Foreign Key Constraints │
         └───────────────────────────┘                                 └───────────────────────────┘
```

---

## 2. Core Capabilities & Workflows

### A. Patient & Citizen Portal
- **Dual-Role Authentication:** Dedicated login and registration with validation, password hashing via bcrypt, and instant 1-click evaluation demo access.
- **OPD Token Booking:** Instant digital appointment booking with auto-generated OPD Token (e.g. `OPD-KD-20261025-014`), SMS simulation, doctor selection, and self-cancellation.
- **Electronic Health Records (EHR):** Full patient medical history, vitals tracking (Blood Pressure, Blood Glucose, SpO2, Pulse, Temperature, Weight), clinical notes, and prescription history with **strict ownership isolation** (patients can never view another patient's records).
- **Hospital Referrals Tracker:** View inter-facility transfer slips issued to Community Health Centres (CHCs) or District Civil Hospitals under the **Dr. YSR Aarogyasri** cashless scheme.
- **Preventive Follow-up Reminders:** Notifications for chronic disease checkups (hypertension, diabetes), antenatal care, and child vaccination due dates.

### B. Health Worker (ASHA / ANM / Medical Officer) Workspace
- **Operational Metrics Dashboard:** Real-time visibility into pending appointment requests, registered village patients, high-risk triage alerts, and active transfer slips.
- **Appointment Queue & Triage:** Review, approve, assign doctors, and update token statuses for patients across the worker's jurisdiction.
- **Door-to-Door Patient Registry:** Search patients by name, phone, village, or ABHA ID.
- **Biometric Vitals Recording & Automatic Triage:** Field logging of vitals that automatically evaluates risk levels (**Normal**, **Follow-up**, or **Urgent Attention**) using National Health Mission clinical thresholds.
- **Referral Slips Generator:** Create official inter-facility transfer slips with transport dispatch (including 108 Ambulance coordination).
- **Preventive Reminders Dispatcher:** Schedule and send reminders to chronic patients.

### C. Bilingual AI Health Navigation Assistant
- **Symptom & Triage Guidance:** Contextual administrative triage answering queries in English and Telugu.
- **Emergency Detection:** Instant detection of critical keywords (chest pain, acute breathlessness, snake bites) with immediate routing to dial **108 Emergency Ambulance** or visit 24/7 casualty.
- **Web Speech API Integration:** Speech-to-text microphone input and text-to-speech audio narration for village elders and low-literacy users.

### D. Accessible Healthcare Facility Finder
- **Zero-GPS Required:** Search facilities by Village name, Mandal, Town, District, or PIN code.
- **Filter Chips:** Instant filtering across Primary Health Centres (PHC), Community Hospitals (CHC), Diagnostic & Ultrasound Labs, and Maternity Centres.
- **Facility Cards:** Real distance, 24/7 emergency availability, bed capacity, doctors on duty, Aarogyasri coverage badge, direct call link, and 1-click booking pre-fill.

---

## 3. Technology Stack

- **Runtime:** Node.js (v22.5+ or v24+)
- **Database:** Native `node:sqlite` (`DatabaseSync`) with WAL mode, parameterized prepared statements, and synchronous integrity. Zero external native compilation required.
- **Backend Framework:** Express.js 5, Helmet, CORS, Zod validation, bcryptjs, jsonwebtoken, sliding-window rate limiting.
- **Frontend:** Semantic HTML5, Tailwind CSS with container queries, Google Fonts (Plus Jakarta Sans, Inter), Material Symbols Outlined, Web Speech API.
- **Testing:** Native Node.js test runner (`node:test`) + `supertest` for comprehensive end-to-end API, RBAC, and ownership tests.

---

## 4. Quick Start & Local Setup

### Prerequisites
- Node.js version 22.5.0 or higher (Current environment: Node v24.22.1)
- npm version 10+ (Current environment: npm 11.19.1)

### Installation
```bash
# Clone the repository and navigate to the project directory
git clone <repo-url>
cd stitch_ruralcare_action_healthcare_platform

# Install dependencies
npm install
```

### Environment Configuration
Copy the example environment configuration:
```bash
cp .env.example .env
```
Default `.env` settings:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=ruralcare_super_secret_jwt_key_2026_production_change_in_real_env
JWT_EXPIRES_IN=7d
DB_PATH=./data/ruralcare.db
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=15
```

### Database Seeding
Pre-populate the database with authentic rural healthcare centres (Kalyandurg CHC, Atmakur PHC, District Civil Hospital Anantapur), doctors, health records, referrals, and resources:
```bash
npm run seed
```

### Starting the Platform
```bash
# Production start
npm start

# Or development mode
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 5. Demo Accounts for Instant Evaluation

| Role | Name | Phone / Login | Password | Designation / Jurisdiction |
| :--- | :--- | :--- | :--- | :--- |
| **Patient / Citizen** | Ramesh Kumar | `9876543210` | `Password@123` | Brahmasamudram, Kalyandurg (ABHA: `91-4567-8901-2345`) |
| **ASHA Health Worker** | Lakshmi Devi (ASHA) | `9876543220` | `Password@123` | Kalyandurg Sub-Centre II, Ananthapur |
| **Medical Officer** | Dr. Venkat Rao, MBBS | `9876543230` | `Password@123` | Kalyandurg Community Health Centre |

> **Note:** The UI also features **1-Click Demo Sign In** buttons on the Login modal and header dropdown, allowing instant role switching without manual typing.

---

## 6. Database Schema & Data Models

| Table | Purpose & Key Columns |
| :--- | :--- |
| `users` | Role (`patient`, `health_worker`, `admin`), `worker_type` (`asha`, `anm`, `medical_officer`), `phone`, `password_hash`, `abha_id`, `village`, `mandal`. |
| `facilities` | Rural health centres: `type` (`phc`, `chc`, `district_hospital`, `lab`, `maternity`), `emergency_24x7`, `beds_count`, `doctors_count`, `aarogyasri_covered`. |
| `doctors` | Associated with facility: `specialty`, `qualification`, `visiting_days`, `opd_timing`, `teleconsult_available`. |
| `appointments` | Booking requests: `patient_id`, `facility_id`, `doctor_id`, `appointment_date`, `time_slot`, `token_number`, `status` (`pending`, `confirmed`, `completed`, `cancelled`). |
| `health_records` | Patient EHR: `systolic_bp`, `diastolic_bp`, `blood_glucose`, `heart_rate`, `spo2`, `temperature_f`, `triage_status` (`normal`, `followup`, `urgent`), `prescription`, `diagnosis`. |
| `referrals` | Transfer slips: `referral_code`, `from_facility_id`, `to_facility_id`, `priority`, `aarogyasri_case`, `transport_required`, `status`. |
| `reminders` | Preventive care alerts: `reminder_type`, `due_date`, `status` (`pending`, `completed`, `missed`), `sms_sent`. |
| `resources` | Educational health guides in English & Telugu (`category`, `title_en`, `title_te`, `content_en`, `content_te`). |
| `notifications`| In-app alerts: `user_id`, `title`, `message`, `type`, `is_read`, `link`. |
| `audit_logs` | Security trail: `user_id`, `action`, `resource_type`, `resource_id`, `ip_address`, `timestamp`. |

---

## 7. API Reference

### Authentication
- `POST /api/auth/register` - Create patient or health worker account
- `POST /api/auth/login` - Authenticate with phone/email and password
- `GET /api/auth/me` - Get authenticated profile
- `POST /api/auth/demo-login` - Instant 1-click evaluation login
- `POST /api/auth/forgot-password` - Request SMS verification OTP
- `POST /api/auth/reset-password` - Reset password with verified OTP

### Healthcare Facilities & Doctors
- `GET /api/facilities` - Search & filter facilities (query params: `type`, `search`, `emergency`, `mandal`)
- `GET /api/facilities/:id` - Facility details with doctors on duty
- `GET /api/doctors` - Directory of specialists and medical officers

### Appointments
- `POST /api/appointments` - Book appointment & generate OPD token
- `GET /api/appointments` - List appointments (filtered by patient or worker queue)
- `GET /api/appointments/:id` - Appointment details
- `PATCH /api/appointments/:id/status` - Update status (Health worker / admin)
- `POST /api/appointments/:id/cancel` - Cancel appointment (Patient)

### Electronic Health Records & Triage
- `POST /api/health-records` - Record vitals & door-to-door visit notes (Auto-calculates triage)
- `GET /api/health-records` - List patient health records (Enforces ownership isolation)
- `GET /api/health-records/patients` - List registered village patients (Health workers only)

### Referrals & Reminders
- `POST /api/referrals` - Issue hospital transfer slip under Aarogyasri
- `GET /api/referrals` - List referrals
- `POST /api/reminders` - Schedule preventive health reminder
- `GET /api/reminders` - List reminders

### AI Health Navigation & Resources
- `POST /api/ai/navigate` - Bilingual triage navigation, 108 emergency routing, and token guide
- `GET /api/resources` - Categorized health education guides

---

## 8. Automated Test Suite & Verification

The platform includes 24 automated unit, integration, and security tests covering:
- Authentication & bcrypt validation
- Least-privilege Role-Based Access Control (RBAC)
- Record ownership enforcement (patients cannot access other patients' records)
- Clinical triage algorithm (normal vs followup vs urgent)
- Appointment token generation and cancellation
- Hospital referrals and preventive reminders
- AI Assistant emergency 108 detection and bilingual responses

Run tests locally:
```bash
npm test
```

Expected output:
```
✔ POST /api/ai/navigate - should identify emergency symptoms and route to 108
✔ POST /api/ai/navigate - should respond in Telugu when requested
✔ POST /api/ai/navigate - should provide Aarogyasri cashless details
✔ POST /api/appointments - patient can book an appointment
✔ GET /api/appointments - patient can only list their own appointments
✔ PATCH /api/appointments/:id/status - health worker can confirm appointment
✔ POST /api/appointments/:id/cancel - patient can cancel appointment
✔ POST /api/auth/login - should authenticate valid patient user
✔ POST /api/auth/login - should reject invalid password
✔ POST /api/auth/demo-login - should log in as demo health worker
✔ POST /api/auth/register - should create new patient and return token
✔ POST /api/auth/register - should reject duplicate phone number
✔ POST /api/health-records - health worker records vitals with automated triage calculation
✔ GET /api/health-records - patient can only view their own health records
✔ GET /api/health-records/:id - patient cannot view other patient record (RBAC + Ownership)
✔ GET /api/health - system health check
✔ GET /api/facilities - filter facilities by type and search
✔ GET /api/facilities/:id - facility details with doctors
✔ GET /api/doctors - list and filter doctors
✔ POST /api/referrals - health worker creates hospital referral slip
✔ GET /api/referrals - patient views their own referrals
✔ POST /api/reminders - health worker creates preventive reminder
✔ GET /api/resources - fetch health guides and filter by category
✔ GET /api/notifications - user notifications and read status

ℹ tests 24
ℹ pass 24
ℹ fail 0
```

---

## 9. Deployment Guidelines

### Production with PM2
```bash
npm install -g pm2
NODE_ENV=production pm2 start src/server.js --name "ruralcare-platform"
```

### Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run seed
EXPOSE 3000
CMD ["node", "src/server.js"]
```
Build and run:
```bash
docker build -t ruralcare-action .
docker run -p 3000:3000 --env-file .env ruralcare-action
```

---

## 10. License & Compliance
This software is built in compliance with the **National Health Mission (NHM)** guidelines, supporting **Ayushman Bharat Digital Mission (ABDM)** standards and **Dr. YSR Aarogyasri Healthcare Trust** public service protocols.

