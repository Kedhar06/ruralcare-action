/**
 * Health Resources & Information Guides Component (Bilingual English & Telugu)
 */

const ResourcesModal = {
  currentCategory: 'all',
  resources: [],

  init() {
    this.createModal();
  },

  createModal() {
    let container = document.getElementById('resources-modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'resources-modal-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div id="resources-modal" class="fixed inset-0 z-[115] hidden items-center justify-center p-3 md:p-6 modal-backdrop" role="dialog" aria-modal="true">
        <div class="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-2xl max-w-4xl w-full p-6 relative max-h-[92vh] flex flex-col overflow-hidden">
          
          <div class="flex items-start justify-between pb-4 border-b border-outline-variant shrink-0">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-secondary-container text-on-secondary-container mb-1.5">
                <span class="material-symbols-outlined text-[16px]">menu_book</span>
                National Health Mission Educational Guides
              </div>
              <h2 class="text-headline-sm font-bold text-primary">Healthcare Information &amp; Schemes</h2>
              <p class="text-body-md text-on-surface-variant">Verified guidelines in English &amp; తెలుగు for rural families and village elders.</p>
            </div>
            <button id="close-resources-modal-btn" class="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <!-- Category Filter Bar -->
          <div class="flex items-center gap-2 py-3 border-b border-outline-variant overflow-x-auto shrink-0">
            <button class="res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-primary text-on-primary transition-all shadow-sm" data-cat="all">All Topics</button>
            <button class="res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-surface hover:bg-surface-container text-on-surface border border-outline-variant transition-colors" data-cat="chronic">Chronic Diseases (BP/Sugar)</button>
            <button class="res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-surface hover:bg-surface-container text-on-surface border border-outline-variant transition-colors" data-cat="maternal">Maternal &amp; Child</button>
            <button class="res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-surface hover:bg-surface-container text-on-surface border border-outline-variant transition-colors" data-cat="schemes">Aarogyasri Schemes</button>
            <button class="res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-surface hover:bg-surface-container text-on-surface border border-outline-variant transition-colors" data-cat="seasonal">Monsoon &amp; Dengue</button>
          </div>

          <!-- Resources List Grid -->
          <div id="resources-list-grid" class="flex-1 overflow-y-auto py-5 space-y-4">
            <div class="text-center py-10">
              <span class="material-symbols-outlined animate-spin text-[32px] text-secondary">refresh</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('close-resources-modal-btn')?.addEventListener('click', () => this.close());

    const catButtons = document.querySelectorAll('.res-cat-btn');
    catButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        catButtons.forEach((b) => {
          b.className = 'res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-surface hover:bg-surface-container text-on-surface border border-outline-variant transition-colors';
        });
        btn.className = 'res-cat-btn px-4 py-2 rounded-full text-label-sm font-bold bg-primary text-on-primary transition-all shadow-sm';
        this.currentCategory = btn.getAttribute('data-cat');
        this.renderResources();
      });
    });
  },

  async loadResources() {
    try {
      const res = await window.API.resources.list();
      this.resources = res.resources || [];
      this.renderResources();
    } catch (e) {
      console.error(e);
    }
  },

  renderResources() {
    const grid = document.getElementById('resources-list-grid');
    if (!grid) return;

    const isTe = window.appState.lang === 'te';
    const filtered = this.resources.filter((r) => this.currentCategory === 'all' || r.category === this.currentCategory);

    grid.innerHTML = filtered.map((r) => `
      <div class="p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm space-y-2.5">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[28px]">${r.icon || 'menu_book'}</span>
          </div>
          <div class="flex-1">
            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary/10 text-secondary uppercase">${r.category}</span>
            <h3 class="text-headline-sm font-bold text-primary mt-1">
              ${isTe ? r.title_te : r.title_en}
            </h3>
            <p class="text-body-md text-on-surface-variant font-medium mt-0.5">
              ${isTe ? r.summary_te : r.summary_en}
            </p>
          </div>
        </div>

        <div class="p-4 bg-surface-container-low rounded-xl text-body-md text-on-surface leading-relaxed border border-outline-variant/40">
          ${isTe ? r.content_te : r.content_en}
        </div>
      </div>
    `).join('');
  },

  open(category = 'all') {
    this.currentCategory = category;
    const modal = document.getElementById('resources-modal');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
    this.loadResources();
  },

  close() {
    const modal = document.getElementById('resources-modal');
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
  }
};

window.ResourcesModal = ResourcesModal;

