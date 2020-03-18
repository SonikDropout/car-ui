const { Gpio } = require('pigpio');
const EventEmitter = require('events');
const { INPUT_PIN, OUTPUT_PIN, GROUND_RESISTANCE } = require('../constants');
const { randInt } = require('./numagic');

class GPIOManager extends EventEmitter {
  constructor() {
    super();
    this.rpmInput = new Gpio(INPUT_PIN, { mode: Gpio.INPUT });
    this.dmOutput = new Gpio(OUTPUT_PIN, { mode: Gpio.OUTPUT });
    this.dmOutput.hardwarePwmWrite(100000, GROUND_RESISTANCE.medium.dutyCycle);
    this.rpsCount = 0;
    this.level = 0;
    this.rpsIntervalStart = Date.now();
    this.emitRPM = this.emitRPM.bind(this);
    this.readRPS = this.readRPS.bind(this);
    this.countRPM();
  }

  changeDriveMode(mode) {
    this.dmOutput.hardwarePwmWrite(GROUND_RESISTANCE[mode].dutyCycle);
  }

  countRPM() {
    setInterval(this.readRPS);
    setTimeout(this.emitRPM, 1000);
  }

  readRPS() {
    let level = this.rpmInput.digitalRead();
    if (level != this.level) {
      this.rpsCount++;
      this.level = level;
    }
  }

  emitRPM() {
    this.emit('rpmMeasure', this.rpsCount * 30);
    this.rpsCount = 0;
    setTimeout(this.emitRPM, 1000);
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
