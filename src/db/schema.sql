-- RuralCare Action Database Schema
-- Native SQLite schema with foreign key constraints, check constraints, and performance indexes

PRAGMA foreign_keys = ON;

-- Users table (Patients, Health Workers: ASHA/ANM/Doctor, Admin)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'health_worker', 'admin')),
  worker_type TEXT CHECK (worker_type IN ('asha', 'anm', 'medical_officer', NULL)),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age >= 0 AND age <= 130),
  abha_id TEXT UNIQUE, -- Ayushman Bharat Health Account ID
  village TEXT,
  mandal TEXT,
  district TEXT DEFAULT 'Ananthapur',
  sub_center TEXT,
  emergency_contact TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_mandal ON users(mandal);

-- Healthcare Facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL, -- Telugu name
  type TEXT NOT NULL CHECK (type IN ('phc', 'chc', 'district_hospital', 'lab', 'maternity')),
  address TEXT NOT NULL,
  village TEXT,
  mandal TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Ananthapur',
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  emergency_24x7 INTEGER NOT NULL DEFAULT 0, -- 1 for true, 0 for false
  doctors_count INTEGER NOT NULL DEFAULT 1,
  beds_count INTEGER NOT NULL DEFAULT 0,
  maternity_beds INTEGER NOT NULL DEFAULT 0,
  aarogyasri_covered INTEGER NOT NULL DEFAULT 1,
  distance_km REAL DEFAULT 0.0,
  opd_hours TEXT NOT NULL DEFAULT '8:00 AM - 4:00 PM',
  latitude REAL,
  longitude REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_facilities_mandal ON facilities(mandal);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facility_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialty TEXT NOT NULL,
  phone TEXT,
  visiting_days TEXT NOT NULL, -- e.g. "Mon, Wed, Fri" or "Daily"
  opd_timing TEXT NOT NULL, -- e.g. "9:00 AM - 1:00 PM"
  teleconsult_available INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_doctors_facility ON doctors(facility_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  facility_id INTEGER NOT NULL,
  doctor_id INTEGER,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'followup')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  token_number TEXT UNIQUE,
  notes TEXT,
  created_by_user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_facility ON appointments(facility_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Health Records (EHR / Vitals / Door-to-Door Assessments)
CREATE TABLE IF NOT EXISTS health_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  recorded_by_worker_id INTEGER,
  record_date DATE NOT NULL,
  visit_type TEXT NOT NULL DEFAULT 'door_to_door' CHECK (visit_type IN ('door_to_door', 'opd', 'teleconsult')),
  systolic_bp INTEGER, -- mmHg
  diastolic_bp INTEGER, -- mmHg
  blood_glucose REAL, -- mg/dL
  glucose_type TEXT CHECK (glucose_type IN ('fasting', 'random', 'postprandial', NULL)),
  heart_rate INTEGER, -- bpm
  spo2 INTEGER, -- percentage
  temperature_f REAL, -- Fahrenheit
  weight_kg REAL,
  triage_status TEXT NOT NULL DEFAULT 'normal' CHECK (triage_status IN ('normal', 'followup', 'urgent')),
  diagnosis TEXT,
  prescription TEXT,
  allergies TEXT,
  clinical_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by_worker_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_health_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(record_date);
CREATE INDEX IF NOT EXISTS idx_health_records_triage ON health_records(triage_status);

-- Hospital Referrals table (Sub-Centre to CHC / District Hospital)
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referral_code TEXT NOT NULL UNIQUE,
  patient_id INTEGER NOT NULL,
  referring_worker_id INTEGER NOT NULL,
  from_facility_id INTEGER NOT NULL,
  to_facility_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'emergency')),
  aarogyasri_case INTEGER NOT NULL DEFAULT 1,
  transport_required INTEGER NOT NULL DEFAULT 0,
  transport_type TEXT CHECK (transport_type IN ('ambulance_108', 'public_transport', 'self', NULL)),
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'accepted', 'in_progress', 'completed', 'rejected')),
  clinical_summary TEXT,
  action_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referring_worker_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (from_facility_id) REFERENCES facilities(id) ON DELETE RESTRICT,
  FOREIGN KEY (to_facility_id) REFERENCES facilities(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_referrals_patient ON referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- Reminders & Preventive Follow-ups
CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  created_by_worker_id INTEGER,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('bp_check', 'sugar_check', 'immunization', 'maternal_checkup', 'medication_refill')),
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'missed')),
  sms_sent INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_worker_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_reminders_patient ON reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);

-- Educational Health Resources
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK (category IN ('maternal', 'chronic', 'seasonal', 'schemes')),
  title_en TEXT NOT NULL,
  title_te TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_te TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_te TEXT NOT NULL,
  icon TEXT DEFAULT 'health_and_safety',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

-- In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('appointment', 'record', 'referral', 'reminder', 'system')),
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- Audit Logs (Privacy & Security Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

