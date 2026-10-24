const bcrypt = require('bcryptjs');
const db = require('./database');

function seed() {
  db.initSchema();

  const userCount = db.queryOne('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    console.log('Database already contains data, skipping seed.');
    return;
  }

  console.log('Seeding initial RuralCare healthcare platform data...');

  const passwordHash = bcrypt.hashSync('Password@123', 10);

  db.transaction(() => {
    // 1. Users
    // Patient Ramesh
    db.execute(`
      INSERT INTO users (role, name, email, phone, password_hash, gender, age, abha_id, village, mandal, district, sub_center, emergency_contact)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'patient',
      'Ramesh Kumar',
      'ramesh.kumar@ruralcare.demo',
      '9876543210',
      passwordHash,
      'male',
      42,
      '91-4567-8901-2345',
      'Brahmasamudram',
      'Kalyandurg',
      'Ananthapur',
      'Kalyandurg Sub-Centre II',
      'Lakshmi (Wife) - 9876543211'
    ]);

    // ASHA Health Worker Lakshmi
    db.execute(`
      INSERT INTO users (role, worker_type, name, email, phone, password_hash, gender, age, village, mandal, district, sub_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'health_worker',
      'asha',
      'Lakshmi Devi (ASHA)',
      'asha.lakshmi@ruralcare.gov.in',
      '9876543220',
      passwordHash,
      'female',
      35,
      'Kalyandurg Town',
      'Kalyandurg',
      'Ananthapur',
      'Kalyandurg Sub-Centre II'
    ]);

    // Medical Officer Dr. Venkat Rao
    db.execute(`
      INSERT INTO users (role, worker_type, name, email, phone, password_hash, gender, age, village, mandal, district, sub_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'health_worker',
      'medical_officer',
      'Dr. Venkat Rao, MBBS',
      'dr.venkat@ruralcare.gov.in',
      '9876543230',
      passwordHash,
      'male',
      48,
      'Kalyandurg',
      'Kalyandurg',
      'Ananthapur',
      'Kalyandurg CHC'
    ]);

    // Additional Community Patients
    db.execute(`
      INSERT INTO users (role, name, email, phone, password_hash, gender, age, abha_id, village, mandal, district, sub_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'patient',
      'Sunita Bai',
      'sunita.bai@ruralcare.demo',
      '9876543241',
      passwordHash,
      'female',
      58,
      '91-8891-2234-5512',
      'Gollapalli',
      'Kalyandurg',
      'Ananthapur',
      'Kalyandurg Sub-Centre II'
    ]);

    db.execute(`
      INSERT INTO users (role, name, email, phone, password_hash, gender, age, abha_id, village, mandal, district, sub_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'patient',
      'Anjaneyulu M.',
      'anjaneyulu@ruralcare.demo',
      '9876543242',
      passwordHash,
      'male',
      64,
      '91-7712-4456-9988',
      'Manirevu',
      'Kalyandurg',
      'Ananthapur',
      'Kalyandurg Sub-Centre I'
    ]);

    db.execute(`
      INSERT INTO users (role, name, email, phone, password_hash, gender, age, abha_id, village, mandal, district, sub_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'patient',
      'Padma V.',
      'padma.v@ruralcare.demo',
      '9876543243',
      passwordHash,
      'female',
      24,
      '91-6654-1122-3344',
      'Brahmasamudram',
      'Kalyandurg',
      'Ananthapur',
      'Kalyandurg Sub-Centre II'
    ]);

    // 2. Facilities
    db.execute(`
      INSERT INTO facilities (name, name_te, type, address, village, mandal, district, pincode, phone, emergency_24x7, doctors_count, beds_count, maternity_beds, aarogyasri_covered, distance_km, opd_hours, latitude, longitude)
      VALUES 
      ('Kalyandurg Community Health Centre (CHC)', 'కళ్యాణదుర్గం కమ్యూనిటీ హెల్త్ సెంటర్', 'chc', 'Mandal Main Road, Kalyandurg', 'Kalyandurg', 'Kalyandurg', 'Ananthapur', '515761', '08497-220011', 1, 4, 30, 6, 1, 3.2, '24/7 Emergency & OPD 8:00 AM - 2:00 PM', 14.5516, 77.1068),
      ('Atmakur Primary Healthcare Centre (PHC)', 'ఆత్మకూరు ప్రాథమిక ఆరోగ్య కేంద్రం', 'phc', 'Near Panchayat Office, Atmakur Mandal', 'Atmakur', 'Atmakur', 'Ananthapur', '515751', '08497-220022', 0, 2, 10, 3, 1, 7.8, '8:00 AM - 4:00 PM', 14.6438, 77.3621),
      ('District Civil Hospital - Anantapur', 'జిల్లా సివిల్ ఆసుపత్రి - అనంతపురం', 'district_hospital', 'Government General Hospital Road, Anantapur Town', 'Anantapur', 'Anantapur Urban', 'Ananthapur', '515001', '08554-220033', 1, 24, 350, 45, 1, 18.4, '24/7 Tertiary & Tele-ICU Center', 14.6819, 77.6006),
      ('Beluguppa Maternity & Primary Centre', 'బెలుగుప్ప ప్రసూతి మరియు ప్రాథమిక కేంద్రం', 'maternity', 'Hospital Street, Beluguppa', 'Beluguppa', 'Beluguppa', 'Ananthapur', '515741', '08497-220044', 1, 2, 12, 12, 1, 12.1, '24/7 Labor Room & OPD 9:00 AM - 5:00 PM', 14.7123, 77.1422),
      ('Uravakonda Community Health Centre (CHC)', 'ఉరవకొండ కమ్యూనిటీ హెల్త్ సెంటర్', 'chc', 'Bellary Road, Uravakonda', 'Uravakonda', 'Uravakonda', 'Ananthapur', '515812', '08496-220055', 1, 6, 50, 10, 1, 26.5, '24/7 Trauma Care & Emergency', 14.9452, 77.2641),
      ('Kalyandurg Diagnostic & Ultrasound Lab', 'కళ్యాణదుర్గం రోగనిర్ధారణ & అల్ట్రాసౌండ్ ల్యాబ్', 'lab', 'Opposite Bus Stand, Kalyandurg', 'Kalyandurg', 'Kalyandurg', 'Ananthapur', '515761', '08497-220066', 0, 1, 0, 0, 1, 3.5, '7:30 AM - 6:00 PM (Aarogyasri Empaneled)', 14.5532, 77.1082)
    `);

    // 3. Doctors
    db.execute(`
      INSERT INTO doctors (facility_id, name, qualification, specialty, phone, visiting_days, opd_timing, teleconsult_available)
      VALUES
      (1, 'Dr. Venkat Rao', 'MBBS, MD (General Medicine)', 'General Medicine & Diabetology', '08497-220011', 'Daily (Mon - Sat)', '8:30 AM - 1:30 PM', 1),
      (1, 'Dr. S. Anitha', 'MBBS, MS (OBGYN)', 'Obstetrics & Gynecology', '08497-220012', 'Mon, Wed, Fri', '9:00 AM - 2:00 PM', 1),
      (2, 'Dr. P. Krishna', 'MBBS, DCH', 'Pediatrics & Family Medicine', '08497-220022', 'Mon - Sat', '8:00 AM - 3:00 PM', 0),
      (3, 'Dr. K. Ramesh', 'MS (Orthopedics)', 'Orthopedics & Trauma Surgery', '08554-220033', 'Mon, Tue, Thu, Sat', '9:00 AM - 4:00 PM', 1),
      (3, 'Dr. Madhavi Latha', 'MD, DM (Cardiology)', 'Cardiology & Intensive Care', '08554-220034', 'Daily (Tele-ICU Link)', '10:00 AM - 5:00 PM', 1),
      (4, 'Dr. B. Saraswathi', 'MBBS, DGO', 'Maternal & Neonatal Care', '08497-220044', 'Daily 24/7 On-Call', '9:00 AM - 1:00 PM', 0)
    `);

    // 4. Appointments
    db.execute(`
      INSERT INTO appointments (patient_id, facility_id, doctor_id, appointment_date, time_slot, reason, priority, status, token_number, notes, created_by_user_id)
      VALUES
      (1, 1, 1, '2026-10-25', 'morning', 'Routine blood pressure review & chronic hypertension medication refill', 'routine', 'confirmed', 'OPD-KD-20261025-014', 'Please bring previous prescription book and ration card.', 1),
      (4, 1, 1, '2026-10-26', 'morning', 'Frequent dizziness and borderline fasting blood sugar follow-up', 'urgent', 'pending', 'OPD-KD-20261026-003', 'Door-to-door triage flagged elevated BP.', 2),
      (5, 2, 3, '2026-10-27', 'afternoon', 'Joint pain and general geriatric checkup', 'routine', 'confirmed', 'OPD-AT-20261027-021', 'Aarogyasri token verified.', 2)
    `);

    // 5. Health Records (EHR)
    db.execute(`
      INSERT INTO health_records (patient_id, recorded_by_worker_id, record_date, visit_type, systolic_bp, diastolic_bp, blood_glucose, glucose_type, heart_rate, spo2, temperature_f, weight_kg, triage_status, diagnosis, prescription, allergies, clinical_notes)
      VALUES
      (1, 2, '2026-10-18', 'door_to_door', 132, 84, 118, 'fasting', 74, 98, 98.4, 68.5, 'normal', 'Essential Hypertension (Well Controlled)', 'Tab. Amlodipine 5mg once daily at breakfast', 'No known drug allergies', 'Patient reports compliant medication intake. Recommended low sodium intake in pickles and rasam.'),
      (4, 2, '2026-10-20', 'door_to_door', 158, 96, 178, 'random', 86, 97, 98.6, 62.0, 'urgent', 'Uncontrolled Hypertension, Borderline Hyperglycemia', 'Referred to Kalyandurg CHC for doctor consultation', 'Penicillin allergy', 'Slight dizziness reported in mornings. Triage flagged urgent: referred to Dr. Venkat Rao at CHC.'),
      (5, 2, '2026-10-22', 'door_to_door', 142, 88, 210, 'postprandial', 78, 98, 98.2, 74.0, 'followup', 'Type 2 Diabetes Mellitus, Mild Hypertension', 'Tab. Metformin 500mg BD after food', 'None', 'Advising walking 30 mins daily and scheduled blood sugar monitoring.')
    `);

    // 6. Hospital Referrals
    db.execute(`
      INSERT INTO referrals (referral_code, patient_id, referring_worker_id, from_facility_id, to_facility_id, reason, priority, aarogyasri_case, transport_required, transport_type, status, clinical_summary)
      VALUES
      ('REF-2026-KD-001', 4, 2, 1, 3, 'High cardiovascular risk profile with refractory hypertension requiring specialist cardiology echo and review', 'urgent', 1, 0, 'public_transport', 'accepted', 'Patient exhibits persistently high systolic BP (>155 mmHg) despite initial amlodipine trial. Recommended ECG and 2D Echo at District Hospital.'),
      ('REF-2026-KD-002', 6, 2, 4, 1, 'Second trimester anomaly ultrasound scan and high-risk antenatal screening', 'routine', 1, 0, 'self', 'in_progress', 'Primigravida 22 weeks gestation. Needs routine fetal biometric ultrasound and iron folic acid replenishment.')
    `);

    // 7. Reminders
    db.execute(`
      INSERT INTO reminders (patient_id, created_by_worker_id, reminder_type, title, due_date, status, sms_sent, notes)
      VALUES
      (1, 2, 'bp_check', 'Monthly Blood Pressure Checkup at Sub-Centre', '2026-11-05', 'pending', 1, 'Door-to-door visit or visit sub-centre morning 8am.'),
      (4, 2, 'sugar_check', 'Fasting Blood Sugar Test at Kalyandurg Lab', '2026-10-28', 'pending', 1, 'Arrive fasting before 8:30 AM with Aarogyasri card.'),
      (6, 2, 'maternal_checkup', 'Antenatal Checkup & Tetanus Toxoid 2nd Dose', '2026-11-02', 'pending', 0, 'Sub-Centre maternity camp day.')
    `);

    // 8. Health Resources (Bilingual)
    db.execute(`
      INSERT INTO resources (category, title_en, title_te, summary_en, summary_te, content_en, content_te, icon)
      VALUES
      (
        'chronic',
        'Managing High Blood Pressure in Rural Lifestyles',
        'గ్రామీణ జీవనశైలిలో అధిక రక్తపోటు (బీపీ) నిర్వహణ',
        'Practical dietary, salt reduction, and physical activity guidelines tailored for farming and rural community families.',
        'రైతులు మరియు గ్రామీణ కుటుంబాల కోసం తక్కువ ఉప్పు ఆహారం, వ్యాయామం మరియు రోజువారీ మందుల సలహాలు.',
        'High blood pressure (hypertension) often has no early symptoms but damages the heart, kidneys, and brain if left unmanaged. Essential steps for rural families: 1) Reduce salt intake in pickles, dried fish, and papadums. 2) Never skip prescribed medications even if feeling healthy. 3) Visit the ASHA worker or sub-centre once every month for routine monitoring.',
        'అధిక రక్తపోటుకు ప్రారంభంలో ఎటువంటి లక్షణాలు కనిపించకపోవచ్చు, కానీ దీనిని నియంత్రించకపోతే గుండె, మూత్రపిండాలు దెబ్బతింటాయి. 1) ఊరగాయలు, ఎండుచేపలు మరియు అప్పడాలలో ఉప్పు వాడకం తగ్గించండి. 2) ఆరోగ్యం బాగున్నట్లు అనిపించినప్పటికీ వైద్యులు సూచించిన మందులను మానకండి. 3) ప్రతినెలా ఆశా కార్యకర్త లేదా సబ్ సెంటర్ వద్ద ఉచితంగా బీపీ పరీక్ష చేయించుకోండి.',
        'monitor_heart'
      ),
      (
        'maternal',
        'Antenatal Care & Free Nutrition Under NHM',
        'గర్భిణీ స్త్రీల ఆరోగ్యం & ఉచిత పౌష్టికాహార మార్గదర్శిని',
        'Step-by-step guidance on Janani Suraksha Yojana, iron folic acid tablets, and safe institutional delivery.',
        'జనని సురక్ష యోజన, ఐరన్ మాత్రలు, మరియు సురక్షిత ప్రసవం కోసం ప్రభుత్వ ప్రోత్సాహకాలు మరియు ఉచిత సేవలు.',
        'Every pregnant woman is entitled to free antenatal care, tetanus toxoid immunizations, iron and calcium tablets, and monetary assistance for hospital delivery under the National Health Mission and Janani Suraksha Yojana. Ensure at least four ANC visits: 1) Within 12 weeks, 2) 14-26 weeks, 3) 28-34 weeks, 4) 36 weeks to delivery.',
        'ప్రతి గర్భిణీ స్త్రీకి జాతీయ ఆరోగ్య మిషన్ కింద ఉచిత వైద్య పరీక్షలు, ఐరన్ మరియు ఫోలిక్ యాసిడ్ మాత్రలు, టీటీ ఇంజెక్షన్లు మరియు ఆర్థిక సహాయం అందుతాయి. గర్భం దాల్చిన మొదటి 3 నెలల్లో పేరు నమోదు చేసుకోవడం అత్యంత ముఖ్యం. సురక్షిత ప్రసవం కోసం ప్రభుత్వ ఆసుపత్రికి వెళ్ళండి.',
        'pregnant_woman'
      ),
      (
        'schemes',
        'Dr. YSR Aarogyasri & Ayushman Bharat Healthcare Benefits',
        'డా. వైఎస్సార్ ఆరోగ్యశ్రీ & ఆయుష్మాన్ భారత్ పథకాల సమాచారం',
        'Complete guide on accessing cashless hospital treatment up to 5 lakh rupees for rural families.',
        'గ్రామీణ కుటుంబాలకు 5 లక్షల వరకు ఉచిత చికిత్స పొందే విధానం, అర్హతలు మరియు అవసరమైన పత్రాల వివరాలు.',
        'Aarogyasri provides 100% cashless treatment for eligible families across recognized government and empaneled private hospitals. Documents required: 1) White Ration Card / Aarogyasri Card, 2) Aadhaar Card. No out-of-pocket charges are allowed for surgery, hospital bed, medicines, or post-discharge food allowance.',
        'ఆరోగ్యశ్రీ పథకం ద్వారా అర్హులైన పేద కుటుంబాలకు నెట్‌వర్క్ ఆసుపత్రులలో ఉచిత నగదు రహిత శస్త్రచికిత్సలు మరియు వైద్యం అందుతాయి. అవసరమైన పత్రాలు: తెల్ల రేషన్ కార్డు మరియు ఆధార్ కార్డు. ఎటువంటి రుసుము చెల్లించాల్సిన అవసరం లేదు; మందులు మరియు ఆహార భత్యం కూడా ఉచితం.',
        'verified_user'
      ),
      (
        'seasonal',
        'Seasonal Monsoon Fevers, Dengue & Clean Water Safety',
        'కాలానుగుణ జ్వరాలు, డెంగ్యూ & స్వచ్ఛమైన తాగునీటి జాగ్రత్తలు',
        'Identification of warning signs of dengue, malaria prevention, and oral rehydration therapy for children.',
        'వర్షాకాలంలో వచ్చే డెంగ్యూ, మలేరియా లక్షణాలు మరియు ORS ద్రావణం వాడకంపై అవగాహన.',
        'Prevent mosquito breeding by regularly clearing stagnant water around overhead tanks, coolers, and discarded containers. Warning signs requiring immediate hospital attention: continuous high fever for >3 days, severe abdominal pain, persistent vomiting, or extreme weakness. Drink only boiled or chlorinated water.',
        'ఇంటి చుట్టుపక్కల నీరు నిల్వ ఉండకుండా చూసుకోండి. డెంగ్యూ దోమలు పగటిపూట కుడతాయి. 3 రోజులకు మించి తీవ్రమైన జ్వరం, కడుపునొప్పి, లేదా నీరసం ఉంటే వెంటనే 108 కు కాల్ చేయండి లేదా సమీప పీహెచ్‌సీకి వెళ్లండి.',
        'water_drop'
      )
    `);

    // 9. Notifications
    db.execute(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES
      (1, 'Appointment Confirmed', 'Your appointment with Dr. Venkat Rao on 2026-10-25 (Morning) is confirmed. Token: OPD-KD-20261025-014.', 'appointment', '#appointments'),
      (1, 'Upcoming BP Checkup Due', 'ASHA Worker Lakshmi has scheduled your routine Blood Pressure check on 2026-11-05.', 'reminder', '#records'),
      (2, 'Urgent Triage Case Flagged', 'Patient Sunita Bai has recorded elevated blood pressure (158/96). Referral slip REF-2026-KD-001 issued.', 'referral', '#worker-queue')
    `);
  });

  console.log('Database seeded successfully with authentic rural healthcare records!');
}

if (require.main === module) {
  seed();
}

module.exports = seed;

