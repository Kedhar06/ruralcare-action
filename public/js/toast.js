/**
 * Accessible Toast Notification System (WCAG 2.2 AA compliant)
 */

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      this.container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 transform transition-all duration-300 translate-y-2 opacity-0 text-label-md font-label-md ${this.getTypeStyles(type)}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined shrink-0 text-[22px]';
    icon.textContent = this.getIcon(type);

    const text = document.createElement('div');
    text.className = 'flex-1 leading-snug';
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity';
    closeBtn.setAttribute('aria-label', 'Dismiss notification');
    closeBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">close</span>';
    closeBtn.onclick = () => this.dismiss(toast);

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(closeBtn);
    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
  },

  dismiss(toast) {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  },

  success(msg, duration) { this.show(msg, 'success', duration); },
  error(msg, duration = 6000) { this.show(msg, 'error', duration); },
  warning(msg, duration = 5000) { this.show(msg, 'warning', duration); },
  info(msg, duration) { this.show(msg, 'info', duration); },

  getTypeStyles(type) {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-950 border-emerald-300';
      case 'error':
        return 'bg-red-50 text-red-950 border-red-300';
      case 'warning':
        return 'bg-amber-50 text-amber-950 border-amber-300';
      default:
        return 'bg-sky-50 text-sky-950 border-sky-300';
    }
  },

  getIcon(type) {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
};

window.Toast = Toast;

