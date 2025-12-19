const i18n = require('i18n');
const path = require('path');

const supportedLanguages = ['en', 'ru', 'ka', 'az', 'tr', 'kk', 'uz', 'fa'];
const defaultLanguage = 'en';

i18n.configure({
  locales: supportedLanguages,
  defaultLocale: defaultLanguage,
  directory: path.join(__dirname, '../../locales'),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
  autoReload: process.env.NODE_ENV === 'development',
  cookie: 'lang',
  queryParameter: 'lang',
  header: 'accept-language',
  register: global
});

module.exports = {
  init: i18n.init,
  supportedLanguages,
  defaultLanguage,
  i18n
};
