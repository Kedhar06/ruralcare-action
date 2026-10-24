/**
 * Global Reactive State Store for RuralCare Action
 */

class AppState {
  constructor() {
    this.listeners = new Map();

    this.token = localStorage.getItem('ruralcare_token') || null;
    this.user = null;
    try {
      const storedUser = localStorage.getItem('ruralcare_user');
      if (storedUser) this.user = JSON.parse(storedUser);
    } catch (e) {
      this.user = null;
    }

    this.lang = localStorage.getItem('ruralcare_lang') || 'en';
    this.fontScale = localStorage.getItem('ruralcare_font_scale') || 'default';
    this.highContrast = localStorage.getItem('ruralcare_contrast') === 'true';
    this.unreadNotifications = 0;
    this.selectedFacility = null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('ruralcare_token', token);
    } else {
      localStorage.removeItem('ruralcare_token');
    }
    this.notify('token', token);
  }

  setUser(user) {
    this.user = user;
    if (user) {
      localStorage.setItem('ruralcare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ruralcare_user');
    }
    this.notify('user', user);
  }

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('ruralcare_lang', lang);
    this.notify('lang', lang);
  }

  setFontScale(scale) {
    this.fontScale = scale;
    localStorage.setItem('ruralcare_font_scale', scale);
    this.applyFontScale();
    this.notify('fontScale', scale);
  }

  setHighContrast(enabled) {
    this.highContrast = enabled;
    localStorage.setItem('ruralcare_contrast', String(enabled));
    this.applyHighContrast();
    this.notify('highContrast', enabled);
  }

  setUnreadNotifications(count) {
    this.unreadNotifications = count;
    this.notify('unreadNotifications', count);
  }

  setSelectedFacility(facility) {
    this.selectedFacility = facility;
    this.notify('selectedFacility', facility);
  }

  applyFontScale() {
    const root = document.documentElement;
    root.classList.remove('font-scale-lg', 'font-scale-xl');
    if (this.fontScale === 'lg') root.classList.add('font-scale-lg');
    if (this.fontScale === 'xl') root.classList.add('font-scale-xl');
  }

  applyHighContrast() {
    const root = document.documentElement;
    if (this.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    return () => {
      const arr = this.listeners.get(key) || [];
      this.listeners.set(key, arr.filter((cb) => cb !== callback));
    };
  }

  notify(key, value) {
    const arr = this.listeners.get(key) || [];
    for (const cb of arr) {
      try {
        cb(value);
      } catch (e) {
        console.error('State listener error', e);
      }
    }
  }

  logout() {
    this.setToken(null);
    this.setUser(null);
    this.setUnreadNotifications(0);
    this.notify('auth_logout', true);
  }
}

window.appState = new AppState();
// Apply initial visual settings
window.appState.applyFontScale();
window.appState.applyHighContrast();

