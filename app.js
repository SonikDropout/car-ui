const { startWritingTestData, stopWritingTestData } = require('./modules/test');
const BluetoothConnection = require('./modules/bluetoothConnection');
const convertData = require('./modules/dataModel').makeHashMap;
const fs = require('fs');
const Loader = require('./pages/loader/loader');
const Info = require('./pages/info/info');
const ErrPage = require('./pages/error/error');
const appSettings = require('./settings.json');
const Gpio = require('pigpio-mock').Gpio;

const GPIO_PIN = 4;

class App {
  constructor(options) {
    this.root = options.root;
    this.settings = options.settings;
    this.portID = options.portID;
    this.gpio = new Gpio(GPIO_PIN, { mode: Gpio.OUTPUT });
    this.initialize();
  }

  initialize() {
    this.currentPage = new Loader({
      parent: this.root,
    });
    this.openBluetoothConnection();
  }

  openBluetoothConnection() {
    this.port = new BluetoothConnection({
      onError: this.showErrorPage,
      onData: this.handlebluetoothData,
    });
  }

  handlebluetoothData(data) {
    document.dispatchEvent(new CustomEvent('bluetoothData', { detal: convertData(data) }));
  }

  showDataPage() {
    if (process.env.NODE_ENV === 'development') {
      startWritingTestData(this.port);
    }
    this.currentPage = new Info({
      parent: this.root,
      driveMode: this.settings.driveMode,
      onDriveModeChange: this.selectDriveMode.bind(this),
    });
  }

  selectDriveMode(mode) {
    const [modeName, dutyCycle] = mode.split(';');
    this.updateSettingsDriveMode(modeName);
    this.changePWMDutyCycle(dutyCycle);
  }

  changePWMDutyCycle(dutyCycle) {
    this.gpio.pwmWrite(dutyCycle);
  }

  updateSettingsDriveMode(mode) {
    this.settings.driveMode = mode;
    fs.writeFile(
      './settings.json',
      JSON.stringify(this.settings),
      Function.prototype
    );
  }

  showErrorPage() {
    this.currentPage = new ErrPage({
      parent: this.root,
      onNext: this.initialize,
    });
  }
}

const app = new App({
  root: document.getElementById('content'),
  settings: appSettings,
  portID: 'COM1',
});
