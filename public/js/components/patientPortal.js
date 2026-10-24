/**
 * Patient / Citizen Portal Component
 */

const PatientPortal = {
  activeTab: 'appointments', // 'appointments', 'records', 'referrals', 'reminders', 'profile'

  init() {
    this.createPortalModal();
  },

  createPortalModal() {
    let container = document.getElementById('patient-portal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'patient-portal-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div id="patient-portal-modal" class="fixed inset-0 z-[120] hidden items-center justify-center p-3 md:p-6 modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="patient-portal-title">
        <div class="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-2xl max-w-4xl w-full p-6 relative max-h-[95vh] flex flex-col overflow-hidden">
          
          <!-- Header -->
          <div class="flex items-start justify-between pb-4 border-b border-outline-variant shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-primary text-secondary-fixed flex items-center justify-center font-bold shadow-md">
                <span class="material-symbols-outlined text-[26px]">person</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 id="patient-portal-title" class="text-headline-sm font-bold text-primary">Patient Health Portal</h2>
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary-container text-on-secondary-container uppercase">Citizen Access</span>
                </div>
                <p id="portal-user-welcome" class="text-label-sm text-on-surface-variant">Manage your consultations, vital records &amp; hospital referrals.</p>
              </div>
            </div>

            <button id="close-patient-portal-btn" class="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Close portal">
              <span class="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex items-center gap-1 border-b border-outline-variant pt-2 overflow-x-auto shrink-0" role="tablist">
            <button id="tab-btn-appointments" class="tab-btn px-4 py-3 text-label-md font-bold transition-all flex items-center gap-1.5 whitespace-nowrap active" role="tab" aria-selected="true">
              <span class="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Appointments</span>
            </button>
            <button id="tab-btn-records" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">medical_information</span>
              <span>Health Records (EHR)</span>
            </button>
            <button id="tab-btn-referrals" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">assignment</span>
              <span>Hospital Referrals</span>
            </button>
            <button id="tab-btn-reminders" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">notifications_active</span>
              <span>Reminders</span>
            </button>
            <button id="tab-btn-profile" class="tab-btn px-4 py-3 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 whitespace-nowrap" role="tab" aria-selected="false">
              <span class="material-symbols-outlined text-[18px]">badge</span>
              <span>Profile &amp; ABHA</span>
            </button>
          </div>

          <!-- Tab Panels Container -->
          <div id="patient-portal-tab-content" class="flex-1 overflow-y-auto py-5 space-y-4">
            <!-- Dynamic Content Injected Here -->
            <div class="text-center py-10">
              <span class="material-symbols-outlined animate-spin text-[32px] text-secondary">refresh</span>
              <p class="text-body-md text-on-surface-variant mt-2">Loading your medical records...</p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pt-4 border-t border-outline-variant flex items-center justify-between shrink-0">
            <button id="portal-book-new-appt-btn" class="min-h-[46px] px-5 bg-secondary text-on-secondary rounded-lg font-label-md font-bold hover:bg-on-secondary-fixed-variant flex items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[18px]">add</span>
              <span>Book New Appointment</span>
            </button>
            <button id="portal-refresh-btn" class="min-h-[46px] px-4 border border-outline-variant rounded-lg font-label-sm font-bold text-on-surface-variant hover:text-primary flex items-center gap-1">
              <span class="material-symbols-outlined text-[18px]">refresh</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('close-patient-portal-btn')?.addEventListener('click', () => this.close());
    document.getElementById('portal-book-new-appt-btn')?.addEventListener('click', () => {
      this.close();
      window.AppointmentModal?.open();
    });
    document.getElementById('portal-refresh-btn')?.addEventListener('click', () => {
      this.loadTabContent(this.activeTab);
    });

    // Tab buttons
    const tabs = ['appointments', 'records', 'referrals', 'reminders', 'profile'];
    tabs.forEach((tab) => {
      document.getElementById(`tab-btn-${tab}`)?.addEventListener('click', () => {
        this.switchTab(tab);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  switchTab(tab) {
    this.activeTab = tab;
    const tabs = ['appointments', 'records', 'referrals', 'reminders', 'profile'];
    tabs.forEach((t) => {
      const btn = document.getElementById(`tab-btn-${t}`);
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

  async loadTabContent(tab) {
    const container = document.getElementById('patient-portal-tab-content');
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-10">
        <span class="material-symbols-outlined animate-spin text-[32px] text-secondary">refresh</span>
        <p class="text-body-md text-on-surface-variant mt-2">Loading details...</p>
      </div>
    `;

    try {
      if (tab === 'appointments') {
        await this.renderAppointmentsTab(container);
      } else if (tab === 'records') {
        await this.renderRecordsTab(container);
      } else if (tab === 'referrals') {
        await this.renderReferralsTab(container);
      } else if (tab === 'reminders') {
        await this.renderRemindersTab(container);
      } else if (tab === 'profile') {
        this.renderProfileTab(container);
      }
    } catch (err) {
      container.innerHTML = `
        <div class="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
          <span class="material-symbols-outlined text-error text-[36px]">error</span>
          <p class="text-label-md font-bold text-red-900 mt-2">${err.message || 'Error loading records'}</p>
          <button onclick="window.PatientPortal.loadTabContent('${tab}')" class="mt-3 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-sm font-bold">Try Again</button>
        </div>
      `;
    }
  },

  async renderAppointmentsTab(container) {
    const res = await window.API.appointments.list();
    const appts = res.appointments || [];

    if (appts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/60">
          <div class="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">event_busy</span>
          </div>
          <h3 class="text-headline-sm font-bold text-primary">No Appointments Scheduled</h3>
          <p class="text-body-md text-on-surface-variant max-w-md mx-auto mt-1 mb-5">You haven't requested any doctor appointments yet.</p>
          <button onclick="window.PatientPortal.close(); window.AppointmentModal.open();" class="min-h-[48px] px-6 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-md font-bold hover:bg-on-secondary-fixed-variant">
            Book an OPD Token
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${appts.map((a) => {
          const statusClass = a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                             a.status === 'pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                             a.status === 'completed' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                             'bg-red-100 text-red-900 border-red-300';
          return `
            <div class="p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
              <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-primary text-[15px] px-2.5 py-0.5 rounded bg-surface-container-high">
                      ${a.token_number || 'Token Pending'}
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${statusClass}">
                      ${a.status}
                    </span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant uppercase">
                      ${a.priority}
                    </span>
                  </div>
                  <h4 class="text-label-lg font-bold text-primary mt-2">${a.facility_name}</h4>
                  <p class="text-label-sm text-on-surface-variant">${a.doctor_name ? `${a.doctor_name} (${a.doctor_specialty || 'General'})` : 'General OPD Medical Officer'}</p>
                </div>

                <div class="text-right">
                  <div class="text-label-md font-bold text-secondary flex items-center gap-1 justify-end">
                    <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                    ${a.appointment_date}
                  </div>
                  <div class="text-label-sm text-on-surface-variant capitalize">${a.time_slot} Slot</div>
                </div>
              </div>

              <div class="p-3 bg-surface-container-low rounded-xl text-body-md text-on-surface mb-3 border border-outline-variant/40">
                <span class="font-bold text-label-sm text-on-surface-variant uppercase block mb-0.5">Reason for Visit:</span>
                ${a.reason}
                ${a.notes ? `<div class="mt-2 text-label-sm text-secondary font-medium border-t border-outline-variant/40 pt-1">Note: ${a.notes}</div>` : ''}
              </div>

              <div class="flex items-center justify-between pt-2">
                <a href="tel:${a.facility_phone || '104'}" class="inline-flex items-center gap-1 text-label-sm font-bold text-secondary hover:underline">
                  <span class="material-symbols-outlined text-[16px]">call</span>
                  Call Facility: ${a.facility_phone || '104'}
                </a>

                ${a.status !== 'cancelled' && a.status !== 'completed' ? `
                  <button onclick="window.PatientPortal.cancelAppointment(${a.id})" class="px-3 py-1.5 border border-error/60 text-error hover:bg-error hover:text-on-error rounded-lg text-label-sm font-bold transition-all">
                    Cancel Token
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  async renderRecordsTab(container) {
    const res = await window.API.healthRecords.list();
    const records = res.records || [];

    if (records.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/60">
          <div class="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">description</span>
          </div>
          <h3 class="text-headline-sm font-bold text-primary">No Clinical Records Found</h3>
          <p class="text-body-md text-on-surface-variant max-w-md mx-auto mt-1">Health records recorded during ASHA home visits or PHC visits will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${records.map((r) => {
          const triagePill = r.triage_status === 'urgent' ? 'bg-error-container text-on-error-container border-error' :
                             r.triage_status === 'followup' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                             'bg-emerald-100 text-emerald-900 border-emerald-300';
          return `
            <div class="p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/60 pb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-label-md font-bold text-primary">${r.record_date}</span>
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase ${triagePill}">
                      Triage: ${r.triage_status}
                    </span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-on-surface-variant uppercase">
                      ${r.visit_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div class="text-label-sm text-on-surface-variant mt-0.5">Recorded by: ${r.worker_name || 'Health Worker'}</div>
                </div>
              </div>

              <!-- Biometric Vitals Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">Blood Pressure</div>
                  <div class="text-headline-sm font-mono font-bold text-primary mt-0.5">
                    ${r.systolic_bp && r.diastolic_bp ? `${r.systolic_bp}/${r.diastolic_bp}` : '--'} 
                    <span class="text-[12px] font-normal text-on-surface-variant">mmHg</span>
                  </div>
                </div>
                <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">Blood Glucose</div>
                  <div class="text-headline-sm font-mono font-bold text-primary mt-0.5">
                    ${r.blood_glucose || '--'} 
                    <span class="text-[12px] font-normal text-on-surface-variant">mg/dL</span>
                  </div>
                </div>
                <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">SpO2 Oxygen</div>
                  <div class="text-headline-sm font-mono font-bold text-primary mt-0.5">
                    ${r.spo2 || '--'} 
                    <span class="text-[12px] font-normal text-on-surface-variant">%</span>
                  </div>
                </div>
                <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">Heart Rate / Pulse</div>
                  <div class="text-headline-sm font-mono font-bold text-primary mt-0.5">
                    ${r.heart_rate || '--'} 
                    <span class="text-[12px] font-normal text-on-surface-variant">bpm</span>
                  </div>
                </div>
              </div>

              <!-- Clinical Notes & Prescription -->
              ${r.diagnosis ? `
                <div class="text-body-md text-primary">
                  <span class="font-bold text-label-sm text-on-surface-variant uppercase block">Diagnosis:</span>
                  ${r.diagnosis}
                </div>
              ` : ''}

              ${r.prescription ? `
                <div class="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 text-body-md">
                  <span class="font-bold text-label-sm text-emerald-800 uppercase block">Prescription / Medication:</span>
                  ${r.prescription}
                </div>
              ` : ''}

              ${r.clinical_notes ? `
                <div class="text-body-md text-on-surface-variant text-[14px]">
                  <span class="font-bold uppercase text-[12px] block">ASHA Worker Notes:</span>
                  ${r.clinical_notes}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  async renderReferralsTab(container) {
    const res = await window.API.referrals.list();
    const referrals = res.referrals || [];

    if (referrals.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/60">
          <div class="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">assignment_turned_in</span>
          </div>
          <h3 class="text-headline-sm font-bold text-primary">No Hospital Referrals</h3>
          <p class="text-body-md text-on-surface-variant max-w-md mx-auto mt-1">Inter-facility transfer slips issued to Community Health Centres or District Hospitals will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${referrals.map((ref) => `
          <div class="p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm space-y-3">
            <div class="flex flex-wrap items-start justify-between gap-2 border-b border-outline-variant/60 pb-3">
              <div>
                <span class="font-mono font-bold text-secondary text-[15px] px-2.5 py-0.5 rounded bg-secondary/10">
                  ${ref.referral_code}
                </span>
                <span class="ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${ref.status === 'accepted' ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900'}">
                  ${ref.status}
                </span>
                <span class="ml-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed uppercase">
                  ${ref.aarogyasri_case ? 'Aarogyasri Covered' : 'General Care'}
                </span>
              </div>
              <div class="text-label-sm font-bold text-error uppercase">
                Priority: ${ref.priority}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-md">
              <div class="p-3 bg-surface-container-low rounded-xl">
                <span class="text-[12px] font-bold text-on-surface-variant uppercase block">From Referring Facility:</span>
                <div class="font-bold text-primary">${ref.from_facility_name}</div>
                <div class="text-[13px] text-on-surface-variant">Referred by: ${ref.worker_name}</div>
              </div>
              <div class="p-3 bg-secondary-fixed/20 rounded-xl border border-secondary/30">
                <span class="text-[12px] font-bold text-secondary uppercase block">To Destination Facility:</span>
                <div class="font-bold text-primary">${ref.to_facility_name}</div>
                <div class="text-[13px] text-on-surface-variant">Phone: ${ref.to_facility_phone || '08554-220033'}</div>
              </div>
            </div>

            <div class="p-3 bg-surface-container-low rounded-xl">
              <span class="text-[12px] font-bold text-on-surface-variant uppercase block">Clinical Reason:</span>
              <p class="text-body-md text-primary mt-0.5">${ref.reason}</p>
              ${ref.clinical_summary ? `<p class="text-label-sm text-on-surface-variant mt-1">Summary: ${ref.clinical_summary}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async renderRemindersTab(container) {
    const res = await window.API.reminders.list();
    const reminders = res.reminders || [];

    if (reminders.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/60">
          <div class="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">notifications_none</span>
          </div>
          <h3 class="text-headline-sm font-bold text-primary">No Pending Reminders</h3>
          <p class="text-body-md text-on-surface-variant max-w-md mx-auto mt-1">Upcoming BP checkups, sugar tests, or child vaccinations will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        ${reminders.map((rem) => `
          <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest flex items-center justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[22px]">alarm</span>
              </div>
              <div>
                <h4 class="text-label-md font-bold text-primary">${rem.title}</h4>
                <div class="text-label-sm text-secondary font-bold flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-[16px]">event</span>
                  Due Date: ${rem.due_date}
                </div>
                ${rem.notes ? `<p class="text-label-sm text-on-surface-variant mt-0.5">${rem.notes}</p>` : ''}
              </div>
            </div>

            <div>
              <span class="px-2.5 py-1 rounded text-label-sm font-bold ${rem.status === 'completed' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}">
                ${rem.status.toUpperCase()}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderProfileTab(container) {
    const user = window.appState.user || {};
    container.innerHTML = `
      <div class="p-6 rounded-2xl border border-outline-variant bg-surface-container-lowest space-y-4">
        <div class="flex items-center gap-4 pb-4 border-b border-outline-variant/60">
          <div class="w-16 h-16 rounded-2xl bg-primary text-secondary-fixed flex items-center justify-center font-bold text-[24px]">
            ${user.name ? user.name[0] : 'U'}
          </div>
          <div>
            <h3 class="text-headline-sm font-bold text-primary">${user.name || 'Citizen User'}</h3>
            <div class="text-label-sm text-on-surface-variant">${user.phone} • ${user.email || 'No email registered'}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-3 bg-surface-container-low rounded-xl">
            <span class="text-[12px] font-bold text-on-surface-variant uppercase block">Ayushman Bharat Health Account (ABHA ID):</span>
            <div class="font-mono font-bold text-secondary text-[16px] mt-1">${user.abha_id || '91-4567-8901-2345 (National ID)'}</div>
          </div>
          <div class="p-3 bg-surface-container-low rounded-xl">
            <span class="text-[12px] font-bold text-on-surface-variant uppercase block">Village &amp; Mandal:</span>
            <div class="font-bold text-primary mt-1">${user.village || 'Brahmasamudram'}, ${user.mandal || 'Kalyandurg'}, ${user.district || 'Ananthapur'}</div>
          </div>
          <div class="p-3 bg-surface-container-low rounded-xl">
            <span class="text-[12px] font-bold text-on-surface-variant uppercase block">Assigned Sub-Centre:</span>
            <div class="font-bold text-primary mt-1">${user.sub_center || 'Kalyandurg Sub-Centre II'}</div>
          </div>
          <div class="p-3 bg-surface-container-low rounded-xl">
            <span class="text-[12px] font-bold text-on-surface-variant uppercase block">Emergency Contact:</span>
            <div class="font-bold text-primary mt-1">${user.emergency_contact || '108 (Ambulance)'}</div>
          </div>
        </div>
      </div>
    `;
  },

  async cancelAppointment(apptId) {
    if (!confirm('Are you sure you want to cancel this appointment token?')) return;
    try {
      await window.API.appointments.cancel(apptId, 'Cancelled from patient portal');
      window.Toast?.success('Appointment token cancelled.');
      this.loadTabContent('appointments');
    } catch (err) {
      window.Toast?.error(err.message || 'Failed to cancel appointment');
    }
  },

  open(defaultTab = 'appointments') {
    if (!window.appState.token) {
      window.Toast?.info('Please sign in to access your Patient Portal.');
      window.AuthModals?.openLogin('patient');
      return;
    }

    const modal = document.getElementById('patient-portal-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const welcomeEl = document.getElementById('portal-user-welcome');
    if (welcomeEl && window.appState.user) {
      welcomeEl.textContent = `Welcome, ${window.appState.user.name}! Connected to ${window.appState.user.sub_center || 'Kalyandurg Sub-Centre'}.`;
    }

    this.switchTab(defaultTab);
  },

  close() {
    const modal = document.getElementById('patient-portal-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

window.PatientPortal = PatientPortal;

