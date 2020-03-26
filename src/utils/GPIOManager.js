const { Gpio } = require('pigpio');
const EventEmitter = require('events');
const { INPUT_PIN, OUTPUT_PIN, GROUND_RESISTANCE } = require('../constants');
const { randInt } = require('./numagic');

class GPIOManager extends EventEmitter {
  constructor() {
    super();
    this.rpmInput = new Gpio(INPUT_PIN, { mode: Gpio.INPUT, alert: true });
    this.dmOutput = new Gpio(OUTPUT_PIN, { mode: Gpio.OUTPUT });
    this.dmOutput.hardwarePwmWrite(100000, GROUND_RESISTANCE.low.dutyCycle);
    this.rpsCount = 0;
    this.intervalStart = Date.now();
    this.rpmInput.on('alert', this.handleAlert.bind(this));
  }

  changeDriveMode(mode) {
    this.dmOutput.hardwarePwmWrite(100000, GROUND_RESISTANCE[mode].dutyCycle);
  }

  handleAlert(level) {
    if (level) {
      this.rpsCount++;
    }
    const now = Date.now();
    if (now - this.intervalStart > 1000) {
      this.emit('rpmMeasure', this.rpsCount * 60);
      this.rpsCount = 0;
      this.intervalStart = now;
    }
  }
}

module.exports = GPIOManager;
