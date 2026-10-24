/**
 * Healthcare Worker (ASHA / ANM / Medical Officer) Workspace Component
 */

const WorkerPortal = {
  activeTab: 'queue', // 'queue', 'registry', 'referrals', 'reminders'
  selectedPatient: null,

  init() {
    this.createPortalModal();
  },

  createPortalModal() {
    let container = document.getElementById('worker-portal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'worker-portal-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div id="worker-portal-modal" class="fixed inset-0 z-[120] hidden items-center justify-center p-3 md:p-6 modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="worker-portal-title">
        <div class="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-2xl max-w-5xl w-full p-6 relative max-h-[95vh] flex flex-col overflow-hidden">
          
          <!-- Header -->
          <div class="flex items-start justify-between pb-4 border-b border-outline-variant shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center font-bold shadow-md">
                <span class="material-symbols-outlined text-[26px]">medical_services</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 id="worker-portal-title" class="text-headline-sm font-bold text-primary">Healthcare Worker Workspace</h2>
                  <span id="worker-badge-pill" class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-secondary-container text-on-secondary-container uppercase">
                    ASHA / ANM Clinical Suite
                  </span>
                </div>
                <p id="worker-user-welcome" class="text-label-sm text-on-surface-variant">Manage field triage, appointment queue, and door-to-door registrations.</p>
              </div>
            </div>

            <button id="close-worker-portal-btn" class="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Close worker workspace">
              <span class="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-outline-variant shrink-0">
            <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div class="text-[11px] font-bold text-on-surface-variant uppercase">Pending Queue</div>
              <div id="metric-pending-queue" class="text-headline-sm font-mono font-bold text-secondary mt-0.5">--</div>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div class="text-[11px] font-bold text-on-surface-variant uppercase">Registered Patients</div>
              <div id="metric-registered-patients" class="text-headline-sm font-mono font-bold text-primary mt-0.5">--</div>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div class="text-[11px] font-bold text-on-surface-variant uppercase">High-Risk Triage</div>
              <div id="metric-high-risk-triage" class="text-headline-sm font-mono font-bold text-error mt-0.5">--</div>
            </div>
            <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div class="text-[11px] font-bold text-on-surface-variant uppercase">Active Referrals</div>
              <div id="metric-active-referrals" class="text-headline-sm font-mono font-bold text-on-tertiary-container mt-0.5">--</div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex items-center gap-1 border-b border-outline-variant pt-2 overflow-x-auto shrink-0" role="tablist">
            <button id="wtab-btn-queue" class="tab-btn px-4 py-3 text-label-md font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active" role="tab" aria-selected="true">
              <span class="material-symbols-outlined text-[18px]">rule</span>
              <span>Appointment Queue</span>
            </button>
            <button id="wtab-btn-registry" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">group</span>
              <span>Patient Registry &amp; Door-to-Door</span>
            </button>
            <button id="wtab-btn-referrals" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">assignment</span>
              <span>Issue Referral Slip</span>
            </button>
            <button id="wtab-btn-reminders" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">alarm_add</span>
              <span>Dispatch Reminders</span>
            </button>
          </div>

          <!-- Tab Content Panel -->
          <div id="worker-portal-tab-content" class="flex-1 overflow-y-auto py-5 space-y-4">
            <div class="text-center py-10">
              <span class="material-symbols-outlined animate-spin text-[32px] text-secondary">refresh</span>
              <p class="text-body-md text-on-surface-variant mt-2">Loading workspace data...</p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pt-4 border-t border-outline-variant flex items-center justify-between shrink-0">
            <div class="text-label-sm text-on-surface-variant flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Field Worker Sync: Active (Online)</span>
            </div>
            <button id="worker-refresh-btn" class="min-h-[44px] px-4 border border-outline-variant rounded-lg font-label-sm font-bold text-on-surface-variant hover:text-primary flex items-center gap-1">
              <span class="material-symbols-outlined text-[18px]">refresh</span>
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Record Vitals Modal Drawer -->
      <div id="record-vitals-modal" class="fixed inset-0 z-[130] hidden items-center justify-center p-4 modal-backdrop" role="dialog" aria-modal="true">
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl max-w-lg w-full p-6 relative max-h-[92vh] overflow-y-auto">
          <button id="close-record-vitals-btn" class="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-container rounded-lg">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div class="mb-4">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-secondary text-on-secondary uppercase">Door-to-Door Assessment</span>
            <h3 id="record-vitals-patient-name" class="text-headline-sm font-bold text-primary mt-1">Record Vitals &amp; Triage</h3>
            <p class="text-body-md text-on-surface-variant">Logged vitals will automatically compute clinical risk according to WHO/NHM guidelines.</p>
          </div>

          <form id="record-vitals-form" class="space-y-3.5">
            <input type="hidden" id="vitals-patient-id" />

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">Systolic BP (mmHg)</label>
                <input id="vitals-sys" class="w-full min-h-[46px] px-3 bg-surface rounded-lg border border-outline" type="number" placeholder="e.g. 130" />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">Diastolic BP (mmHg)</label>
                <input id="vitals-dia" class="w-full min-h-[46px] px-3 bg-surface rounded-lg border border-outline" type="number" placeholder="e.g. 85" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">Blood Sugar (mg/dL)</label>
                <input id="vitals-sugar" class="w-full min-h-[46px] px-3 bg-surface rounded-lg border border-outline" type="number" placeholder="e.g. 140" />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">Sugar Test Type</label>
                <select id="vitals-sugar-type" class="w-full min-h-[46px] px-3 bg-surface rounded-lg border border-outline">
                  <option value="random">Random</option>
                  <option value="fasting">Fasting</option>
                  <option value="postprandial">Postprandial</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">Heart Rate (bpm)</label>
                <input id="vitals-hr" class="w-full min-h-[46px] px-2.5 bg-surface rounded-lg border border-outline" type="number" placeholder="e.g. 76" />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">SpO2 (%)</label>
                <input id="vitals-spo2" class="w-full min-h-[46px] px-2.5 bg-surface rounded-lg border border-outline" type="number" placeholder="e.g. 98" />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1">Temp (°F)</label>
                <input id="vitals-temp" class="w-full min-h-[46px] px-2.5 bg-surface rounded-lg border border-outline" type="number" step="0.1" placeholder="e.g. 98.6" />
              </div>
            </div>

            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Clinical Diagnosis / Impression</label>
              <input id="vitals-diagnosis" class="w-full min-h-[46px] px-3 bg-surface rounded-lg border border-outline" placeholder="e.g. Stage 1 Hypertension, Chronic Back Pain" type="text" />
            </div>

            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Prescription / Dispensed Free Medicines</label>
              <input id="vitals-prescription" class="w-full min-h-[46px] px-3 bg-surface rounded-lg border border-outline" placeholder="e.g. Tab. Amlodipine 5mg, Paracetamol 500mg" type="text" />
            </div>

            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Door-to-Door Notes</label>
              <textarea id="vitals-notes" rows="2" class="w-full p-2.5 bg-surface rounded-lg border border-outline" placeholder="Diet advice, salt reduction discussed, next visit scheduled"></textarea>
            </div>

            <button id="submit-vitals-btn" class="w-full min-h-[50px] bg-primary text-on-primary rounded-lg font-label-md font-bold hover:bg-on-primary-fixed-variant transition-all shadow-md mt-2 flex items-center justify-center gap-1.5" type="submit">
              <span class="material-symbols-outlined">save</span>
              <span>Save Vitals &amp; Evaluate Triage</span>
            </button>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('close-worker-portal-btn')?.addEventListener('click', () => this.close());
    document.getElementById('worker-refresh-btn')?.addEventListener('click', () => {
      this.loadMetrics();
      this.loadTabContent(this.activeTab);
    });

    document.getElementById('close-record-vitals-btn')?.addEventListener('click', () => {
      document.getElementById('record-vitals-modal')?.classList.add('hidden');
    });

    // Tab buttons
    ['queue', 'registry', 'referrals', 'reminders'].forEach((t) => {
      document.getElementById(`wtab-btn-${t}`)?.addEventListener('click', () => {
        this.switchTab(t);
      });
    });

    // Submit Vitals
    document.getElementById('record-vitals-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const patientId = Number(document.getElementById('vitals-patient-id').value);
      const submitBtn = document.getElementById('submit-vitals-btn');

      const data = {
        patient_id: patientId,
        systolic_bp: document.getElementById('vitals-sys').value ? Number(document.getElementById('vitals-sys').value) : null,
        diastolic_bp: document.getElementById('vitals-dia').value ? Number(document.getElementById('vitals-dia').value) : null,
        blood_glucose: document.getElementById('vitals-sugar').value ? Number(document.getElementById('vitals-sugar').value) : null,
        glucose_type: document.getElementById('vitals-sugar-type').value,
        heart_rate: document.getElementById('vitals-hr').value ? Number(document.getElementById('vitals-hr').value) : null,
        spo2: document.getElementById('vitals-spo2').value ? Number(document.getElementById('vitals-spo2').value) : null,
        temperature_f: document.getElementById('vitals-temp').value ? Number(document.getElementById('vitals-temp').value) : null,
        diagnosis: document.getElementById('vitals-diagnosis').value.trim() || null,
        prescription: document.getElementById('vitals-prescription').value.trim() || null,
        clinical_notes: document.getElementById('vitals-notes').value.trim() || null,
      };

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving & Evaluating...';

        const res = await window.API.healthRecords.create(data);
        window.Toast?.success(`Vitals recorded! Automated Triage: ${res.triage.status.toUpperCase()}`);
        document.getElementById('record-vitals-modal')?.classList.add('hidden');

        this.loadMetrics();
        this.loadTabContent('registry');
      } catch (err) {
        window.Toast?.error(err.message || 'Failed to record vitals');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-symbols-outlined">save</span><span>Save Vitals &amp; Evaluate Triage</span>';
      }
    });
  },

  switchTab(tab) {
    this.activeTab = tab;
    ['queue', 'registry', 'referrals', 'reminders'].forEach((t) => {
      const btn = document.getElementById(`wtab-btn-${t}`);
      if (t === tab) {
        btn?.classList.add('active');
        btn?.classList.remove('text-on-surface-variant');
        btn?.setAttribute('aria-selected', 'true');
      } else {
        btn?.classList.remove('active');
        btn?.classList.add('text-on-surface-variant');
        btn?.setAttribute('aria-selected', 'false');
      }
    });

    this.loadTabContent(tab);
  },

  async loadMetrics() {
    try {
      const [apptsRes, patientsRes, recordsRes, referralsRes] = await Promise.all([
        window.API.appointments.list({ status: 'pending' }),
        window.API.healthRecords.getPatients(),
        window.API.healthRecords.list({ triage_status: 'urgent' }),
        window.API.referrals.list({ status: 'issued' }),
      ]);

      const pendEl = document.getElementById('metric-pending-queue');
      if (pendEl) pendEl.textContent = apptsRes.appointments?.length || 0;

      const patEl = document.getElementById('metric-registered-patients');
      if (patEl) patEl.textContent = patientsRes.patients?.length || 0;

      const urgEl = document.getElementById('metric-high-risk-triage');
      if (urgEl) urgEl.textContent = recordsRes.records?.length || 0;

      const refEl = document.getElementById('metric-active-referrals');
      if (refEl) refEl.textContent = referralsRes.referrals?.length || 0;
    } catch (e) {
      console.error('Error loading metrics', e);
    }
  },

  async loadTabContent(tab) {
    const container = document.getElementById('worker-portal-tab-content');
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-10">
        <span class="material-symbols-outlined animate-spin text-[32px] text-secondary">refresh</span>
        <p class="text-body-md text-on-surface-variant mt-2">Loading data...</p>
      </div>
    `;

    try {
      if (tab === 'queue') {
        await this.renderQueueTab(container);
      } else if (tab === 'registry') {
        await this.renderRegistryTab(container);
      } else if (tab === 'referrals') {
        await this.renderReferralsTab(container);
      } else if (tab === 'reminders') {
        await this.renderRemindersTab(container);
      }
    } catch (err) {
      container.innerHTML = `
        <div class="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
          <p class="text-label-md font-bold text-red-900">${err.message}</p>
        </div>
      `;
    }
  },

  async renderQueueTab(container) {
    const res = await window.API.appointments.list();
    const appts = res.appointments || [];

    if (appts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-2xl">
          <h3 class="text-headline-sm font-bold text-primary">Appointment Queue is Empty</h3>
          <p class="text-body-md text-on-surface-variant mt-1">No pending or confirmed appointments in this jurisdiction.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${appts.map((a) => `
          <div class="p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-primary px-2 py-0.5 rounded bg-surface-container-high text-[14px]">
                  ${a.token_number}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-900' : a.status === 'pending' ? 'bg-amber-100 text-amber-900' : 'bg-surface-container text-on-surface-variant'}">
                  ${a.status}
                </span>
                <span class="px-2 py-0.5 rounded text-[11px] font-bold ${a.priority === 'urgent' ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'} uppercase">
                  ${a.priority}
                </span>
              </div>
              <div class="text-headline-sm font-bold text-primary">${a.patient_name} (${a.patient_village || 'Village'})</div>
              <div class="text-label-sm text-on-surface-variant">Phone: <a href="tel:${a.patient_phone}" class="font-bold underline">${a.patient_phone}</a> • ABHA: ${a.patient_abha || 'Pending'}</div>
              <div class="text-body-md text-on-surface mt-1 bg-surface-container-low p-2 rounded-lg">Reason: ${a.reason}</div>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              ${a.status === 'pending' ? `
                <button onclick="window.WorkerPortal.updateApptStatus(${a.id}, 'confirmed')" class="px-3.5 py-2 bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg text-label-sm font-bold flex items-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-[16px]">check</span> Confirm
                </button>
              ` : ''}

              ${a.status !== 'completed' && a.status !== 'cancelled' ? `
                <button onclick="window.WorkerPortal.updateApptStatus(${a.id}, 'completed')" class="px-3 py-2 bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant rounded-lg text-label-sm font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">task_alt</span> Mark Complete
                </button>
                <button onclick="window.WorkerPortal.updateApptStatus(${a.id}, 'cancelled')" class="px-2.5 py-2 border border-error/50 text-error hover:bg-error hover:text-white rounded-lg text-label-sm font-bold">
                  Reject
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async renderRegistryTab(container) {
    const res = await window.API.healthRecords.getPatients();
    const patients = res.patients || [];

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input id="patient-search-input" class="w-full sm:max-w-xs min-h-[44px] px-3.5 bg-surface rounded-lg border border-outline text-body-md" placeholder="Search patient name, phone, village..." />
          <div class="text-label-sm font-bold text-on-surface-variant">${patients.length} Citizens Enrolled</div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-outline-variant bg-surface-container-lowest">
          <table class="w-full text-left text-body-md">
            <thead class="bg-surface-container-high text-label-sm uppercase font-bold text-on-surface-variant border-b border-outline-variant">
              <tr>
                <th class="p-3.5">Patient Details</th>
                <th class="p-3.5">Village / Mandal</th>
                <th class="p-3.5">Latest Vitals</th>
                <th class="p-3.5">Triage Status</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/50">
              ${patients.map((p) => {
                const triageClass = p.last_triage_status === 'urgent' ? 'bg-error-container text-on-error-container' :
                                   p.last_triage_status === 'followup' ? 'bg-amber-100 text-amber-900' :
                                   'bg-emerald-100 text-emerald-900';
                return `
                  <tr class="hover:bg-surface-container-low transition-colors">
                    <td class="p-3.5">
                      <div class="font-bold text-primary">${p.name}</div>
                      <div class="text-[12px] text-on-surface-variant">${p.gender || '--'}, ${p.age || '--'} yrs • ${p.phone}</div>
                    </td>
                    <td class="p-3.5">
                      <div class="font-medium">${p.village || 'Kalyandurg'}</div>
                      <div class="text-[12px] text-on-surface-variant">${p.mandal}</div>
                    </td>
                    <td class="p-3.5 font-mono text-[13px]">
                      ${p.last_sys_bp && p.last_dia_bp ? `BP: ${p.last_sys_bp}/${p.last_dia_bp}` : 'No vitals recorded'}
                      ${p.last_glucose ? `• BS: ${p.last_glucose}` : ''}
                    </td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${triageClass}">
                        ${p.last_triage_status || 'Unassessed'}
                      </span>
                    </td>
                    <td class="p-3.5 text-right">
                      <button onclick="window.WorkerPortal.openRecordVitalsModal(${p.id}, '${p.name.replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg text-label-sm font-bold hover:bg-on-secondary-fixed-variant transition-colors inline-flex items-center gap-1">
                        <span class="material-symbols-outlined text-[15px]">monitor_heart</span>
                        Record Vitals
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('patient-search-input')?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  },

  async renderReferralsTab(container) {
    const [facilitiesRes, patientsRes] = await Promise.all([
      window.API.facilities.list(),
      window.API.healthRecords.getPatients(),
    ]);

    const facilities = facilitiesRes.facilities || [];
    const patients = patientsRes.patients || [];

    container.innerHTML = `
      <div class="max-w-2xl mx-auto p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <h3 class="text-headline-sm font-bold text-primary mb-1">Issue Hospital Referral Slip</h3>
        <p class="text-body-md text-on-surface-variant mb-4">Transfer patient from sub-centre to CHC or District Hospital under Aarogyasri.</p>

        <form id="issue-referral-form" class="space-y-4">
          <div>
            <label class="block text-label-sm font-bold text-primary mb-1">Select Patient *</label>
            <select id="ref-patient-select" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline" required>
              <option value="">-- Choose Patient --</option>
              ${patients.map((p) => `<option value="${p.id}">${p.name} (${p.village}, Ph: ${p.phone})</option>`).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">From Facility</label>
              <select id="ref-from-facility" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline">
                ${facilities.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">To Destination Facility *</label>
              <select id="ref-to-facility" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline" required>
                ${facilities.map((f) => `<option value="${f.id}">${f.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Priority</label>
              <select id="ref-priority" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline">
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency (Immediate)</option>
              </select>
            </div>
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Transport Required</label>
              <select id="ref-transport" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline">
                <option value="public_transport">Public Transport</option>
                <option value="ambulance_108">108 Ambulance Dispatch</option>
                <option value="self">Self Arrangement</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-label-sm font-bold text-primary mb-1">Clinical Reason for Referral *</label>
            <textarea id="ref-reason" rows="2" class="w-full p-3 bg-surface rounded-lg border border-outline" placeholder="e.g. Uncontrolled hypertension, suspected fetal distress, fracture stabilization" required></textarea>
          </div>

          <button id="submit-referral-btn" class="w-full min-h-[50px] bg-secondary text-on-secondary rounded-lg font-label-md font-bold hover:bg-on-secondary-fixed-variant shadow-md" type="submit">
            Generate &amp; Dispatch Referral Slip
          </button>
        </form>
      </div>
    `;

    document.getElementById('issue-referral-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-referral-btn');
      const data = {
        patient_id: Number(document.getElementById('ref-patient-select').value),
        from_facility_id: Number(document.getElementById('ref-from-facility').value),
        to_facility_id: Number(document.getElementById('ref-to-facility').value),
        priority: document.getElementById('ref-priority').value,
        transport_type: document.getElementById('ref-transport').value,
        transport_required: document.getElementById('ref-transport').value === 'ambulance_108',
        reason: document.getElementById('ref-reason').value.trim(),
        aarogyasri_case: true,
      };

      try {
        submitBtn.disabled = true;
        const res = await window.API.referrals.create(data);
        window.Toast?.success(`Referral slip ${res.referral.referral_code} issued successfully!`);
        this.loadMetrics();
        this.switchTab('queue');
      } catch (err) {
        window.Toast?.error(err.message || 'Failed to issue referral');
      } finally {
        submitBtn.disabled = false;
      }
    });
  },

  async renderRemindersTab(container) {
    const patientsRes = await window.API.healthRecords.getPatients();
    const patients = patientsRes.patients || [];

    container.innerHTML = `
      <div class="max-w-2xl mx-auto p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <h3 class="text-headline-sm font-bold text-primary mb-1">Dispatch Preventive Health Reminder</h3>
        <p class="text-body-md text-on-surface-variant mb-4">Send automated SMS and in-app alert for hypertension, diabetes, or child vaccination checkups.</p>

        <form id="dispatch-reminder-form" class="space-y-4">
          <div>
            <label class="block text-label-sm font-bold text-primary mb-1">Patient *</label>
            <select id="rem-patient-select" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline" required>
              <option value="">-- Choose Patient --</option>
              ${patients.map((p) => `<option value="${p.id}">${p.name} (${p.village}, Ph: ${p.phone})</option>`).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Reminder Category</label>
              <select id="rem-type-select" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline">
                <option value="bp_check">Blood Pressure (BP) Check</option>
                <option value="sugar_check">Fasting Blood Sugar Test</option>
                <option value="immunization">Child Immunization Vaccine</option>
                <option value="maternal_checkup">Antenatal Maternal Camp</option>
                <option value="medication_refill">Prescription Refill</option>
              </select>
            </div>
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Due Date *</label>
              <input id="rem-date-input" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline" type="date" required />
            </div>
          </div>

          <div>
            <label class="block text-label-sm font-bold text-primary mb-1">Title *</label>
            <input id="rem-title-input" class="w-full min-h-[48px] px-3 bg-surface rounded-lg border border-outline" placeholder="e.g. Monthly Blood Pressure Check at Sub-Centre" required />
          </div>

          <div>
            <label class="block text-label-sm font-bold text-primary mb-1">Instructions / Note for Citizen</label>
            <textarea id="rem-notes-input" rows="2" class="w-full p-2.5 bg-surface rounded-lg border border-outline" placeholder="e.g. Please bring ration card and previous BP record book"></textarea>
          </div>

          <button id="submit-reminder-btn" class="w-full min-h-[50px] bg-primary text-on-primary rounded-lg font-label-md font-bold hover:bg-on-primary-fixed-variant shadow-md" type="submit">
            Schedule Reminder &amp; Send SMS
          </button>
        </form>
      </div>
    `;

    document.getElementById('dispatch-reminder-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-reminder-btn');
      const data = {
        patient_id: Number(document.getElementById('rem-patient-select').value),
        reminder_type: document.getElementById('rem-type-select').value,
        title: document.getElementById('rem-title-input').value.trim(),
        due_date: document.getElementById('rem-date-input').value,
        notes: document.getElementById('rem-notes-input').value.trim(),
      };

      try {
        submitBtn.disabled = true;
        await window.API.reminders.create(data);
        window.Toast?.success('Preventive reminder scheduled and SMS dispatched!');
        this.switchTab('queue');
      } catch (err) {
        window.Toast?.error(err.message || 'Failed to dispatch reminder');
      } finally {
        submitBtn.disabled = false;
      }
    });
  },

  openRecordVitalsModal(patientId, patientName) {
    document.getElementById('vitals-patient-id').value = patientId;
    document.getElementById('record-vitals-patient-name').textContent = `Record Vitals: ${patientName}`;
    const modal = document.getElementById('record-vitals-modal');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  },

  async updateApptStatus(apptId, status) {
    try {
      await window.API.appointments.updateStatus(apptId, { status });
      window.Toast?.success(`Appointment marked as ${status.toUpperCase()}`);
      this.loadMetrics();
      this.loadTabContent('queue');
    } catch (err) {
      window.Toast?.error(err.message || 'Status update failed');
    }
  },

  open(defaultTab = 'queue') {
    if (!window.appState.token || window.appState.user?.role !== 'health_worker') {
      window.Toast?.warning('Please sign in with a Healthcare Worker account to access this workspace.');
      window.AuthModals?.openLogin('health_worker');
      return;
    }

    const modal = document.getElementById('worker-portal-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const welcomeEl = document.getElementById('worker-user-welcome');
    if (welcomeEl && window.appState.user) {
      welcomeEl.textContent = `Worker: ${window.appState.user.name} (${window.appState.user.worker_type?.toUpperCase() || 'ASHA'}). Jurisdiction: ${window.appState.user.mandal || 'Kalyandurg'}.`;
    }

    this.loadMetrics();
    this.switchTab(defaultTab);
  },

  close() {
    const modal = document.getElementById('worker-portal-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

window.WorkerPortal = WorkerPortal;

