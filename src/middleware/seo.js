const { supportedLanguages } = require('../config/i18n');

const SITE_URL = process.env.SITE_URL || 'https://zobtrade.com';

/**
 * SEO middleware - sets up SEO-related data for templates
 */
const seoMiddleware = (req, res, next) => {
  const lang = req.language || 'en';
  const pathWithoutLang = req.pathWithoutLang || '/';

  // Generate hreflang URLs for all supported languages
  const hreflangUrls = supportedLanguages.map(langCode => ({
    lang: langCode,
    url: `${SITE_URL}/${langCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`
  }));

  // Canonical URL for current page
  const canonicalUrl = `${SITE_URL}/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;

  // Base SEO data (can be overridden in controllers)
  res.locals.seo = {
    siteUrl: SITE_URL,
    canonicalUrl,
    hreflangUrls,
    siteName: 'ZobTrade',
    defaultImage: `${SITE_URL}/images/og-image.jpg`,
    twitterHandle: '@zobtrade',
    locale: getLocaleCode(lang)
  };

  // JSON-LD Organization schema
  res.locals.organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZobTrade',
    description: 'Fuel and petroleum products supplier from Georgia serving Central Asia',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GE',
      addressLocality: 'Tbilisi'
    },
    areaServed: [
      { '@type': 'Country', name: 'Uzbekistan' },
      { '@type': 'Country', name: 'Kazakhstan' },
      { '@type': 'Country', name: 'Afghanistan' },
      { '@type': 'Country', name: 'Tajikistan' },
      { '@type': 'Country', name: 'Azerbaijan' },
      { '@type': 'Country', name: 'Turkey' }
    ],
    sameAs: []
  };

  next();
};

// Get proper locale code for Open Graph
const getLocaleCode = (lang) => {
  const localeMap = {
    en: 'en_US',
    ru: 'ru_RU',
    ka: 'ka_GE',
    az: 'az_AZ',
    tr: 'tr_TR',
    kk: 'kk_KZ',
    uz: 'uz_UZ',
    fa: 'fa_AF'
  };
  return localeMap[lang] || 'en_US';
};

module.exports = seoMiddleware;
