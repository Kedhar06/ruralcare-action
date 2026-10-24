/**
 * Authentication Modals Component (Login, Register, Forgot Password, Demo)
 */

const AuthModals = {
  activeRole: 'patient', // 'patient' or 'health_worker'

  init() {
    this.createModals();
  },

  createModals() {
    let container = document.getElementById('auth-modals-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'auth-modals-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <!-- 1. LOGIN MODAL -->
      <div id="login-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <!-- Close button -->
          <button id="close-login-modal-btn" class="absolute top-4 right-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Close login dialog">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>

          <!-- Modal Header -->
          <div class="mb-5">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-primary-container text-secondary-fixed mb-2">
              <span class="material-symbols-outlined text-[16px]">lock</span>
              Secure Portal Sign In
            </div>
            <h2 id="login-modal-title" class="text-headline-sm font-bold text-primary">Access Your RuralCare Account</h2>
            <p class="text-body-md text-on-surface-variant mt-1">Sign in to manage consultations, health records, and emergency alerts.</p>
          </div>

          <!-- Role Toggle Buttons -->
          <div class="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-xl mb-5">
            <button id="login-role-patient-btn" class="py-2.5 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 bg-primary text-on-primary shadow-sm" type="button">
              <span class="material-symbols-outlined text-[18px]">person</span>
              Patient / Citizen
            </button>
            <button id="login-role-worker-btn" class="py-2.5 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary" type="button">
              <span class="material-symbols-outlined text-[18px]">stethoscope</span>
              Health Worker
            </button>
          </div>

          <!-- Login Form -->
          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-label-md font-bold text-primary mb-1" for="login-identifier">
                Mobile Number or Email
              </label>
              <input id="login-identifier" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="e.g. 9876543210" type="text" required />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-label-md font-bold text-primary" for="login-password">
                  Password
                </label>
                <button id="open-forgot-pw-btn" class="text-label-sm font-bold text-secondary hover:underline" type="button">
                  Forgot Password?
                </button>
              </div>
              <input id="login-password" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="Enter your password" type="password" required />
            </div>

            <button id="submit-login-btn" class="w-full min-h-[52px] bg-primary text-on-primary rounded-lg font-label-lg font-bold hover:bg-on-primary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2" type="submit">
              <span>Sign In</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <!-- 1-Click Demo Evaluation Login -->
          <div class="mt-5 pt-4 border-t border-outline-variant/60">
            <div class="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider text-center mb-2">
              Instant 1-Click Evaluation Demo
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button id="demo-patient-btn" class="min-h-[44px] px-3 py-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg font-label-sm font-bold hover:bg-on-tertiary-container hover:text-on-primary transition-colors flex items-center justify-center gap-1" type="button">
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
                Patient Demo
              </button>
              <button id="demo-worker-btn" class="min-h-[44px] px-3 py-2 bg-secondary text-on-secondary rounded-lg font-label-sm font-bold hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-1" type="button">
                <span class="material-symbols-outlined text-[16px]">medical_services</span>
                ASHA Demo
              </button>
            </div>
          </div>

          <!-- Switch to Register -->
          <div class="mt-4 text-center text-label-sm text-on-surface-variant">
            Don't have an account? 
            <button id="open-register-btn" class="font-bold text-secondary hover:underline ml-1" type="button">
              Register Here
            </button>
          </div>
        </div>
      </div>

      <!-- 2. REGISTRATION MODAL -->
      <div id="register-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="register-modal-title">
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl max-w-lg w-full p-6 relative max-h-[92vh] overflow-y-auto">
          <!-- Close button -->
          <button id="close-register-modal-btn" class="absolute top-4 right-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Close register dialog">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>

          <!-- Modal Header -->
          <div class="mb-4">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-secondary-fixed text-on-secondary-fixed mb-2">
              <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
              National Health Mission Registry
            </div>
            <h2 id="register-modal-title" class="text-headline-sm font-bold text-primary">Create Your Account</h2>
            <p class="text-body-md text-on-surface-variant mt-0.5">Register as a citizen patient or accredited health worker.</p>
          </div>

          <!-- Role Selector -->
          <div class="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-xl mb-4">
            <button id="register-role-patient-btn" class="py-2 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 bg-primary text-on-primary shadow-sm" type="button">
              <span class="material-symbols-outlined text-[18px]">person</span>
              Patient / Citizen
            </button>
            <button id="register-role-worker-btn" class="py-2 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary" type="button">
              <span class="material-symbols-outlined text-[18px]">stethoscope</span>
              Health Worker (ASHA/ANM)
            </button>
          </div>

          <!-- Register Form -->
          <form id="register-form" class="space-y-3.5">
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="reg-name">Full Name *</label>
              <input id="reg-name" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="e.g. Ramesh Kumar" type="text" required />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="reg-phone">Mobile Number *</label>
                <input id="reg-phone" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="10-digit mobile" type="tel" pattern="[0-9]{10}" required />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="reg-password">Password (min 6 chars) *</label>
                <input id="reg-password" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="Create password" type="password" minlength="6" required />
              </div>
            </div>

            <!-- Health Worker Type field (conditional) -->
            <div id="reg-worker-type-container" class="hidden">
              <label class="block text-label-sm font-bold text-primary mb-1" for="reg-worker-type">Health Worker Designation *</label>
              <select id="reg-worker-type" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary">
                <option value="asha">ASHA Worker (Accredited Social Health Activist)</option>
                <option value="anm">ANM (Auxiliary Nurse Midwife)</option>
                <option value="medical_officer">Medical Officer / Doctor</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="reg-gender">Gender</label>
                <select id="reg-gender" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="reg-age">Age</label>
                <input id="reg-age" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="e.g. 42" type="number" min="0" max="120" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="reg-village">Village / Town</label>
                <input id="reg-village" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="e.g. Brahmasamudram" type="text" />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="reg-mandal">Mandal</label>
                <input id="reg-mandal" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="e.g. Kalyandurg" type="text" value="Kalyandurg" />
              </div>
            </div>

            <div id="reg-patient-abha-container">
              <label class="block text-label-sm font-bold text-primary mb-1" for="reg-abha">ABHA Health ID (Optional)</label>
              <input id="reg-abha" class="w-full min-h-[48px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="e.g. 91-4567-8901-2345" type="text" />
            </div>

            <button id="submit-register-btn" class="w-full min-h-[52px] bg-secondary text-on-secondary rounded-lg font-label-lg font-bold hover:bg-on-secondary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2 mt-4" type="submit">
              <span>Complete Registration</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <!-- Back to login -->
          <div class="mt-4 text-center text-label-sm text-on-surface-variant">
            Already have an account? 
            <button id="open-login-from-reg-btn" class="font-bold text-secondary hover:underline ml-1" type="button">
              Sign In Here
            </button>
          </div>
        </div>
      </div>

      <!-- 3. FORGOT PASSWORD MODAL -->
      <div id="forgot-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 modal-backdrop" role="dialog" aria-modal="true">
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl max-w-md w-full p-6 relative">
          <button id="close-forgot-modal-btn" class="absolute top-4 right-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
          <h2 class="text-headline-sm font-bold text-primary mb-2">Reset Password</h2>
          <p class="text-body-md text-on-surface-variant mb-4">Enter your registered mobile number to receive a verification OTP.</p>

          <form id="forgot-form" class="space-y-4">
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="forgot-phone">Mobile Number</label>
              <input id="forgot-phone" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md" placeholder="10-digit mobile" type="tel" required />
            </div>
            <button id="submit-forgot-btn" class="w-full min-h-[50px] bg-primary text-on-primary rounded-lg font-label-md font-bold hover:bg-on-primary-fixed-variant" type="submit">
              Send SMS OTP
            </button>
          </form>

          <form id="reset-pw-form" class="space-y-4 mt-4 hidden pt-4 border-t border-outline-variant">
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="reset-otp">Verification OTP</label>
              <input id="reset-otp" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md" placeholder="Enter 6-digit OTP (123456)" type="text" required />
            </div>
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="reset-new-pw">New Password</label>
              <input id="reset-new-pw" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md" placeholder="Enter new password" type="password" minlength="6" required />
            </div>
            <button class="w-full min-h-[50px] bg-secondary text-on-secondary rounded-lg font-label-md font-bold hover:bg-on-secondary-fixed-variant" type="submit">
              Update Password
            </button>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Open / Close
    document.getElementById('close-login-modal-btn')?.addEventListener('click', () => this.closeLogin());
    document.getElementById('close-register-modal-btn')?.addEventListener('click', () => this.closeRegister());
    document.getElementById('close-forgot-modal-btn')?.addEventListener('click', () => this.closeForgot());

    document.getElementById('open-register-btn')?.addEventListener('click', () => {
      this.closeLogin();
      this.openRegister(this.activeRole);
    });

    document.getElementById('open-login-from-reg-btn')?.addEventListener('click', () => {
      this.closeRegister();
      this.openLogin(this.activeRole);
    });

    document.getElementById('open-forgot-pw-btn')?.addEventListener('click', () => {
      this.closeLogin();
      this.openForgot();
    });

    // Login Role Toggle
    const loginPatBtn = document.getElementById('login-role-patient-btn');
    const loginWrkBtn = document.getElementById('login-role-worker-btn');

    loginPatBtn?.addEventListener('click', () => {
      this.activeRole = 'patient';
      loginPatBtn.className = 'py-2.5 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 bg-primary text-on-primary shadow-sm';
      loginWrkBtn.className = 'py-2.5 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary';
    });

    loginWrkBtn?.addEventListener('click', () => {
      this.activeRole = 'health_worker';
      loginWrkBtn.className = 'py-2.5 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 bg-secondary text-on-secondary shadow-sm';
      loginPatBtn.className = 'py-2.5 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary';
    });

    // Register Role Toggle
    const regPatBtn = document.getElementById('register-role-patient-btn');
    const regWrkBtn = document.getElementById('register-role-worker-btn');
    const workerTypeDiv = document.getElementById('reg-worker-type-container');

    regPatBtn?.addEventListener('click', () => {
      this.activeRole = 'patient';
      regPatBtn.className = 'py-2 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 bg-primary text-on-primary shadow-sm';
      regWrkBtn.className = 'py-2 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary';
      workerTypeDiv?.classList.add('hidden');
    });

    regWrkBtn?.addEventListener('click', () => {
      this.activeRole = 'health_worker';
      regWrkBtn.className = 'py-2 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 bg-secondary text-on-secondary shadow-sm';
      regPatBtn.className = 'py-2 px-3 rounded-lg font-bold text-label-md transition-all flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary';
      workerTypeDiv?.classList.remove('hidden');
    });

    // Login Form Submit
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('login-identifier').value.trim();
      const password = document.getElementById('login-password').value;
      const submitBtn = document.getElementById('submit-login-btn');

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">refresh</span> Signing in...';

        const res = await window.API.auth.login(identifier, password, this.activeRole);
        window.appState.setToken(res.token);
        window.appState.setUser(res.user);
        window.Toast?.success(`Welcome back, ${res.user.name}!`);
        this.closeLogin();

        // Open relevant portal
        if (res.user.role === 'health_worker') {
          window.WorkerPortal?.open();
        } else {
          window.PatientPortal?.open();
        }
      } catch (err) {
        window.Toast?.error(err.message || 'Login failed. Please check credentials.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In</span><span class="material-symbols-outlined">arrow_forward</span>';
      }
    });

    // Register Form Submit
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-register-btn');

      const data = {
        role: this.activeRole,
        worker_type: this.activeRole === 'health_worker' ? document.getElementById('reg-worker-type').value : undefined,
        name: document.getElementById('reg-name').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value,
        gender: document.getElementById('reg-gender').value,
        age: document.getElementById('reg-age').value ? Number(document.getElementById('reg-age').value) : undefined,
        village: document.getElementById('reg-village').value.trim() || undefined,
        mandal: document.getElementById('reg-mandal').value.trim() || undefined,
        abha_id: document.getElementById('reg-abha')?.value.trim() || undefined,
      };

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">refresh</span> Creating Account...';

        const res = await window.API.auth.register(data);
        window.appState.setToken(res.token);
        window.appState.setUser(res.user);
        window.Toast?.success(`Account created! Welcome, ${res.user.name}.`);
        this.closeRegister();

        if (res.user.role === 'health_worker') {
          window.WorkerPortal?.open();
        } else {
          window.PatientPortal?.open();
        }
      } catch (err) {
        window.Toast?.error(err.message || 'Registration failed.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Complete Registration</span><span class="material-symbols-outlined">arrow_forward</span>';
      }
    });

    // Demo Logins
    document.getElementById('demo-patient-btn')?.addEventListener('click', () => this.handleDemoLogin('patient'));
    document.getElementById('demo-worker-btn')?.addEventListener('click', () => this.handleDemoLogin('health_worker'));

    // Forgot Password Submit
    document.getElementById('forgot-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('forgot-phone').value.trim();
      try {
        const res = await window.API.auth.forgotPassword(phone);
        window.Toast?.info(res.message);
        document.getElementById('reset-pw-form')?.classList.remove('hidden');
      } catch (err) {
        window.Toast?.error(err.message);
      }
    });

    // Reset Password Submit
    document.getElementById('reset-pw-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('forgot-phone').value.trim();
      const otp = document.getElementById('reset-otp').value.trim();
      const newPassword = document.getElementById('reset-new-pw').value;
      try {
        const res = await window.API.auth.resetPassword(phone, otp, newPassword);
        window.Toast?.success(res.message);
        this.closeForgot();
        this.openLogin();
      } catch (err) {
        window.Toast?.error(err.message);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLogin();
        this.closeRegister();
        this.closeForgot();
      }
    });
  },

  openLogin(role = 'patient') {
    this.activeRole = role;
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (role === 'health_worker') {
      document.getElementById('login-role-worker-btn')?.click();
    } else {
      document.getElementById('login-role-patient-btn')?.click();
    }
  },

  closeLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  openRegister(role = 'patient') {
    this.activeRole = role;
    const modal = document.getElementById('register-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (role === 'health_worker') {
      document.getElementById('register-role-worker-btn')?.click();
    } else {
      document.getElementById('register-role-patient-btn')?.click();
    }
  },

  closeRegister() {
    const modal = document.getElementById('register-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  openForgot() {
    const modal = document.getElementById('forgot-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  closeForgot() {
    const modal = document.getElementById('forgot-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  async handleDemoLogin(role) {
    try {
      const res = await window.API.auth.demoLogin(role);
      window.appState.setToken(res.token);
      window.appState.setUser(res.user);
      window.Toast?.success(`Demo Login Successful: Signed in as ${res.user.name}`);
      this.closeLogin();

      if (role === 'health_worker') {
        window.WorkerPortal?.open();
      } else {
        window.PatientPortal?.open();
      }
    } catch (err) {
      window.Toast?.error(err.message || 'Demo login failed');
    }
  }
};

window.AuthModals = AuthModals;

