const {
  Gpio,
  getTick,
  tickDiff,
  CLOCK_PCM,
  configureClock,
} = require('pigpio');
const EventEmitter = require('events');
const { INPUT_PIN, OUTPUT_PIN, GROUND_RESISTANCE } = require('../constants');
const { writeFile } = require('fs');
const { randInt } = require('./numagic');

const settingsPath = '/home/pi/car-ui/app/settings.json';
const settings = require(settingsPath);

class GPIOManager extends EventEmitter {
  constructor() {
    super();
    configureClock(1, CLOCK_PCM);
    this.rpmInput = new Gpio(INPUT_PIN, { mode: Gpio.INPUT, alert: true });
    this.dmOutput = new Gpio(OUTPUT_PIN, { mode: Gpio.OUTPUT });
    this.dmOutput.pwmFrequency(20000);
    this.dmOutput.pwmWrite(
      GROUND_RESISTANCE.medium.dutyCycle
    );
    this.rpsCount = 0;
    this.rpsIntervalStart = Date.now();
    this.countRPM();
  }

  changeResistancePWM(key, dutyCycle) {
    GROUND_RESISTANCE[key].dutyCycle = dutyCycle;
    this.dmOutput.pwmWrite(dutyCycle);
  }

  changeDriveMode(mode) {
    this.dmOutput.pwmWrite(GROUND_RESISTANCE[mode].dutyCycle);
    settings.groundResistance = mode;
  }

  countRPM() {
    this.rpmInput.on('alert', this.handleGPIOAlert.bind(this));
    setTimeout(this.emitRPM, 1000);
  }

  emitRPM() {
    this.emit('rpmMeasure', this.rpsCount * 60);
    this.rpsCount = 0;
    setTimeout(this.emitRPM, 1000);
  }

  handleGPIOAlert(level) {
    if (!level) this.rpsCount++;
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
    settings.groundResistance = mode;
    writeFile(settingsPath, JSON.stringify(settings), () => {});
  }
}

module.exports = {
  GPIOManager,
  GPIOMock,
};
