const { scaleLinear } = require('../numagic');

test('scales correctly', () => {
  expect(scaleLinear([3, 10], [0, 14])(3)).toBe(0);
});

test('inverts scale correctly', () => {
  expect(scaleLinear([10, 20], [0, 100]).invert(0)).toBe(10);
});
