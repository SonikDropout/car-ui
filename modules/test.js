const carBuffer = require('./dataModel');

function convertDecToBytes(number, bytes = 1) {
  if (bytes == 1) {
    return [number];
  } else if (bytes == 2) {
    return [Math.floor(number / 256) % 256, number % 256];
  }
}

const testData = carBuffer.separators.concat([
  3128,
  10261,
  0,
  0,
  1553,
  5147,
  357,
  95,
  0,
  1443,
  2000,
  1,
]);

const dataByteLengths = testData.map((n) => (n < 256 ? 1 : 2));

function incrementTestData() {
  for (let i = carBuffer.separators.length; i < testData.length - carBuffer.separators.length; i++) {
    testData[i] = testDataIncrementers[i](testData[i]);
  }
}

const testDataIncrementers = [
  (n) => n - Math.round(Math.random()),
  (n) => n - Math.floor(Math.random() * 10),
  (n) => n,
  (n) => n,
  (n) => n - 1,
  (n) => n - 1,
  (n) => n + 1,
  (n) => n,
  (n) => n,
  (n) => n + Math.round(Math.random() * 2 - 1),
  (n) => n,
  (n) => n,
];

function* generateTestData() {
  while (1) {
    const testCarBuffer = new Uint8Array(carBuffer.length);
    let i = 0;
    let j = 0;
    while (i < carBuffer.length) {
      if (i < 6) {
        testCarBuffer.set(convertDecToBytes(testData[j++]), i++);
      } else {
        testCarBuffer.set(
          convertDecToBytes(testData[j], dataByteLengths[j]),
          i
        );
        i += dataByteLengths[j++];
      }
    }
    incrementTestData();
    yield testCarBuffer.buffer;
  }
}

let interval;

exports.startWritingTestData = function(port) {
  const testDataGenerator = generateTestData();
  interval = setInterval(
    (_) => port.writeToComputer(testDataGenerator.next().value),
    1000
  );
};

exports.stopWritingTestData = function() {
  clearInterval(interval);
};
