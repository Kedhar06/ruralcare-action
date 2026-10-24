/**
 * Privacy-preserving, sanitized structured logger.
 * Never logs passwords, authentication tokens, or raw medical details.
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'authorization',
  'jwt',
  'secret',
  'cookie',
  'prescription',
  'clinical_notes',
  'diagnosis'
]);

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitize(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

const logger = {
  info: (msg, data = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, Object.keys(data).length ? sanitize(data) : '');
  },
  warn: (msg, data = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, Object.keys(data).length ? sanitize(data) : '');
  },
  error: (msg, err = {}) => {
    const errorDetails = err instanceof Error ? { message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined } : err;
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, sanitize(errorDetails));
  },
  audit: (userId, action, resourceType, resourceId) => {
    console.log(`[AUDIT] ${new Date().toISOString()} - User:${userId || 'anonymous'} performed ${action} on ${resourceType}:${resourceId || 'all'}`);
  }
};

module.exports = logger;

