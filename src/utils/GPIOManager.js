const { Gpio, getTick, tickDiff } = require('pigpio');
const EventEmitter = require('events');
const { INPUT_PIN, OUTPUT_PIN, GROUND_RESISTANCE } = require('../constants');
const { writeFile } = require('fs');
const { randInt } = require('./numagic');

const settingsPath = '../../settings.json'
const settings = require(settingsPath);

class GPIOManager extends EventEmitter {
  constructor() {
    super();
    this.rpmInput = new Gpio(INPUT_PIN, { mode: Gpio.INPUT, alert: true });
    this.dmOutput = new Gpio(OUTPUT_PIN, { mode: Gpio.OUTPUT });
    this.dmOutput.hardwarePwmWrite(Math.pow(10, 5), GROUND_RESISTANCE[settings.groundResistance].dutyCycle);
    this.countRPM();
  }

  changeDriveMode(mode) {
    this.dmOutput.hardwarePwmWrite(Math.pow(10, 5), GROUND_RESISTANCE[mode].dutyCycle);
    settings.groundResistance = mode;
    writeFile(settingsPath, JSON.stringify(settings), Function.prototype);
  }

  countRPM() {
    let intervalStart = getTick();
    let rpsCount = 0;
    this.rpmInput.on('alert', (level, tick) => {
      if (!level) {
        rpsCount++;
        if (tickDiff(intervalStart, tick) > 1000) {
          this.emit('rpmMeasure', rpsCount * 60);
          intervalStart = tick;
          rpsCount = 0;
        }
      }
    });
  }
}

class GPIOMock extends EventEmitter {
  constructor() {
    super();
    this.rpm = 800;
    this.emitMockValue();
  }

  emitMockValue() {
    setInterval(() => {
      this.emit('rpmMeasure', this.rpm);
      this.rpm += randInt(-5, 5);
    });
  }

  changeDriveMode(mode) {
    console.log('Chnaging drive mode to:', mode);
    settings.groundResistance = mode;
    writeFile(settingsPath, JSON.stringify(settings), () => {});
  }
}

module.exports = {
  GPIOManager,
  GPIOMock,
};
