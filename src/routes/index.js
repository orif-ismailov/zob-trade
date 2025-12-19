const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Language prefix routes - all public pages
// /:lang/ -> home
router.get('/:lang/', pageController.home);
router.get('/:lang/about', pageController.about);
router.get('/:lang/products', pageController.products);
router.get('/:lang/logistics', pageController.logistics);
router.get('/:lang/compliance', pageController.compliance);
router.get('/:lang/markets', pageController.markets);
router.get('/:lang/contact', pageController.contact);

// SEO files
router.get('/robots.txt', pageController.robots);
router.get('/sitemap.xml', pageController.sitemap);

module.exports = router;
