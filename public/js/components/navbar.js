/**
 * Navigation Bar Component (Top Emergency Utility + Sticky Main Header)
 */

const Navbar = {
  init() {
    this.renderTopBar();
    this.renderMainHeader();

    window.appState.subscribe('user', () => this.renderMainHeader());
    window.appState.subscribe('lang', () => {
      this.renderTopBar();
      this.renderMainHeader();
    });
    window.appState.subscribe('unreadNotifications', () => this.updateNotificationBadge());
  },

  renderTopBar() {
    const el = document.getElementById('top-utility-bar');
    if (!el) return;

    const isTe = window.appState.lang === 'te';

    el.innerHTML = `
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-label-sm font-label-sm">
        <div class="flex items-center flex-wrap gap-x-4 gap-y-1">
          <span class="inline-flex items-center gap-1.5 bg-error text-on-error px-2 py-0.5 rounded font-bold">
            <span class="material-symbols-outlined text-[16px] fill-icon">emergency</span>
            ${window.t('emergency')}
          </span>
          <span class="text-surface-bright">
            ${window.t('ambulance')}: <a class="font-bold underline hover:text-secondary-fixed transition-colors" href="tel:108">108</a>
          </span>
          <span class="hidden sm:inline text-outline-variant">|</span>
          <span class="text-surface-bright">
            ${window.t('medicalAdvice')}: <a class="font-bold underline hover:text-secondary-fixed transition-colors" href="tel:104">104</a>
          </span>
          <span class="hidden md:inline text-outline-variant">|</span>
          <span class="hidden md:inline text-surface-container-high">
            ${window.t('tollFreeSupport')}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Font Size Toggles -->
          <div aria-label="Text size adjustments" class="flex items-center bg-primary rounded border border-outline-variant/40 px-1 py-0.5" role="group">
            <button id="font-scale-default-btn" aria-label="Default font size" class="px-2 py-0.5 text-label-sm font-bold hover:text-secondary-fixed focus:outline-none transition-colors ${window.appState.fontScale === 'default' ? 'text-secondary-fixed' : 'text-on-primary'}" title="Default font size" type="button">A</button>
            <span class="text-outline-variant/60">/</span>
            <button id="font-scale-lg-btn" aria-label="Large font size" class="px-2 py-0.5 text-label-md font-bold hover:text-secondary-fixed focus:outline-none transition-colors ${window.appState.fontScale === 'lg' ? 'text-secondary-fixed' : 'text-on-primary'}" title="Large font size (+15%)" type="button">A+</button>
            <span class="text-outline-variant/60">/</span>
            <button id="font-scale-xl-btn" aria-label="Extra large font size" class="px-2 py-0.5 text-label-lg font-bold hover:text-secondary-fixed focus:outline-none transition-colors ${window.appState.fontScale === 'xl' ? 'text-secondary-fixed' : 'text-on-primary'}" title="Extra large font size (+30%)" type="button">A++</button>
          </div>

          <!-- High Contrast Mode Toggle -->
          <button id="toggle-contrast-btn" aria-label="Toggle High Contrast Mode" class="inline-flex items-center gap-1 text-label-sm hover:text-secondary-fixed px-2 py-0.5 rounded transition-colors ${window.appState.highContrast ? 'bg-secondary text-on-secondary' : 'text-surface-bright'}" type="button">
            <span class="material-symbols-outlined text-[18px]">contrast</span>
            <span class="hidden lg:inline">${window.t('highContrast')}</span>
          </button>

          <!-- Bilingual Switcher: English / Telugu -->
          <div class="flex items-center bg-surface-container-lowest/10 rounded p-0.5 border border-outline-variant/30 text-label-sm">
            <button id="lang-en-btn" class="px-2.5 py-1 rounded font-bold shadow-sm transition-all flex items-center gap-1 ${!isTe ? 'bg-secondary text-on-secondary' : 'text-surface-bright hover:text-secondary-fixed'}" type="button">
              ${!isTe ? '<span class="material-symbols-outlined text-[14px] fill-icon">check</span>' : ''}
              English
            </button>
            <button id="lang-te-btn" class="px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${isTe ? 'bg-secondary text-on-secondary' : 'text-surface-bright hover:text-secondary-fixed font-medium'}" type="button">
              ${isTe ? '<span class="material-symbols-outlined text-[14px] fill-icon">check</span>' : ''}
              తెలుగు
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    document.getElementById('font-scale-default-btn')?.addEventListener('click', () => window.appState.setFontScale('default'));
    document.getElementById('font-scale-lg-btn')?.addEventListener('click', () => window.appState.setFontScale('lg'));
    document.getElementById('font-scale-xl-btn')?.addEventListener('click', () => window.appState.setFontScale('xl'));

    document.getElementById('toggle-contrast-btn')?.addEventListener('click', () => {
      window.appState.setHighContrast(!window.appState.highContrast);
    });

    document.getElementById('lang-en-btn')?.addEventListener('click', () => window.appState.setLang('en'));
    document.getElementById('lang-te-btn')?.addEventListener('click', () => window.appState.setLang('te'));
  },

  renderMainHeader() {
    const el = document.getElementById('main-nav-actions');
    if (!el) return;

    const user = window.appState.user;

    if (user) {
      const isWorker = user.role === 'health_worker';
      const roleBadge = isWorker ? (user.worker_type === 'asha' ? 'ASHA Field Worker' : 'Medical Officer') : 'Patient Member';
      const roleIcon = isWorker ? 'stethoscope' : 'person';

      el.innerHTML = `
        <div class="flex items-center gap-2.5">
          <!-- Notification Bell -->
          <button id="nav-notifications-btn" class="relative p-2.5 rounded-lg border border-outline-variant text-primary hover:bg-surface-container transition-colors" title="Notifications" aria-label="View notifications">
            <span class="material-symbols-outlined text-[24px]">notifications</span>
            <span id="nav-notif-badge" class="${window.appState.unreadNotifications > 0 ? '' : 'hidden'} absolute -top-1 -right-1 bg-error text-on-error rounded-full text-[11px] font-bold w-5 h-5 flex items-center justify-center animate-pulse">
              ${window.appState.unreadNotifications}
            </span>
          </button>

          <!-- User Role Pill Button -->
          <button id="nav-user-portal-btn" class="min-h-[48px] px-3.5 py-2 border-2 ${isWorker ? 'border-secondary bg-secondary/10' : 'border-primary bg-primary/5'} text-primary rounded-lg font-label-md flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined text-[20px] text-secondary fill-icon">${roleIcon}</span>
            <div class="text-left hidden sm:block">
              <div class="text-[13px] font-bold leading-tight">${user.name}</div>
              <div class="text-[11px] text-on-surface-variant font-medium">${roleBadge}</div>
            </div>
            <span class="material-symbols-outlined text-[18px]">open_in_new</span>
          </button>

          <!-- Sign Out Button -->
          <button id="nav-logout-btn" class="min-h-[48px] px-3 py-2 border border-outline-variant text-on-surface-variant hover:text-error hover:border-error rounded-lg text-label-sm font-bold flex items-center gap-1 transition-all" title="Sign Out">
            <span class="material-symbols-outlined text-[18px]">logout</span>
            <span class="hidden md:inline">${window.t('logout')}</span>
          </button>
        </div>
      `;

      document.getElementById('nav-notifications-btn')?.addEventListener('click', () => {
        window.NotificationsDrawer?.open();
      });

      document.getElementById('nav-user-portal-btn')?.addEventListener('click', () => {
        if (isWorker) {
          window.WorkerPortal?.open();
        } else {
          window.PatientPortal?.open();
        }
      });

      document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
        window.appState.logout();
        window.Toast?.info('You have signed out.');
      });

    } else {
      // Not logged in: Show Dual-Role Login Dropdown + Book CTA
      el.innerHTML = `
        <div class="relative group" id="loginDropdownContainer">
          <button aria-expanded="false" aria-haspopup="true" class="min-h-[48px] px-4 py-2 border-2 border-primary text-primary hover:bg-surface-container-high rounded-lg font-label-md text-label-md flex items-center gap-2 transition-all" id="roleDropdownBtn" type="button">
            <span class="material-symbols-outlined text-[20px]">person</span>
            <span>${window.t('login')}</span>
            <span class="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-180">expand_more</span>
          </button>

          <!-- Interactive Dual-Role Login Dropdown Panel -->
          <div class="absolute right-0 top-full mt-2 w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-4 z-50 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:opacity-100 hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto">
            <div class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2.5 pb-1 border-b border-outline-variant/60">
              Select Your Access Portal
            </div>

            <div class="space-y-3">
              <!-- Card A: Patient / User Login -->
              <div class="p-3.5 rounded-lg border border-outline-variant hover:border-secondary bg-surface-bright transition-all">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[22px]">person</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-label-md font-label-md font-bold text-primary">Patient / User Login</h4>
                    <p class="text-label-sm font-label-sm text-on-surface-variant mt-0.5 leading-snug">
                      Access appointments, OPD tokens, referrals, and health records.
                    </p>
                    <div class="flex items-center gap-2 mt-2.5">
                      <button id="dropdown-patient-login-btn" class="px-3 py-1.5 bg-primary text-on-primary rounded text-label-sm font-bold hover:bg-on-primary-fixed-variant transition-colors min-h-[36px] inline-flex items-center justify-center" type="button">
                        Sign In
                      </button>
                      <button id="dropdown-patient-demo-btn" class="px-2.5 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed rounded text-label-sm font-bold hover:bg-on-tertiary-container hover:text-on-primary transition-colors inline-flex items-center gap-1 min-h-[36px]" type="button">
                        <span class="material-symbols-outlined text-[14px]">play_arrow</span>
                        Patient Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card B: Healthcare Worker Login -->
              <div class="p-3.5 rounded-lg border border-outline-variant hover:border-secondary bg-surface-bright transition-all">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[22px]">stethoscope</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h4 class="text-label-md font-label-md font-bold text-primary">Healthcare Worker Login</h4>
                      <span class="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container">ASHA / ANM</span>
                    </div>
                    <p class="text-label-sm font-label-sm text-on-surface-variant mt-0.5 leading-snug">
                      Manage appointment requests, triage referrals, and door-to-door coordination.
                    </p>
                    <div class="flex items-center gap-2 mt-2.5">
                      <button id="dropdown-worker-login-btn" class="px-3 py-1.5 bg-primary text-on-primary rounded text-label-sm font-bold hover:bg-on-primary-fixed-variant transition-colors min-h-[36px] inline-flex items-center justify-center" type="button">
                        Worker Sign In
                      </button>
                      <button id="dropdown-worker-demo-btn" class="px-2.5 py-1.5 bg-secondary text-on-secondary rounded text-label-sm font-bold hover:bg-on-secondary-fixed-variant transition-colors inline-flex items-center gap-1 min-h-[36px]" type="button">
                        <span class="material-symbols-outlined text-[14px]">medical_services</span>
                        Worker Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Portal Notice Footer -->
            <div class="mt-3 pt-2 text-center text-label-sm font-label-sm text-on-surface-variant">
              Need assistance? Call Field Support: <span class="font-bold text-primary">1800-425-0104</span>
            </div>
          </div>
        </div>

        <!-- Get Started Action CTA -->
        <button id="nav-get-started-btn" class="min-h-[48px] px-5 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md font-bold hover:bg-on-secondary-fixed-variant transition-all shadow-sm flex items-center gap-1.5" type="button">
          <span>${window.t('getStarted')}</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      `;

      // Event handlers
      document.getElementById('dropdown-patient-login-btn')?.addEventListener('click', () => {
        window.AuthModals?.openLogin('patient');
      });

      document.getElementById('dropdown-patient-demo-btn')?.addEventListener('click', async () => {
        await window.AuthModals?.handleDemoLogin('patient');
      });

      document.getElementById('dropdown-worker-login-btn')?.addEventListener('click', () => {
        window.AuthModals?.openLogin('health_worker');
      });

      document.getElementById('dropdown-worker-demo-btn')?.addEventListener('click', async () => {
        await window.AuthModals?.handleDemoLogin('health_worker');
      });

      document.getElementById('nav-get-started-btn')?.addEventListener('click', () => {
        window.AppointmentModal?.open();
      });
    }
  },

  updateNotificationBadge() {
    const badge = document.getElementById('nav-notif-badge');
    if (!badge) return;
    const count = window.appState.unreadNotifications;
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
};

window.Navbar = Navbar;

