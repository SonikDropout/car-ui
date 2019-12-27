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
      } else if (this.settings.groundType) {
        this.showTablePage();
      } else {
        this.showFormPage();
      }
    });
  }

  showTablePage() {
    startWritingTestData(this.port);
    this.currentPage = new Table({
      parent: this.root,
      port: this.port,
    });
  }

  showFormPage() {
    stopWritingTestData();
    this.currentPage = new Form({
      parent: this.root,
      onNext: this.showTablePage.bind(this),
      settings: this.settings,
    });
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
