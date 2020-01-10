const { startWritingTestData, stopWritingTestData } = require('./modules/test');
const SerialPort = require('virtual-serialport');
const fs = require('fs');
const Loader = require('./pages/loader/loader');
const Table = require('./pages/table/table');
const ErrPage = require('./pages/error/error');
const Form = require('./pages/form/form');
const appSettings = require('./settings.json');

class App {
  constructor(options) {
    this.root = options.root;
    this.settings = options.settings;
    this.portID = options.portID;
    this.initialize();
  }

  initialize() {
    this.currentPage = new Loader({
      parent: this.root,
    });
    this.openTestConnection();
  }

  openTestConnection() {
    this.port = new SerialPort(this.portID, { baudrate: 115200 });
    this.port.on('open', (err) => {
      if (err) {
        this.showErrorPage();
      } else {
        this.showDataPage();
      }
    });
  }

  showDataPage() {
    if (process.env.NODE_ENV === 'development') {
      startWritingTestData(this.port);
    }
    this.currentPage = new Table({
      parent: this.root,
      port: this.port,
      groundType: this.settings.groundType,
      onGroundTypeChange: this.saveGroundType.bind(this)
    });
  }

  saveGroundType(type) {
    this.settings.groundType = type;
    fs.writeFile('./settings.json', JSON.stringify(this.settings), Function.prototype);
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
