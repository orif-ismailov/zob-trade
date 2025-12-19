const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, redirectIfAuthenticated, setAdminLocals } = require('../middleware/auth');

// Apply setAdminLocals to all admin routes
router.use(setAdminLocals);

// Login routes
router.get('/login', redirectIfAuthenticated, adminController.loginPage);
router.post('/login', redirectIfAuthenticated, adminController.login);
router.post('/logout', adminController.logout);

// Protected admin routes
router.get('/', requireAuth, adminController.dashboard);
router.get('/content', requireAuth, adminController.contentList);
router.get('/content/:page', requireAuth, adminController.contentEdit);
router.post('/content/:page', requireAuth, adminController.contentSave);
router.get('/translations', requireAuth, adminController.translationsList);
router.get('/translations/:lang', requireAuth, adminController.translationsEdit);
router.post('/translations/:lang', requireAuth, adminController.translationsSave);

module.exports = router;
