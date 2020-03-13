const { Gpio, getTick, tickDiff, CLOCK_PCM, configureClock } = require('pigpio');
const EventEmitter = require('events');
const { INPUT_PIN, OUTPUT_PIN, GROUND_RESISTANCE } = require('../constants');
const { writeFile } = require('fs');
const { randInt } = require('./numagic');

const settingsPath = '/home/pi/car-ui/app/settings.json'
const settings = require(settingsPath);

class GPIOManager extends EventEmitter {
  constructor() {
    super();
    configureClock(1, CLOCK_PCM);
    this.rpmInput = new Gpio(INPUT_PIN, { mode: Gpio.INPUT, alert: true });
    this.dmOutput = new Gpio(OUTPUT_PIN, { mode: Gpio.OUTPUT });
    this.dmOutput.pwmFrequency(20000);
    this.dmOutput.pwmWrite(GROUND_RESISTANCE[settings.groundResistance].dutyCycle);
    // this.dmOutput.hardwarePwmWrite(Math.pow(10, 5), GROUND_RESISTANCE[settings.groundResistance].dutyCycle);
    this.rpmCount = 0;
    this.rpsIntervalStart = getTick();
    this.countRPM();
  }

  changeResistancePWM(key, dutyCycle) {
    GROUND_RESISTANCE[key].dutyCycle = dutyCycle;
    this.dmOutput.pwmWrite(dutyCycle);
  } 

  changeDriveMode(mode) {
    this.dmOutput.pwmWrite(GROUND_RESISTANCE[mode].dutyCycle);
    // this.dmOutput.hardwarePwmWrite(Math.pow(10, 5), GROUND_RESISTANCE[mode].dutyCycle);
    settings.groundResistance = mode;
    // writeFile(settingsPath, JSON.stringify(settings), Function.prototype);
  }

  countRPM() {
    this.rpmInput.on('alert', this.handleGPIOAlert.bind(this));
    setInterval(() => this.emit('rpmMeasure', this.rpsCount * 60), 1000);
  }
  
  handleGPIOAlert(level, tick) {
if (!level) {
this.rpsCount++;
if (tickDiff(this.rpsIntervalStart, tick) > 1000000) {
  // this.emit('rpmMeasure', rpsCount * 60);
  this.rpsIntervalStart = tick;
  this.rpsCount = 0;
}
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
    console.log(`Changing ${key} dutyCycle to ${dutyCycle}`)
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
