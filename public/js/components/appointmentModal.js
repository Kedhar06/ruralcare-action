/**
 * Appointment Booking Modal Component
 */

const AppointmentModal = {
  facilities: [],
  selectedFacilityId: null,

  init() {
    this.createModal();
  },

  createModal() {
    let container = document.getElementById('appointment-modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'appointment-modal-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div id="appointment-modal" class="fixed inset-0 z-[110] hidden items-center justify-center p-4 modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="appt-modal-title">
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl max-w-lg w-full p-6 relative max-h-[92vh] overflow-y-auto">
          <!-- Close button -->
          <button id="close-appt-modal-btn" class="absolute top-4 right-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Close booking dialog">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>

          <!-- Header -->
          <div class="mb-5">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-secondary-container text-on-secondary-container mb-2">
              <span class="material-symbols-outlined text-[16px]">calendar_month</span>
              National Health Mission OPD Booking
            </div>
            <h2 id="appt-modal-title" class="text-headline-sm font-bold text-primary">Book Doctor Appointment</h2>
            <p class="text-body-md text-on-surface-variant mt-1">Get an instant digital OPD token with SMS reminder confirmation.</p>
          </div>

          <!-- Form -->
          <form id="appointment-booking-form" class="space-y-4">
            <!-- Facility Select -->
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="appt-facility-select">
                Healthcare Facility *
              </label>
              <select id="appt-facility-select" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" required>
                <option value="">Loading facilities...</option>
              </select>
            </div>

            <!-- Doctor Select -->
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="appt-doctor-select">
                Specialist / Doctor (Optional)
              </label>
              <select id="appt-doctor-select" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary">
                <option value="">Any Available Medical Officer (General OPD)</option>
              </select>
            </div>

            <!-- Date & Time Slot -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="appt-date-input">
                  Appointment Date *
                </label>
                <input id="appt-date-input" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" type="date" required />
              </div>
              <div>
                <label class="block text-label-sm font-bold text-primary mb-1" for="appt-time-slot">
                  Time Slot *
                </label>
                <select id="appt-time-slot" class="w-full min-h-[50px] px-3.5 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary">
                  <option value="morning">Morning (8:30 AM - 12:30 PM)</option>
                  <option value="afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="evening">Evening Camp (4:30 PM - 7:00 PM)</option>
                </select>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1">Visit Urgency</label>
              <div class="grid grid-cols-3 gap-2">
                <label class="flex items-center gap-2 p-2.5 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-bright">
                  <input type="radio" name="appt-priority" value="routine" checked class="text-secondary focus:ring-secondary" />
                  <span class="text-label-sm font-bold text-primary">Routine</span>
                </label>
                <label class="flex items-center gap-2 p-2.5 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-bright">
                  <input type="radio" name="appt-priority" value="followup" class="text-secondary focus:ring-secondary" />
                  <span class="text-label-sm font-bold text-primary">Follow-up</span>
                </label>
                <label class="flex items-center gap-2 p-2.5 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-bright">
                  <input type="radio" name="appt-priority" value="urgent" class="text-error focus:ring-error" />
                  <span class="text-label-sm font-bold text-error">Urgent</span>
                </label>
              </div>
            </div>

            <!-- Reason -->
            <div>
              <label class="block text-label-sm font-bold text-primary mb-1" for="appt-reason">
                Reason for Visit / Symptoms *
              </label>
              <textarea id="appt-reason" rows="3" class="w-full px-3.5 py-2 bg-surface text-on-surface rounded-lg border border-outline text-body-md focus:ring-2 focus:ring-secondary" placeholder="Describe symptoms (e.g. fever for 2 days, monthly BP review, antenatal checkup)" required></textarea>
            </div>

            <!-- Submit Button -->
            <button id="submit-appt-btn" class="w-full min-h-[52px] bg-secondary text-on-secondary rounded-lg font-label-lg font-bold hover:bg-on-secondary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2" type="submit">
              <span class="material-symbols-outlined">event_available</span>
              <span>Confirm &amp; Generate OPD Token</span>
            </button>
          </form>

          <!-- Confirmation Card (Hidden initially) -->
          <div id="appt-confirmation-card" class="hidden text-center py-4 space-y-4">
            <div class="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto shadow-md">
              <span class="material-symbols-outlined text-[36px] fill-icon">check_circle</span>
            </div>
            <div>
              <h3 class="text-headline-sm font-bold text-primary">Appointment Confirmed!</h3>
              <p class="text-body-md text-on-surface-variant mt-1">Your OPD token has been generated and sent via SMS.</p>
            </div>

            <div class="bg-surface-container-low rounded-xl p-4 border border-outline-variant text-left space-y-2">
              <div class="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                <span class="text-label-sm text-on-surface-variant">Token Number:</span>
                <span id="confirm-token-badge" class="px-2.5 py-1 rounded bg-secondary text-on-secondary font-mono font-bold text-[16px]"></span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-label-sm text-on-surface-variant">Facility:</span>
                <span id="confirm-facility-name" class="text-label-md font-bold text-primary"></span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-label-sm text-on-surface-variant">Date &amp; Slot:</span>
                <span id="confirm-date-slot" class="text-label-md font-bold text-primary"></span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-label-sm text-on-surface-variant">Status:</span>
                <span id="confirm-status-badge" class="px-2 py-0.5 rounded text-label-sm font-bold bg-tertiary-fixed text-on-tertiary-fixed">Confirmed</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button id="view-my-appts-btn" class="flex-1 min-h-[48px] bg-primary text-on-primary rounded-lg font-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors" type="button">
                View in My Appointments
              </button>
              <button id="done-appt-modal-btn" class="min-h-[48px] px-5 border border-outline-variant rounded-lg font-label-md font-bold text-primary hover:bg-surface-container" type="button">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.loadFacilities();
  },

  async loadFacilities() {
    try {
      const res = await window.API.facilities.list();
      this.facilities = res.facilities || [];
      const select = document.getElementById('appt-facility-select');
      if (!select) return;

      select.innerHTML = '<option value="">-- Choose Facility --</option>' + 
        this.facilities.map((f) => `<option value="${f.id}">${f.name} (${f.mandal})</option>`).join('');

      if (this.selectedFacilityId) {
        select.value = this.selectedFacilityId;
        this.loadDoctorsForFacility(this.selectedFacilityId);
      }
    } catch (e) {
      console.error('Failed to load facilities', e);
    }
  },

  async loadDoctorsForFacility(facilityId) {
    const docSelect = document.getElementById('appt-doctor-select');
    if (!docSelect) return;

    if (!facilityId) {
      docSelect.innerHTML = '<option value="">Any Available Medical Officer (General OPD)</option>';
      return;
    }

    try {
      const res = await window.API.doctors.list({ facility_id: facilityId });
      const docs = res.doctors || [];
      docSelect.innerHTML = '<option value="">Any Available Medical Officer (General OPD)</option>' +
        docs.map((d) => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('');
    } catch (e) {
      console.error('Failed to load doctors', e);
    }
  },

  bindEvents() {
    document.getElementById('close-appt-modal-btn')?.addEventListener('click', () => this.close());
    document.getElementById('done-appt-modal-btn')?.addEventListener('click', () => this.close());

    document.getElementById('view-my-appts-btn')?.addEventListener('click', () => {
      this.close();
      window.PatientPortal?.open('appointments');
    });

    // Facility change -> load doctors
    document.getElementById('appt-facility-select')?.addEventListener('change', (e) => {
      this.loadDoctorsForFacility(e.target.value);
    });

    // Submit appointment
    document.getElementById('appointment-booking-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!window.appState.token) {
        window.Toast?.info('Please sign in or use a demo account to confirm appointment booking.');
        window.AuthModals?.openLogin('patient');
        return;
      }

      const submitBtn = document.getElementById('submit-appt-btn');
      const form = document.getElementById('appointment-booking-form');
      const confirmationCard = document.getElementById('appt-confirmation-card');

      const data = {
        facility_id: Number(document.getElementById('appt-facility-select').value),
        doctor_id: document.getElementById('appt-doctor-select').value ? Number(document.getElementById('appt-doctor-select').value) : null,
        appointment_date: document.getElementById('appt-date-input').value,
        time_slot: document.getElementById('appt-time-slot').value,
        reason: document.getElementById('appt-reason').value.trim(),
        priority: document.querySelector('input[name="appt-priority"]:checked')?.value || 'routine',
      };

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">refresh</span> Booking Token...';

        const res = await window.API.appointments.create(data);
        const appt = res.appointment;

        form.classList.add('hidden');
        confirmationCard.classList.remove('hidden');

        document.getElementById('confirm-token-badge').textContent = appt.token_number;
        document.getElementById('confirm-facility-name').textContent = appt.facility_name;
        document.getElementById('confirm-date-slot').textContent = `${appt.appointment_date} (${appt.time_slot.toUpperCase()})`;
        document.getElementById('confirm-status-badge').textContent = appt.status.toUpperCase();

        window.Toast?.success(`Token ${appt.token_number} generated!`);
      } catch (err) {
        window.Toast?.error(err.message || 'Failed to book appointment.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-symbols-outlined">event_available</span><span>Confirm &amp; Generate OPD Token</span>';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(facilityId = null) {
    this.selectedFacilityId = facilityId;
    const modal = document.getElementById('appointment-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Reset view
    document.getElementById('appointment-booking-form')?.classList.remove('hidden');
    document.getElementById('appt-confirmation-card')?.classList.add('hidden');

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('appt-date-input');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    if (facilityId) {
      const select = document.getElementById('appt-facility-select');
      if (select) {
        select.value = facilityId;
        this.loadDoctorsForFacility(facilityId);
      }
    }
  },

  close() {
    const modal = document.getElementById('appointment-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

window.AppointmentModal = AppointmentModal;

