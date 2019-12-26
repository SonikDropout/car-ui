const { CAR_PARAMS_SEQUENCE, DIVIDERS } = require("./constants");

function convertDecToBytes(number, bytes = 1) {
  if (bytes == 1) {
    return [number];
  } else if (bytes == 2) {
    return [Math.floor(number / 256) % 256, number % 256];
  }
}

const testData = DIVIDERS.concat([
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
  1
]);

const dataByteLengths = testData.map(n => (n < 256 ? 1 : 2));

const testDataIncrementers = {
  firstCellVoltage: n => n - Math.round(Math.random()),
  batteryCurrent: n => n - Math.floor(Math.random() * 10),
  isAvailableRecharging: n => n,
  isAvailableDischarging: n => n,
  fuelCellVoltage: n => n - 1,
  fuelCellCurrent: n => n - 1,
  fuellCellTemp: n => n + 1,
  fuellCellFan: n => n,
  fuelCellOn: n => n,
  hydrogenConsumption: n => n + Math.round(Math.random() * 2 - 1),
  hydrogenPressure: n => n,
  currentDirection: n => n
};

const carBufferLength = CAR_PARAMS_SEQUENCE.length;

function* generateTestData() {
  while (1) {
    const testCarBuffer = new Uint8Array(carBufferLength);
    let i = 0;
    let j = 0;
    while (i < carBufferLength) {
      if (i < 6) {
        testCarBuffer.set(convertDecToBytes(testData[j++]), i++);
      } else {
        testCarBuffer.set(
          convertDecToBytes(testData[j], dataByteLengths[j]),
          i
        );
        testData[j] = testDataIncrementers[CAR_PARAMS_SEQUENCE[i]](testData[j]);
        i += dataByteLengths[j++];
      }
    }
    yield testCarBuffer.buffer;
  }
}

let interval;

exports.startWritingTestData = function(port) {
  const testDataGenerator = generateTestData();
  interval = setInterval(
    _ => port.writeToComputer(testDataGenerator.next().value),
    1000
  );
};

exports.stopWritingTestData = function() {
  clearInterval(interval);
};
