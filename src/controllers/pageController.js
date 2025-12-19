const { supportedLanguages } = require('../config/i18n');

const SITE_URL = process.env.SITE_URL || 'https://zobtrade.com';

/**
 * Page Controller - handles rendering of public pages
 */

exports.home = (req, res) => {
  res.render('pages/home', {
    page: 'home',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.home.title'),
      description: res.__('seo.home.description'),
      keywords: res.__('seo.home.keywords')
    }
  });
};

exports.about = (req, res) => {
  res.render('pages/about', {
    page: 'about',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.about.title'),
      description: res.__('seo.about.description'),
      keywords: res.__('seo.about.keywords')
    }
  });
};

exports.products = (req, res) => {
  res.render('pages/products', {
    page: 'products',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.products.title'),
      description: res.__('seo.products.description'),
      keywords: res.__('seo.products.keywords')
    }
  });
};

exports.logistics = (req, res) => {
  res.render('pages/logistics', {
    page: 'logistics',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.logistics.title'),
      description: res.__('seo.logistics.description'),
      keywords: res.__('seo.logistics.keywords')
    }
  });
};

exports.compliance = (req, res) => {
  res.render('pages/compliance', {
    page: 'compliance',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.compliance.title'),
      description: res.__('seo.compliance.description'),
      keywords: res.__('seo.compliance.keywords')
    }
  });
};

exports.markets = (req, res) => {
  res.render('pages/markets', {
    page: 'markets',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.markets.title'),
      description: res.__('seo.markets.description'),
      keywords: res.__('seo.markets.keywords')
    }
  });
};

exports.contact = (req, res) => {
  res.render('pages/contact', {
    page: 'contact',
    seo: {
      ...res.locals.seo,
      title: res.__('seo.contact.title'),
      description: res.__('seo.contact.description'),
      keywords: res.__('seo.contact.keywords')
    }
  });
};

// robots.txt
exports.robots = (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
};

// sitemap.xml
exports.sitemap = (req, res) => {
  const pages = ['', 'about', 'products', 'logistics', 'compliance', 'markets', 'contact'];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  pages.forEach(page => {
    supportedLanguages.forEach(lang => {
      const url = `${SITE_URL}/${lang}${page ? '/' + page : ''}`;
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;

      // Add hreflang alternates
      supportedLanguages.forEach(altLang => {
        const altUrl = `${SITE_URL}/${altLang}${page ? '/' + page : ''}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>\n`;
      });

      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
  });

  xml += '</urlset>';

  res.type('application/xml');
  res.send(xml);
};
