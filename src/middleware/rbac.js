/**
 * Server-side Role-Based Access Control (RBAC) middleware.
 * Enforces least-privilege security. Never trusts client-supplied roles.
 */

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. This action requires ${allowedRoles.join(' or ')} privileges.`,
      });
    }

    next();
  };
}

function requireWorkerType(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== 'health_worker') {
      return res.status(403).json({
        success: false,
        error: 'Access restricted to authorized Healthcare Personnel.',
      });
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(req.user.worker_type)) {
      return res.status(403).json({
        success: false,
        error: `Action restricted to healthcare workers of type: ${allowedTypes.join(', ')}.`,
      });
    }

    next();
  };
}

module.exports = {
  requireRole,
  requireWorkerType,
};

