/**
 * Admin authentication middleware
 */

const requireAuth = (req, res, next) => {
  if (req.session && req.session.admin) {
    res.locals.admin = req.session.admin;
    return next();
  }

  // Store the original URL to redirect back after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return res.redirect('/admin');
  }
  next();
};

// Make admin available in templates if logged in
const setAdminLocals = (req, res, next) => {
  if (req.session && req.session.admin) {
    res.locals.admin = req.session.admin;
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated,
  setAdminLocals
};
