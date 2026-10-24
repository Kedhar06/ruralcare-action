/**
 * Notifications Slide-Over Drawer Component
 */

const NotificationsDrawer = {
  init() {
    this.createDrawer();
    this.pollNotifications();
  },

  createDrawer() {
    let container = document.getElementById('notifications-drawer-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notifications-drawer-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div id="notifications-backdrop" class="fixed inset-0 z-[140] hidden bg-primary/40 backdrop-blur-sm transition-opacity">
        <div id="notifications-panel" class="absolute top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-2xl border-l border-outline-variant flex flex-col transform transition-transform duration-300 translate-x-full">
          
          <!-- Header -->
          <div class="p-5 border-b border-outline-variant flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[24px] text-primary">notifications</span>
              <h3 class="text-headline-sm font-bold text-primary">Notifications</h3>
            </div>
            <div class="flex items-center gap-2">
              <button id="mark-all-read-btn" class="text-label-sm font-bold text-secondary hover:underline">
                Mark All Read
              </button>
              <button id="close-notifications-btn" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Notification List -->
          <div id="notifications-list" class="flex-1 overflow-y-auto p-4 space-y-3">
            <div class="text-center py-10 text-on-surface-variant">Loading notifications...</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('close-notifications-btn')?.addEventListener('click', () => this.close());
    document.getElementById('notifications-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'notifications-backdrop') this.close();
    });

    document.getElementById('mark-all-read-btn')?.addEventListener('click', async () => {
      try {
        await window.API.notifications.markAllRead();
        window.appState.setUnreadNotifications(0);
        this.loadNotifications();
      } catch (e) {
        console.error(e);
      }
    });
  },

  async loadNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;

    if (!window.appState.token) {
      list.innerHTML = `
        <div class="text-center py-12 text-on-surface-variant">
          <p>Please sign in to view notifications.</p>
        </div>
      `;
      return;
    }

    try {
      const res = await window.API.notifications.list();
      const notifs = res.notifications || [];
      window.appState.setUnreadNotifications(res.unreadCount || 0);

      if (notifs.length === 0) {
        list.innerHTML = `
          <div class="text-center py-12 text-on-surface-variant">
            <span class="material-symbols-outlined text-[36px]">notifications_none</span>
            <p class="mt-2 text-label-md">No notifications yet.</p>
          </div>
        `;
        return;
      }

      list.innerHTML = notifs.map((n) => `
        <div onclick="window.NotificationsDrawer.handleNotificationClick(${n.id}, '${n.link || ''}')" class="p-3.5 rounded-xl border ${n.is_read ? 'border-outline-variant/60 bg-surface-container-low opacity-80' : 'border-secondary/40 bg-secondary/5'} cursor-pointer hover:shadow-sm transition-all space-y-1">
          <div class="flex items-center justify-between">
            <h4 class="text-label-md font-bold text-primary">${n.title}</h4>
            <span class="text-[11px] text-on-surface-variant">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p class="text-body-md text-on-surface text-[14px] leading-snug">${n.message}</p>
        </div>
      `).join('');

    } catch (err) {
      list.innerHTML = `<div class="p-3 text-error text-center">${err.message}</div>`;
    }
  },

  async handleNotificationClick(id, link) {
    try {
      await window.API.notifications.markRead(id);
    } catch (e) {
      console.error(e);
    }

    this.close();

    if (link === '#appointments') {
      if (window.appState.user?.role === 'health_worker') {
        window.WorkerPortal?.open('queue');
      } else {
        window.PatientPortal?.open('appointments');
      }
    } else if (link === '#records') {
      window.PatientPortal?.open('records');
    } else if (link === '#referrals') {
      window.PatientPortal?.open('referrals');
    }
  },

  pollNotifications() {
    if (window.appState.token) {
      this.loadNotifications();
    }
    setInterval(() => {
      if (window.appState.token) {
        this.loadNotifications();
      }
    }, 30000); // 30s poll
  },

  open() {
    const backdrop = document.getElementById('notifications-backdrop');
    const panel = document.getElementById('notifications-panel');
    if (!backdrop || !panel) return;

    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      panel.classList.remove('translate-x-full');
    });

    this.loadNotifications();
  },

  close() {
    const backdrop = document.getElementById('notifications-backdrop');
    const panel = document.getElementById('notifications-panel');
    if (!backdrop || !panel) return;

    panel.classList.add('translate-x-full');
    setTimeout(() => {
      backdrop.classList.add('hidden');
    }, 300);
  }
};

window.NotificationsDrawer = NotificationsDrawer;

