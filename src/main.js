const path = require('path');
const url = require('url');
const electron = require('electron');
const usb = require('./utils/USBManager');
const Logger = require('./utils/Logger');
const { isPi } = require('./constants');
const { app, BrowserWindow, ipcMain } = electron;

let win,
  bt,
  logger,
  gpio,
  state = {};

const mode = process.env.NODE_ENV;

function reloadOnChange(win) {
  if (mode !== 'development' && mode !== 'test') return { close: () => {} };

  const watcher = require('chokidar').watch(path.join(__dirname, '**'), {
    ignoreInitial: true,
  });

  watcher.on('change', () => {
    win.reload();
    initPeripherals();
  });

  return watcher;
}

function initPeripherals() {
  removeListeners();
  initCommon();
  if (isPi) initRpiPeripherals();
  else mockPeripherals();
  addPeripheralsListeners();
}

function initCommon() {
  logger = new Logger();
  usb.init();
}

function removeListeners() {
  if (bt) bt.removeAllListeners();
  if (gpio) gpio.removeAllListeners();
  usb.removeAllListeners();
}

function initRpiPeripherals() {
  const BluetoothConnector = require('./utils/BluetoothConnector');
  const GPIOManager = require('./utils/GPIOManager');
  bt = new BluetoothConnector();
  gpio = new GPIOManager();
}

function mockPeripherals() {
  const DataGenerator = require('./utils/DataGenerator');
  bt = new DataGenerator();
  const GPIOMock = require('./utils/GPIO.mock');
  gpio = new GPIOMock();
}

function listenRenderer() {
  ipcMain.on('getAppState', e => (e.returnValue = state));
  ipcMain.on('driveModeChange', (e, dm) => gpio.changeDriveMode(dm));
  ipcMain.on('changeResistancePWM', (e, key, dutyCycle) =>
    gpio.changeResistancePWM(key, dutyCycle)
  );
  ipcMain.on('excelRow', (e, row) => logger.writeRow(row));
  ipcMain.on('saveLog', (e) => {
    logger.saveLog(state.usbPath, err => {
      if (err) e.sender.send('saveError', err);
      else e.sender.send('logSaved');
    });
  });
  ipcMain.on('reload', () => {
    if (win) win.reload();
    bt.startScanning();
  });
  ipcMain.on('ejectUSB', usb.eject);
}

function addPeripheralsListeners() {
  listenBtConnect();
  bt.on('disconnected', () => {
    win.webContents.send('btDisconnected');
    state.btConnected = false;
    listenBtConnect();
  })
    .on('data', data => win.webContents.send('btData', data))
    .on('error', error => win.webContents.send('error', error));
  gpio.on('rpmMeasure', rpm => win.webContents.send('rpmMeasure', rpm));
  usb
    .on('add', path => {
      win.webContents.send('usbConnected');
      state.usbPath = path;
    })
    .on('remove', () => {
      win.webContents.send('usbDisconnected');
      state.usbPath = void 0;
    });
}

function listenBtConnect() {
  bt.once('data', () => {
    win.webContents.send('btConnected');
    state.btConnected = true;
  });
}

function launch() {
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    fullscreen: isPi,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '..', 'app', 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  initPeripherals();
  listenRenderer();

  const watcher = reloadOnChange(win);

  win.on('closed', function() {
    bt.removeAllListeners();
    usb.removeAllListeners();
    gpio.removeAllListeners();
    win = null;
    watcher.close();
  });
}

app.on('ready', launch);
