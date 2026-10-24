/**
 * Healthcare Facility Finder Component (Accessible Search, Filters, Real-Time List)
 */

const FacilityFinder = {
  currentType: 'all',
  searchQuery: 'Kalyandurg',
  debounceTimer: null,

  init() {
    this.bindEvents();
    this.searchFacilities();
  },

  bindEvents() {
    const searchInput = document.getElementById('facility-search-input');
    const searchForm = document.getElementById('facility-search-form');

    searchInput?.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.searchQuery = e.target.value;
      this.debounceTimer = setTimeout(() => this.searchFacilities(), 300);
    });

    searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.searchFacilities();
    });

    // Filter Chips
    const chips = document.querySelectorAll('.facility-filter-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => {
          c.className = 'facility-filter-chip px-4 py-2 bg-surface hover:bg-surface-container text-on-surface rounded-full text-label-sm font-semibold border border-outline-variant shrink-0 transition-colors';
        });
        chip.className = 'facility-filter-chip px-4 py-2 bg-primary text-on-primary rounded-full text-label-sm font-bold flex items-center gap-1.5 shrink-0 shadow-sm';

        this.currentType = chip.getAttribute('data-type');
        this.searchFacilities();
      });
    });
  },

  async searchFacilities() {
    const grid = document.getElementById('facility-cards-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <span class="material-symbols-outlined animate-spin text-[32px] text-secondary">refresh</span>
        <p class="text-body-md text-on-surface-variant mt-2">Searching nearby rural healthcare facilities...</p>
      </div>
    `;

    try {
      const params = {};
      if (this.currentType && this.currentType !== 'all') params.type = this.currentType;
      if (this.searchQuery) params.search = this.searchQuery;

      const res = await window.API.facilities.list(params);
      const facilities = res.facilities || [];

      if (facilities.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant">
            <span class="material-symbols-outlined text-[36px] text-on-surface-variant">search_off</span>
            <h3 class="text-headline-sm font-bold text-primary mt-2">No Facilities Found</h3>
            <p class="text-body-md text-on-surface-variant mt-1">Try broadening your search term or selecting "All Types".</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = facilities.map((f) => {
        const isEmergency = f.emergency_24x7 === 1;
        const statusBadge = isEmergency 
          ? `<span class="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-bold flex items-center gap-1">
               <span class="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
               24/7 Emergency Open
             </span>`
          : `<span class="px-2.5 py-1 rounded bg-surface-container-high text-primary text-label-sm font-bold">
               OPD: ${f.opd_hours}
             </span>`;

        return `
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-2 mb-3">
                ${statusBadge}
                <span class="text-label-sm text-secondary font-bold flex items-center gap-1 shrink-0">
                  <span class="material-symbols-outlined text-[16px]">near_me</span>
                  ${f.distance_km} km away
                </span>
              </div>

              <h3 class="text-headline-sm font-bold text-primary">${f.name}</h3>
              <p class="text-[13px] text-secondary font-medium">${f.name_te || ''}</p>
              <p class="text-label-sm text-on-surface-variant mt-1">${f.address}</p>

              <!-- Clinical Details -->
              <div class="mt-4 space-y-2 border-t border-b border-outline-variant/60 py-3 text-body-md">
                <div class="flex items-center justify-between">
                  <span class="text-on-surface-variant">Doctors on Duty:</span>
                  <span class="font-bold text-primary">${f.doctors_count} Medical Officers</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-on-surface-variant">Bed Capacity:</span>
                  <span class="font-bold text-primary">${f.beds_count} Beds (${f.maternity_beds} Maternity)</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-on-surface-variant">Aarogyasri Scheme:</span>
                  <span class="font-bold text-secondary">${f.aarogyasri_covered ? 'Verified &amp; Covered' : 'Government Primary'}</span>
                </div>
              </div>
            </div>

            <div class="pt-4 flex items-center gap-3">
              <button onclick="window.AppointmentModal.open(${f.id})" class="flex-1 min-h-[48px] px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label-md font-bold hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-1" type="button">
                <span>Request Appointment</span>
              </button>
              <a href="tel:${f.phone}" class="min-h-[48px] w-12 rounded-lg border border-outline flex items-center justify-center text-primary hover:bg-surface-container transition-colors" title="Call ${f.name}">
                <span class="material-symbols-outlined">call</span>
              </a>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      grid.innerHTML = `
        <div class="col-span-full p-4 bg-red-50 text-red-900 rounded-xl text-center">
          Failed to load facilities: ${err.message}
        </div>
      `;
    }
  }
};

window.FacilityFinder = FacilityFinder;

