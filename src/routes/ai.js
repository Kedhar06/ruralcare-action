const express = require('express');
const { z } = require('zod');
const db = require('../db/database');
const { validate } = require('../middleware/validate');

const router = express.Router();

const navigateSchema = z.object({
  query: z.string().min(1, 'Please enter a question or query').max(500),
  lang: z.enum(['en', 'te']).default('en'),
});

// Knowledge base and triage pattern matching
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'unconscious', 'fainting', 'severe bleeding',
  'breathless', 'cannot breathe', 'difficulty breathing', 'snake bite', 'poison',
  'stroke', 'paralysis', 'convulsion', 'seizure', 'severe burn', 'head injury',
  // Telugu keywords
  'గుండె నొప్పి', 'శ్వాస', 'రక్తస్రావం', 'పాము కాటు', 'విషం', 'మూర్ఛ', 'పక్షవాతం'
];

router.post('/navigate', validate({ body: navigateSchema }), (req, res) => {
  const { query, lang } = req.body;
  const q = query.toLowerCase();

  // 1. Emergency Detection
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => q.includes(kw.toLowerCase()));
  if (isEmergency) {
    const responseEn = 'CRITICAL EMERGENCY DETECTED: If you or someone nearby is experiencing acute severe symptoms (such as chest pain, extreme breathlessness, severe bleeding, or unconsciousness), do NOT wait for an OPD appointment. Please immediately dial 108 for emergency ambulance dispatch or visit the nearest 24/7 Casualty at Kalyandurg CHC (08497-220011) or District Civil Hospital Anantapur.';
    const responseTe = 'అత్యవసర హెచ్చరిక: మీకు లేదా మీ సమీపంలోని వారికి గుండె నొప్పి, తీవ్రమైన శ్వాస సమస్య, తీవ్ర రక్తస్రావం లేదా స్పృహ కోల్పోవడం వంటి అత్యవసర లక్షణాలు ఉంటే, దయచేసి వెంటనే 108 కు ఉచితంగా కాల్ చేసి అంబులెన్స్ సేవలను పొందండి. లేదా వెంటనే కళ్యాణదుర్గం CHC (08497-220011) లేదా అనంతపురం జిల్లా ఆసుపత్రిలోని 24/7 ఎమర్జెన్సీ వార్డుకు వెళ్లండి.';

    return res.json({
      success: true,
      isEmergency: true,
      text: lang === 'te' ? responseTe : responseEn,
      actions: [
        { label: lang === 'te' ? '108 కు కాల్ చేయండి' : 'Call 108 Emergency', url: 'tel:108', primary: true, icon: 'emergency' },
        { label: lang === 'te' ? '104 సలహా పొందండి' : 'Call 104 Medical Advice', url: 'tel:104', icon: 'call' },
        { label: lang === 'te' ? 'సమీప ఆసుపత్రులు' : 'View Emergency Facilities', url: '#find-healthcare', icon: 'local_hospital' },
      ],
      disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
    });
  }

  // 2. Token / Appointment Booking
  if (q.includes('token') || q.includes('appointment') || q.includes('book') || q.includes('opd') || q.includes('టోకెన్') || q.includes('అపాయింట్‌మెంట్') || q.includes('బుక్')) {
    const responseEn = 'To book an OPD appointment token for tomorrow morning: 1) Click the "Book an Appointment" button on the portal. 2) Choose your preferred facility (e.g., Kalyandurg CHC or Atmakur PHC). 3) Select the department (General Medicine, OBGYN, Pediatrics) and preferred time slot (Morning 8am-12pm). 4) You will instantly receive an SMS with your digital token number (e.g., OPD-KD-20261025-014). Please carry your ration card and Aadhaar when visiting.';
    const responseTe = 'రేపటి ఉదయానికి ఓపీడీ టోకెన్ బుక్ చేసుకునే విధానం: 1) పోర్టల్‌లో "Book an Appointment" పై నొక్కండి. 2) మీకు సమీపంలోని ప్రాథమిక ఆరోగ్య కేంద్రాన్ని (కళ్యాణదుర్గం CHC లేదా ఆత్మకూరు PHC) ఎంచుకోండి. 3) విభాగాన్ని (జనరల్ మెడిసిన్, ప్రసూతి, పిల్లల వైద్యం) మరియు ఉదయం సమయాన్ని ఎంచుకోండి. 4) వెంటనే మీ మొబైల్‌కు టోకెన్ నంబర్ SMS వస్తుంది. ఆసుపత్రికి వెళ్లేటప్పుడు మీ తెల్ల రేషన్ కార్డు, ఆధార్ కార్డు తీసుకెళ్లండి.';

    return res.json({
      success: true,
      isEmergency: false,
      text: lang === 'te' ? responseTe : responseEn,
      actions: [
        { label: lang === 'te' ? 'అపాయింట్‌మెంట్ బుక్ చేయండి' : 'Book Appointment Now', url: '#book-appointment', primary: true, icon: 'calendar_month' },
        { label: lang === 'te' ? 'నా టోకెన్లు చూడండి' : 'View My Tokens', url: '#appointments', icon: 'confirmation_number' },
      ],
      disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
    });
  }

  // 3. Aarogyasri & Ayushman Bharat Scheme
  if (q.includes('aarogyasri') || q.includes('ayushman') || q.includes('scheme') || q.includes('free treatment') || q.includes('ఆరోగ్యశ్రీ') || q.includes('పథకం') || q.includes('ఉచిత చికిత్స')) {
    const responseEn = 'Under Dr. YSR Aarogyasri and Ayushman Bharat, eligible rural families with a White Ration Card or Aarogyasri Card receive 100% cashless treatment up to 5 lakh rupees. Covered facilities in your area include Kalyandurg CHC and District Civil Hospital Anantapur. Carry: 1) Aarogyasri/White Ration Card, 2) Aadhaar Card, 3) Patient previous prescriptions. No fees are charged for bed, surgery, medicines, or pre-op tests.';
    const responseTe = 'డా. వైఎస్సార్ ఆరోగ్యశ్రీ మరియు ఆయుష్మాన్ భారత్ పథకం ద్వారా తెల్ల రేషన్ కార్డు కలిగిన కుటుంబాలకు రూ. 5 లక్షల వరకు పూర్తి ఉచిత, నగదు రహిత చికిత్స అందుతుంది. మన ప్రాంతంలో కళ్యాణదుర్గం CHC మరియు అనంతపురం జిల్లా ఆసుపత్రిలో ఈ సేవలు అందుబాటులో ఉన్నాయి. అవసరమైన పత్రాలు: తెల్ల రేషన్ కార్డు మరియు ఆధార్ కార్డు. మందులు, శస్త్రచికిత్స, బెడ్ ఛార్జీలు అన్నీ ఉచితం.';

    return res.json({
      success: true,
      isEmergency: false,
      text: lang === 'te' ? responseTe : responseEn,
      actions: [
        { label: lang === 'te' ? 'పథకం వివరాలు చదవండి' : 'Read Scheme Guide', url: '#resources', primary: true, icon: 'verified_user' },
        { label: lang === 'te' ? 'నెట్‌వర్క్ ఆసుపత్రులు' : 'Find Empaneled Hospitals', url: '#find-healthcare', icon: 'domain' },
      ],
      disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
    });
  }

  // 4. Ultrasound / Diagnostics
  if (q.includes('ultrasound') || q.includes('scan') || q.includes('x-ray') || q.includes('lab') || q.includes('blood test') || q.includes('అల్ట్రాసౌండ్') || q.includes('స్కాన్') || q.includes('ల్యాబ్')) {
    const responseEn = 'For diagnostic and ultrasound services: Kalyandurg Diagnostic & Ultrasound Lab (3.5 km away) provides Aarogyasri-empaneled ultrasound and digital pathology. For maternal anomaly scans, Beluguppa Maternity Centre and Kalyandurg CHC have certified Sonologists visiting on Tuesdays and Fridays.';
    const responseTe = 'రోగనిర్ధారణ మరియు అల్ట్రాసౌండ్ సేవల కోసం: కళ్యాణదుర్గం డయాగ్నస్టిక్ & అల్ట్రాసౌండ్ ల్యాబ్ (3.5 కి.మీ) ఆరోగ్యశ్రీ కింద ఉచిత సేవలను అందిస్తుంది. గర్భిణీ స్త్రీల స్కాన్ల కోసం కళ్యాణదుర్గం CHC మరియు బెలుగుప్ప కేంద్రంలో ప్రతి మంగళవారం, శుక్రవారం ప్రత్యేక క్యాంపులు నిర్వహిస్తారు.';

    return res.json({
      success: true,
      isEmergency: false,
      text: lang === 'te' ? responseTe : responseEn,
      actions: [
        { label: lang === 'te' ? 'ల్యాబ్ వివరాలు చూడండి' : 'View Lab Details', url: '#find-healthcare', primary: true, icon: 'biotech' },
        { label: lang === 'te' ? 'ల్యాబ్‌కు కాల్ చేయండి' : 'Call Diagnostic Center', url: 'tel:08497220066', icon: 'call' },
      ],
      disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
    });
  }

  // 5. Referrals Tracking
  if (q.includes('referral') || q.includes('transfer') || q.includes('రెఫరల్') || q.includes('బదిలీ')) {
    const responseEn = 'Official hospital referral tracking enables patients referred by village ASHA/ANM workers to easily access specialist care at CHCs or District Civil Hospital. You can view your active referral code, assigned specialist, and transport arrangements directly under the "Hospital Referrals" tab.';
    const responseTe = 'ఆశా కార్యకర్త లేదా పీహెచ్‌సీ వైద్యులు జారీ చేసిన హాస్పిటల్ రెఫరల్ స్లిప్‌లను పోర్టల్‌లో ట్రాక్ చేయవచ్చు. మీరు రిఫర్ చేయబడిన ఆసుపత్రి, డాక్టర్ మరియు ఉచిత రవాణా వివరాలను మీ ప్రొఫైల్‌లోని "Hospital Referrals" ట్యాబ్‌లో చూడవచ్చు.';

    return res.json({
      success: true,
      isEmergency: false,
      text: lang === 'te' ? responseTe : responseEn,
      actions: [
        { label: lang === 'te' ? 'రెఫరల్స్ చూడండి' : 'Track Referrals', url: '#referrals', primary: true, icon: 'assignment' },
      ],
      disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
    });
  }

  // 6. Maternal & Antenatal Care
  if (q.includes('pregnant') || q.includes('maternity') || q.includes('mother') || q.includes('baby') || q.includes('గర్భవతి') || q.includes('ప్రసవం') || q.includes('తల్లి')) {
    const responseEn = 'Expectant mothers are supported with free antenatal checkups, iron folic acid tablets, and Tetanus vaccinations at your nearest village Sub-Centre or Beluguppa Maternity Centre. Under Janani Suraksha Yojana, monetary support is provided for safe institutional delivery. Please connect with your local ASHA worker Lakshmi Devi or book an appointment at Kalyandurg CHC.';
    const responseTe = 'గర్భిణీ స్త్రీలకు సమీపంలోని సబ్ సెంటర్ లేదా బెలుగుప్ప ప్రసూతి కేంద్రంలో ఉచిత వైద్య పరీక్షలు, ఐరన్ మాత్రలు మరియు టీకాలు లభిస్తాయి. జనని సురక్ష యోజన కింద సురక్షిత కాన్పు కోసం ప్రభుత్వ ఆర్థిక సహాయం అందుతుంది. మీ స్థానిక ఆశా కార్యకర్తను సంప్రదించండి లేదా కళ్యాణదుర్గం CHC కి వెళ్లండి.';

    return res.json({
      success: true,
      isEmergency: false,
      text: lang === 'te' ? responseTe : responseEn,
      actions: [
        { label: lang === 'te' ? 'ప్రసూతి కేంద్రాలు' : 'Maternity Centers', url: '#find-healthcare', primary: true, icon: 'pregnant_woman' },
        { label: lang === 'te' ? 'మార్గదర్శిని చదవండి' : 'Maternal Health Guide', url: '#resources', icon: 'menu_book' }
      ],
      disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
    });
  }

  // Default General Guidance
  const defaultEn = `Namaskaram! RuralCare Assistant is here to help coordinate your healthcare in Ananthapur and surrounding rural mandals. You can ask about:
• Booking doctor appointments & OPD tokens
• Locating Primary Health Centres (PHC) & Community Hospitals (CHC)
• Free cashless treatment under Dr. YSR Aarogyasri
• Door-to-door ASHA health records and vitals follow-up
• Diagnostic labs and maternal clinics

How can I assist you today?`;

  const defaultTe = `నమస్కారం! గ్రామీణ ఆరోగ్య సమన్వయ సహాయకుడికి స్వాగతం. అనంతపురం మరియు చుట్టుపక్కల మండలాల్లో ఆరోగ్య సేవలకు మీకు సహాయం చేయడానికి మేము ఇక్కడ ఉన్నాము:
• డాక్టర్ అపాయింట్‌మెంట్‌లు & ఓపీడీ టోకెన్ బుకింగ్
• సమీప ప్రాథమిక ఆరోగ్య కేంద్రాలు (PHC) మరియు ఆసుపత్రులు (CHC)
• డా. వైఎస్సార్ ఆరోగ్యశ్రీ పథకం ఉచిత చికిత్స వివరాలు
• ఆశా వర్కర్ల ద్వారా బీపీ, షుగర్ పరీక్షల రికార్డులు
• ప్రసూతి మరియు ల్యాబ్ పరీక్షల వివరాలు

నేను మీకు ఎలా సహాయపడగలను?`;

  return res.json({
    success: true,
    isEmergency: false,
    text: lang === 'te' ? defaultTe : defaultEn,
    actions: [
      { label: lang === 'te' ? 'అపాయింట్‌మెంట్ బుక్ చేయండి' : 'Book Appointment', url: '#book-appointment', primary: true, icon: 'calendar_month' },
      { label: lang === 'te' ? 'ఆసుపత్రులను కనుగొనండి' : 'Find Facilities', url: '#find-healthcare', icon: 'search' },
      { label: lang === 'te' ? 'ఆరోగ్య మార్గదర్శకాలు' : 'Health Guides', url: '#resources', icon: 'menu_book' },
    ],
    disclaimer: 'RuralCare Assistant provides navigation and administrative guidance only. It is not a clinical diagnosis.'
  });
});

module.exports = router;

