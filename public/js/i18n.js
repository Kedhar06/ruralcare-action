/**
 * Bilingual (English & Telugu) Localization Engine for RuralCare Action
 */

const translations = {
  en: {
    // Top Bar
    emergency: 'EMERGENCY',
    ambulance: 'Ambulance: 108',
    medicalAdvice: 'Medical Advice: 104',
    tollFreeSupport: 'Toll-Free Rural Support: 1800-425-0104',
    highContrast: 'High Contrast',
    fontDefault: 'Default font size',
    fontLarge: 'Large font size',

    // Nav
    home: 'Home',
    findHealthcare: 'Find Healthcare',
    services: 'Services',
    howItWorks: 'How It Works',
    aiAssistant: 'AI Assistant',
    getStarted: 'Get Started',
    login: 'Login / Sign In',
    logout: 'Sign Out',
    myAccount: 'My Portal',
    workerWorkspace: 'Worker Workspace',
    patientPortal: 'Patient Portal',
    notifications: 'Notifications',

    // Hero
    heroPill: 'AI-Powered Healthcare Coordination & Elder Inclusion',
    heroTitle: 'Healthcare for everyone. Care within reach.',
    heroSubtitle: 'అందరికీ ఆరోగ్యం. అందుబాటులో సంరక్షణ',
    heroDescription: 'Find nearby primary health centres, request doctor appointments, and get guided care in Telugu or English with zero digital hassle.',
    findNearbyBtn: 'Find Healthcare Near You',
    bookApptBtn: 'Book an Appointment',
    audioGuideBtn: 'వినండి / Audio Guide',
    verifiedClinics: '500+ Rural Clinics Connected',
    verifiedConsults: '12,000+ Verified Consultations',
    freePublicCoord: '100% Free Public Coordination',

    // Services
    servicesHeading: 'Essential Rural Healthcare Services',
    findFacilityTitle: 'Find Healthcare',
    findFacilityDesc: 'Discover nearby Primary Health Centres (PHCs), Community Health Centres (CHCs), and 24/7 wellness clinics.',
    bookApptTitle: 'Book an Appointment',
    bookApptDesc: 'Request a specialist consultation or general doctor visit, receive confirmation SMS, and track real-time token status.',
    findDoctorTitle: 'Find a Doctor',
    findDoctorDesc: 'Explore verified community medical officers, visiting obstetricians, pediatric specialists, and tele-consult schedules.',

    // Action Tiles
    whatToDoHeading: 'What would you like to do?',
    whatToDoSubtitle: 'మీకు ఏమి సహాయం కావాలి? — Choose an action below for instant navigation.',
    tileMyAppts: 'My Appointments',
    tileMyApptsDesc: 'Check OPD slot, doctor token numbers, and live SMS reminder alerts.',
    tileFacilities: 'Healthcare Facilities',
    tileFacilitiesDesc: 'Locate Primary Health Centres, maternity homes, and diagnostic labs.',
    tileReferrals: 'Hospital Referrals',
    tileReferralsDesc: 'Track inter-facility transfer slips and specialist Aarogyasri authorizations.',
    tileReminders: 'Follow-up Reminders',
    tileRemindersDesc: 'Automated notifications for hypertension, diabetes checkups, and child immunizations.',
    tileAIAssistant: 'Ask for Help / AI Assistant',
    tileAIAssistantDesc: 'Voice & text guidance in Telugu/English for elder and village users.',
    tileEmergency: 'Helpline 108 & 104',
    tileEmergencyDesc: 'Direct tap-to-call emergency dispatch and 24-hour qualified nurse consultation.',

    // Finder
    finderTitle: 'Find Healthcare Facilities & Doctors',
    finderSubtitle: 'Search across village sub-centres, mandal hospitals, and district referral centres without requiring GPS permission.',
    searchPlaceholder: 'Search by Village name, Mandal, Town, District, or PIN code...',
    searchBtn: 'Search Facilities',
    filterAll: 'All Types',
    filterPHC: 'Primary Health Centres (PHC)',
    filterCHC: 'Community Hospitals (CHC)',
    filterLab: 'Diagnostic & Ultrasound Labs',
    filterMaternity: 'Maternity Care Centers',

    // AI Section
    aiBadge: 'Bilingual Health Navigator',
    aiHeading: 'Not sure where to start?',
    aiSubheading: 'మీ భాషలో సరైన వైద్య సలహా పొందండి.',
    aiDesc: 'Our AI Assistant guides you step-by-step through appointment tokens, Aarogyasri document verification, and elderly hospital referrals in Telugu and English.',
    aiDisclaimer: 'Official Disclaimer: RuralCare Assistant provides administrative triage, booking, and facility navigation only. It does not provide medical diagnoses or prescriptions. In case of acute medical emergencies, immediately dial 108.',
    aiInputPlaceholder: 'Ask in English or తెలుగు...',
    aiOnline: 'Online',
    aiAssistantTitle: 'RuralCare Assistant',

    // Health Worker Banner
    workerBannerTag: 'ASHA & ANM Field Health Workers',
    workerBannerTitle: 'Healthcare coordination, made easier for ASHA and ANM workers.',
    workerBannerDesc: 'Coordinate appointments, manage hospital referrals, and log door-to-door patient follow-ups with zero paperwork and instant offline-ready sync.',
    workerBannerBtn: 'Access Healthcare Worker Workspace',

    // Triage Badges
    triageNormal: 'Normal Parameters',
    triageFollowup: 'Follow-up Recommended',
    triageUrgent: 'Urgent Attention Needed',
  },

  te: {
    // Top Bar
    emergency: 'అత్యవసరం',
    ambulance: 'అంబులెన్స్: 108',
    medicalAdvice: 'వైద్య సలహా: 104',
    tollFreeSupport: 'ఉచిత గ్రామీణ సహాయం: 1800-425-0104',
    highContrast: 'హై కాంట్రాస్ట్',
    fontDefault: 'సాధారణ అక్షరాలు',
    fontLarge: 'పెద్ద అక్షరాలు',

    // Nav
    home: 'హోమ్',
    findHealthcare: 'ఆసుపత్రులు',
    services: 'సేవలు',
    howItWorks: 'విధానం',
    aiAssistant: 'AI సహాయకుడు',
    getStarted: 'ప్రారంభించండి',
    login: 'ప్రవేశం / లాగిన్',
    logout: 'లాగౌట్',
    myAccount: 'నా పోర్టల్',
    workerWorkspace: 'ఆశా వర్కర్ వర్క్‌స్పేస్',
    patientPortal: 'రోగి పోర్టల్',
    notifications: 'నోటిఫికేషన్‌లు',

    // Hero
    heroPill: 'AI ఆధారిత ఆరోగ్య సమన్వయం & వృద్ధుల సంరక్షణ',
    heroTitle: 'అందరికీ ఆరోగ్యం. అందుబాటులో సంరక్షణ.',
    heroSubtitle: 'గ్రామీణ ప్రాంత ప్రజల కోసం ప్రత్యేక వైద్య సేవలు',
    heroDescription: 'సమీప ప్రాథమిక ఆరోగ్య కేంద్రాలను కనుగొనండి, డాక్టర్ అపాయింట్‌మెంట్‌లను బుక్ చేసుకోండి, తెలుగు లేదా ఇంగ్లీషులో సులభంగా సేవలు పొందండి.',
    findNearbyBtn: 'సమీప ఆసుపత్రులను కనుగొనండి',
    bookApptBtn: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    audioGuideBtn: 'వినండి / Audio Guide',
    verifiedClinics: '500+ అనుసంధానించబడిన క్లినిక్‌లు',
    verifiedConsults: '12,000+ ధృవీకరించబడిన వైద్య సలహాలు',
    freePublicCoord: '100% ఉచిత ప్రజా సమన్వయం',

    // Services
    servicesHeading: 'ముఖ్యమైన గ్రామీణ ఆరోగ్య సేవలు',
    findFacilityTitle: 'ఆసుపత్రులను కనుగొనండి',
    findFacilityDesc: 'ప్రాథమిక ఆరోగ్య కేంద్రాలు (PHC), కమ్యూనిటీ హెల్త్ సెంటర్లు (CHC) మరియు 24/7 వెల్‌నెస్ క్లినిక్‌ల వివరాలు.',
    bookApptTitle: 'అపాయింట్‌మెంట్ బుకింగ్',
    bookApptDesc: 'స్పెషలిస్ట్ లేదా జనరల్ డాక్టర్ టోకెన్ పొందండి, SMS సమాచారం మరియు ప్రత్యక్ష సమయ వివరాలు తెలుసుకోండి.',
    findDoctorTitle: 'డాక్టర్‌ను ఎంచుకోండి',
    findDoctorDesc: 'ప్రభుత్వ వైద్యాధికారులు, ప్రసూతి నిపుణులు, పిల్లల వైద్యులు మరియు టెలి-మెడిసిన్ వివరాలు.',

    // Action Tiles
    whatToDoHeading: 'మీకు ఏమి సహాయం కావాలి?',
    whatToDoSubtitle: 'త్వరిత సేవ కోసం క్రింది ఎంపికలలో ఒకదానిని ఎంచుకోండి.',
    tileMyAppts: 'నా అపాయింట్‌మెంట్‌లు',
    tileMyApptsDesc: 'ఓపీడీ స్లాట్, డాక్టర్ టోకెన్ నంబర్ మరియు SMS రిమైండర్ వివరాలు.',
    tileFacilities: 'ఆరోగ్య కేంద్రాలు',
    tileFacilitiesDesc: 'పీహెచ్‌సీలు, ప్రసూతి గృహాలు మరియు ల్యాబ్‌ల వివరాలు.',
    tileReferrals: 'ఆసుపత్రి రెఫరల్స్',
    tileReferralsDesc: 'ఆరోగ్యశ్రీ ఆసుపత్రి బదిలీ స్లిప్‌లు మరియు ప్రత్యేక అనుమతులు.',
    tileReminders: 'ఫాలో-అప్ రిమైండర్‌లు',
    tileRemindersDesc: 'రక్తపోటు (బీపీ), మధుమేహం మరియు పిల్లల టీకాల స్వయంచాలక సమాచారం.',
    tileAIAssistant: 'AI సహాయకుడిని అడగండి',
    tileAIAssistantDesc: 'వృద్ధులు మరియు గ్రామస్తుల కోసం తెలుగులో వాయిస్ & టెక్స్ట్ మార్గదర్శనం.',
    tileEmergency: 'హెల్ప్‌లైన్ 108 & 104',
    tileEmergencyDesc: 'తక్షణ ఉచిత అంబులెన్స్ మరియు 24 గంటల అనుభవజ్ఞులైన నర్సుల వైద్య సలహా.',

    // Finder
    finderTitle: 'ఆరోగ్య కేంద్రాలు & వైద్యులను కనుగొనండి',
    finderSubtitle: 'జీపీఎస్ అవసరం లేకుండా గ్రామం పేరు, మండలం లేదా పిన్ కోడ్ ద్వారా శోధించండి.',
    searchPlaceholder: 'గ్రామం పేరు, మండలం, పట్టణం లేదా పిన్ కోడ్ నమోదు చేయండి...',
    searchBtn: 'శోధించండి',
    filterAll: 'అన్ని రకాలు',
    filterPHC: 'ప్రాథమిక ఆరోగ్య కేంద్రాలు (PHC)',
    filterCHC: 'కమ్యూనిటీ ఆసుపత్రులు (CHC)',
    filterLab: 'ల్యాబ్ & అల్ట్రాసౌండ్ కేంద్రాలు',
    filterMaternity: 'ప్రసూతి సంరక్షణ కేంద్రాలు',

    // AI Section
    aiBadge: 'ద్విభాషా ఆరోగ్య సహాయకుడు',
    aiHeading: 'ఎక్కడ ప్రారంభించాలో తెలియడం లేదా?',
    aiSubheading: 'మీ భాషలో సరైన వైద్య సలహా పొందండి.',
    aiDesc: 'అపాయింట్‌మెంట్ టోకెన్లు, ఆరోగ్యశ్రీ పత్రాల ధృవీకరణ మరియు ఆసుపత్రి రెఫరల్స్ కోసం మా AI మీకు తెలుగులో సహాయం చేస్తుంది.',
    aiDisclaimer: 'అధికారిక ప్రకటన: ఈ అసిస్టెంట్ పరిపాలనా సహాయం మరియు మార్గదర్శనం మాత్రమే అందిస్తుంది. ఇది వైద్య నిర్ధారణ లేదా ప్రిస్క్రిప్షన్ కాదు. అత్యవసర పరిస్థితుల్లో వెంటనే 108 కు కాల్ చేయండి.',
    aiInputPlaceholder: 'తెలుగు లేదా ఇంగ్లీషులో అడగండి...',
    aiOnline: 'ఆన్‌లైన్',
    aiAssistantTitle: 'రూరల్ కేర్ అసిస్టెంట్',

    // Health Worker Banner
    workerBannerTag: 'ఆశా & ఏఎన్‌ఎం క్షేత్రస్థాయి కార్యకర్తలు',
    workerBannerTitle: 'ఆశా మరియు ఏఎన్‌ఎం కార్యకర్తల కోసం సులభమైన ఆరోగ్య సమన్వయం.',
    workerBannerDesc: 'కాగితపు పని లేకుండా అపాయింట్‌మెంట్‌లను సమన్వయం చేయండి, రెఫరల్స్ నిర్వహించండి మరియు ఇంటింటికీ రోగుల రికార్డులను నమోదు చేయండి.',
    workerBannerBtn: 'వర్కర్ వర్క్‌స్పేస్‌లోకి ప్రవేశించండి',

    // Triage Badges
    triageNormal: 'సాధారణ స్థాయి',
    triageFollowup: 'ఫాలో-అప్ అవసరం',
    triageUrgent: 'అత్యవసర శ్రద్ధ అవసరం',
  }
};

function t(key) {
  const currentLang = window.appState ? window.appState.lang : 'en';
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  return translations.en[key] || key;
}

window.translations = translations;
window.t = t;

