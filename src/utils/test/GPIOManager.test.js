const GPIOManager = require('../GPIOManager');
const { Gpio } = require('pigpio');

test('Counts rpm correctly', (done) => {
  const gpioManager = new GPIOManager();
  gpioManager.rpmInput.mode(Gpio.OUTPUT);
  gpioManager.rpmInput.trigger(10, 1);
  const cb = (rpm) => {
    expect(rpm).toBe(100);
    done();
  };
  gpioManager.on('rpmMeasure', cb);
});
