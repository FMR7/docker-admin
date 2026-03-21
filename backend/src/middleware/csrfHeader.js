const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

function csrfHeader(req, res, next) {
  if (!unsafeMethods.includes(req.method)) {
    return next();
  }

  const csrfToken = req.header('x-csrf-token');
  if (!csrfToken) {
    return res.status(403).json({ ok: false, message: 'Missing CSRF token' });
  }

  if (!req.user || !req.user.csrfToken) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  if (csrfToken !== req.user.csrfToken) {
    return res.status(403).json({ ok: false, message: 'Invalid CSRF token' });
  }

  next();
}

module.exports = csrfHeader;
