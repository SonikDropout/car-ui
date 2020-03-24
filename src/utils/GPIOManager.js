const { Gpio } = require('pigpio');
const EventEmitter = require('events');
const { INPUT_PIN, OUTPUT_PIN, GROUND_RESISTANCE } = require('../constants');
const { randInt } = require('./numagic');

class GPIOManager extends EventEmitter {
  constructor() {
    super();
    this.rpmInput = new Gpio(INPUT_PIN, { mode: Gpio.INPUT, timeout: 1000, edge: Gpio.FALLING_EDGE });
    this.dmOutput = new Gpio(OUTPUT_PIN, { mode: Gpio.OUTPUT });
    this.dmOutput.hardwarePwmWrite(100000, GROUND_RESISTANCE.low.dutyCycle);
    this.rpsCount = 0;
    this.rpmInput.on('interrupt', this.handleInterrupt.bind(this));
  }

  changeDriveMode(mode) {
    this.dmOutput.hardwarePwmWrite(100000, GROUND_RESISTANCE[mode].dutyCycle);
  }

  countRPM() {
    setInterval(this.readRPS);
    setTimeout(this.emitRPM, 1000);
  }

  handleInterrupt(level) {
    if (level === Gpio.TIMEOUT) {
      this.emit('rpmMeasure', this.rpsCount * 60);
      this.rpsCount = 0;
    } else if (!level) {
      this.rpsCount++;
    }
  }
}

class GPIOMock extends EventEmitter {
  constructor() {
    super();
    this.rpm = 800;
    this.emitMockValue();
  }

  changeResistancePWM(key, dutyCycle) {
    console.log(`Changing ${key} dutyCycle to ${dutyCycle}`);
  }

  emitMockValue() {
    setInterval(() => {
      this.emit('rpmMeasure', this.rpm);
      this.rpm += randInt(-5, 5);
    });
  }

  changeDriveMode(mode) {
    console.log('Chnaging drive mode to:', mode);
  }
}

module.exports = {
  GPIOManager,
  GPIOMock,
};
