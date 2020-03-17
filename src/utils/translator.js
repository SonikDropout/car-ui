const fs = require('fs')

module.exports = {
  dictionary: {},
  _locale: 'ru',
  setLocale(locale) {
    this._locale = locale;
  },
  loadJSON(path, locale) {
    this.dictionary[locale] = JSON.parse(fs.readFileSync(path));
  },
  __(key) {
    return this.dictionary[this._locale][key] || key;
  },
};
