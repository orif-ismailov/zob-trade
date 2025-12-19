const { supportedLanguages, defaultLanguage } = require('../config/i18n');

/**
 * i18n middleware - handles language detection from URL prefix
 * URL structure: /:lang/page -> /en/about, /ru/about, etc.
 */
const i18nMiddleware = (req, res, next) => {
  // Extract language from URL path
  const pathParts = req.path.split('/').filter(Boolean);
  const potentialLang = pathParts[0];

  // Check if first path segment is a valid language code
  if (potentialLang && supportedLanguages.includes(potentialLang)) {
    req.language = potentialLang;
    // Store the path without language prefix for routing
    req.pathWithoutLang = '/' + pathParts.slice(1).join('/') || '/';
  } else {
    // No language in URL - redirect to default language
    if (req.path === '/' || !pathParts.length) {
      // Detect from Accept-Language header or use default
      const acceptLanguage = req.get('Accept-Language');
      let detectedLang = defaultLanguage;

      if (acceptLanguage) {
        const preferredLangs = acceptLanguage.split(',').map(lang => {
          const [code] = lang.trim().split(';');
          return code.split('-')[0].toLowerCase();
        });

        detectedLang = preferredLangs.find(lang => supportedLanguages.includes(lang)) || defaultLanguage;
      }

      return res.redirect(301, `/${detectedLang}/`);
    }

    req.language = defaultLanguage;
    req.pathWithoutLang = req.path;
  }

  // Set locale for i18n
  req.setLocale(req.language);
  res.locals.currentLang = req.language;

  // Helper function to generate URLs with language prefix
  res.locals.langUrl = (path) => {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `/${req.language}${cleanPath === '/' ? '' : cleanPath}`;
  };

  // Helper to switch language on current page
  res.locals.switchLangUrl = (lang) => {
    const currentPathWithoutLang = req.pathWithoutLang || '/';
    return `/${lang}${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`;
  };

  next();
};

module.exports = i18nMiddleware;
