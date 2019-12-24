const SerialPort = require("virtual-serialport");

const standPort = new SerialPort("COM1", { baudrate: 115200 });
const carPort = new SerialPort("COM3", { baudrate: 115200 });

const testData = new Uint8Array([
  161,
  178,
  195,
  195,
  212,
  247,
  12,
  56,
  40,
  21,
  0,
  0,
  6,
  17,
  20,
  27,
  1,
  65,
  95,
  5,
  163,
  7,
  163,
  1
]);

standPort.write(testData);

exports.testPort = carPort;
exports.testData = testData;
