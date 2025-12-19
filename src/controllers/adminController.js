const bcrypt = require('bcrypt');
const { getOne, getMany, query } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

/**
 * Admin Controller - handles admin panel functionality
 */

// Login page
exports.loginPage = (req, res) => {
  res.render('admin/login', {
    layout: false,
    error: null
  });
};

// Handle login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get admin from database
    const admin = await getOne('SELECT * FROM admins WHERE username = $1', [username]);

    if (!admin) {
      return res.render('admin/login', {
        layout: false,
        error: 'Invalid username or password'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.render('admin/login', {
        layout: false,
        error: 'Invalid username or password'
      });
    }

    // Set session
    req.session.admin = {
      id: admin.id,
      username: admin.username
    };

    // Redirect to original URL or dashboard
    const returnTo = req.session.returnTo || '/admin';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/login', {
      layout: false,
      error: 'An error occurred. Please try again.'
    });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/admin/login');
  });
};

// Dashboard
exports.dashboard = async (req, res) => {
  res.render('admin/dashboard', {
    layout: 'layouts/admin',
    title: 'Dashboard',
    page: 'dashboard'
  });
};

// Content list
exports.contentList = async (req, res) => {
  const pages = [
    { id: 'home', name: 'Home Page' },
    { id: 'about', name: 'About Us' },
    { id: 'products', name: 'Products' },
    { id: 'logistics', name: 'Logistics' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'markets', name: 'Markets' },
    { id: 'contact', name: 'Contact' }
  ];

  res.render('admin/content-list', {
    layout: 'layouts/admin',
    title: 'Content Management',
    page: 'content',
    pages
  });
};

// Content edit page
exports.contentEdit = async (req, res) => {
  const { page } = req.params;

  try {
    const contents = await getMany(
      `SELECT c.*, t.language, t.value
       FROM contents c
       LEFT JOIN translations t ON c.id = t.content_id
       WHERE c.page = $1
       ORDER BY c.section, c.content_key`,
      [page]
    );

    res.render('admin/content-edit', {
      layout: 'layouts/admin',
      title: `Edit: ${page}`,
      page: 'content',
      pageName: page,
      contents
    });
  } catch (error) {
    console.error('Content edit error:', error);
    res.redirect('/admin/content');
  }
};

// Save content
exports.contentSave = async (req, res) => {
  const { page } = req.params;
  const { contents } = req.body;

  try {
    // Update each content item
    for (const [key, translations] of Object.entries(contents || {})) {
      for (const [lang, value] of Object.entries(translations)) {
        await query(
          `INSERT INTO translations (content_id, language, value)
           VALUES ((SELECT id FROM contents WHERE page = $1 AND content_key = $2), $3, $4)
           ON CONFLICT (content_id, language)
           DO UPDATE SET value = $4, updated_at = NOW()`,
          [page, key, lang, value]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Content save error:', error);
    res.status(500).json({ success: false, error: 'Failed to save content' });
  }
};

// Translations list
exports.translationsList = async (req, res) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'ka', name: 'Georgian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'tr', name: 'Turkish' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'uz', name: 'Uzbek' },
    { code: 'fa', name: 'Dari' }
  ];

  res.render('admin/translations-list', {
    layout: 'layouts/admin',
    title: 'Translations',
    page: 'translations',
    languages
  });
};

// Translations edit
exports.translationsEdit = async (req, res) => {
  const { lang } = req.params;
  const localesPath = path.join(__dirname, '../../locales', `${lang}.json`);

  try {
    const content = await fs.readFile(localesPath, 'utf8');
    const translations = JSON.parse(content);

    res.render('admin/translations-edit', {
      layout: 'layouts/admin',
      title: `Edit Translations: ${lang.toUpperCase()}`,
      page: 'translations',
      lang,
      translations
    });
  } catch (error) {
    console.error('Translations edit error:', error);
    res.redirect('/admin/translations');
  }
};

// Save translations
exports.translationsSave = async (req, res) => {
  const { lang } = req.params;
  const { translations } = req.body;
  const localesPath = path.join(__dirname, '../../locales', `${lang}.json`);

  try {
    await fs.writeFile(localesPath, JSON.stringify(translations, null, 2), 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Translations save error:', error);
    res.status(500).json({ success: false, error: 'Failed to save translations' });
  }
};
