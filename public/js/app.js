/**
 * Main Application Orchestrator for RuralCare Action
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing RuralCare Action Healthcare Platform...');

  // 1. Initialize Components
  window.Navbar?.init();
  window.AuthModals?.init();
  window.AppointmentModal?.init();
  window.PatientPortal?.init();
  window.WorkerPortal?.init();
  window.FacilityFinder?.init();
  window.AIAssistant?.init();
  window.ResourcesModal?.init();
  window.NotificationsDrawer?.init();

  // 2. Validate Stored Session
  if (window.appState.token) {
    try {
      const res = await window.API.auth.me();
      window.appState.setUser(res.user);
      console.log('Session verified:', res.user.name, `(${res.user.role})`);
    } catch (e) {
      console.warn('Session expired or invalid, cleared.');
      window.appState.logout();
    }
  }

  // 3. Audio Guide Narration for Elders (Web Speech API)
  const audioGuideBtn = document.getElementById('hero-audio-guide-btn');
  audioGuideBtn?.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const isTe = window.appState.lang === 'te';
      const textTe = 'నమస్కారం! గ్రామీణ ఆరోగ్య పోర్టల్‌కు స్వాగతం. మీరు మీ సమీపంలోని పీహెచ్‌సీ లేదా ఆసుపత్రిలో ఉచిత డాక్టర్ అపాయింట్‌మెంట్ టోకెన్ పొందవచ్చు. అత్యవసర సహాయం కోసం వెంటనే 108 కు కాల్ చేయండి. వైద్య సలహా కోసం 104 కు కాల్ చేయండి.';
      const textEn = 'Welcome to RuralCare Action. Here you can find nearby primary health centres, book free doctor appointment tokens, and access free treatment under Aarogyasri. For medical emergency, immediately dial 108. For medical advice, dial 104.';

      const utterance = new SpeechSynthesisUtterance(isTe ? textTe : textEn);
      utterance.lang = isTe ? 'te-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      window.Toast?.info(isTe ? 'ఆడియో గైడ్ చదువుతున్నాము...' : 'Playing Audio Guide...');
    } else {
      window.Toast?.warning('Audio playback is not supported on your browser.');
    }
  });

  // 4. Hero & Action Buttons Wiring
  document.getElementById('hero-find-healthcare-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('find-healthcare')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('hero-book-appt-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.AppointmentModal?.open();
  });

  document.getElementById('service-card-facility-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('find-healthcare')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('service-card-appt-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.AppointmentModal?.open();
  });

  document.getElementById('service-card-doctor-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('find-healthcare')?.scrollIntoView({ behavior: 'smooth' });
  });

  // 5. "What would you like to do?" Action Tiles
  document.getElementById('tile-my-appts-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!window.appState.token) {
      window.Toast?.info('Please sign in to view your appointments.');
      window.AuthModals?.openLogin('patient');
    } else {
      window.PatientPortal?.open('appointments');
    }
  });

  document.getElementById('tile-facilities-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('find-healthcare')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('tile-referrals-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!window.appState.token) {
      window.Toast?.info('Please sign in to view your referrals.');
      window.AuthModals?.openLogin('patient');
    } else {
      window.PatientPortal?.open('referrals');
    }
  });

  document.getElementById('tile-reminders-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!window.appState.token) {
      window.Toast?.info('Please sign in to view reminders.');
      window.AuthModals?.openLogin('patient');
    } else {
      window.PatientPortal?.open('reminders');
    }
  });

  document.getElementById('tile-ai-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('ai-query-input')?.focus();
  });

  // 6. Worker Workspace Promotion Banner CTA
  document.getElementById('worker-promo-access-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!window.appState.token || window.appState.user?.role !== 'health_worker') {
      window.Toast?.info('Please sign in with a Health Worker account or use ASHA Demo.');
      window.AuthModals?.openLogin('health_worker');
    } else {
      window.WorkerPortal?.open();
    }
  });

  // 7. Footer Resource Modal Links
  document.getElementById('footer-aarogyasri-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.ResourcesModal?.open('schemes');
  });

  document.getElementById('footer-maternal-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.ResourcesModal?.open('maternal');
  });

  document.getElementById('footer-worker-portal-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!window.appState.token || window.appState.user?.role !== 'health_worker') {
      window.AuthModals?.openLogin('health_worker');
    } else {
      window.WorkerPortal?.open();
    }
  });

  // Listen to Language Changes and re-render dynamic text
  window.appState.subscribe('lang', () => {
    updatePageLanguage();
  });

  function updatePageLanguage() {
    const isTe = window.appState.lang === 'te';

    // Hero title & subtitle
    const heroTitle = document.getElementById('hero-main-title');
    if (heroTitle) {
      heroTitle.innerHTML = isTe 
        ? `అందరికీ ఆరోగ్యం. <br class="hidden sm:inline"/><span class="text-secondary">అందుబాటులో సంరక్షణ.</span>`
        : `Healthcare for everyone. <br class="hidden sm:inline"/><span class="text-secondary">Care within reach.</span>`;
    }

    const heroSub = document.getElementById('hero-telugu-sub');
    if (heroSub) {
      heroSub.textContent = isTe ? 'గ్రామీణ ప్రాంత ప్రజల కోసం ప్రత్యేక వైద్య సేవలు' : 'అందరికీ ఆరోగ్యం. అందుబాటులో సంరక్షణ';
    }

    const heroDesc = document.getElementById('hero-desc-text');
    if (heroDesc) {
      heroDesc.textContent = isTe 
        ? 'సమీప ప్రాథమిక ఆరోగ్య కేంద్రాలను కనుగొనండి, డాక్టర్ అపాయింట్‌మెంట్‌లను బుక్ చేసుకోండి, తెలుగు లేదా ఇంగ్లీషులో సులభంగా సేవలు పొందండి.'
        : 'Find nearby primary health centres, request doctor appointments, and get guided care in Telugu or English with zero digital hassle.';
    }

    // Facility finder placeholder
    const searchInput = document.getElementById('facility-search-input');
    if (searchInput) {
      searchInput.placeholder = isTe ? 'గ్రామం పేరు, మండలం లేదా పిన్ కోడ్ నమోదు చేయండి...' : 'Search by Village name, Mandal, Town, District, or PIN code...';
    }
  }

  updatePageLanguage();
});

