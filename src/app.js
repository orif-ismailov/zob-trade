const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');

const i18nConfig = require('./config/i18n');
const i18nMiddleware = require('./middleware/i18n');
const seoMiddleware = require('./middleware/seo');

// Routes
const publicRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration (memory-based - no database required)
app.use(session({
  secret: process.env.SESSION_SECRET || 'zobtrade-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// i18n setup
app.use(i18nConfig.init);
app.use(i18nMiddleware);

// SEO middleware
app.use(seoMiddleware);

// Make common variables available to all views
app.use((req, res, next) => {
  res.locals.currentLang = req.language;
  res.locals.currentPath = req.path;
  res.locals.languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
    { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek' },
    { code: 'fa', name: 'Dari', nativeName: 'دری' }
  ];
  res.locals.__ = res.__;
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    seo: {
      title: 'Page Not Found | ZobTrade',
      description: 'The page you are looking for does not exist.'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
    seo: {
      title: 'Error | ZobTrade',
      description: 'An error occurred.'
    }
  });
});

module.exports = app;
