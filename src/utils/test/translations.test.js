const translator = require('../translations');

test('translates string correctly', () => {
  expect(translator.t('loading')).toBe('Установка соединения...');
})

test('change language works', () => {
  translator.changeLocale('en');
  expect(translator.t('loading')).toBe('Establishing connection...');
  const settings = require('../../../settings.json');
  expect(settings.locale).toBe('en');
})