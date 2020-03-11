const path = require('path');
const url = require('url');
const electron = require('electron');
const USBDetector = require('./utils/USBManager');
const Logger = require('./utils/Logger');
const DataGenerator = require('./utils/DataGenerator');
const EventEmitter = require('events');
const { randInt } = require('./utils/numagic');
const { isPi } = require('./constants');
const { app, BrowserWindow, ipcMain } = electron;

let win,
  bt,
  logger,
  usb,
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
  initLogger();
  if (isPi) initRpiPeripherals();
  else mockPeripherals();
  addPeripheralsListeners();
}

function initLogger() {
  logger = new Logger();
}

function removeListeners() {
  if (bt) bt.removeAllListeners();
  if (usb) usb.removeAllListeners();
  if (gpio) gpio.removeAllListeners();
}

function initRpiPeripherals() {
  usb = new USBDetector();
  const BluetoothConnector = require('./utils/BluetoothConnector');
  const { GPIOManager, GPIOMock } = require('./utils/GPIOManager');
  bt = new BluetoothConnector();
  try {
    gpio = new GPIOManager();
  } catch (err) {
    gpio = new GPIOMock();
  }
}

function mockPeripherals() {
  usb = new USBDetector();
  bt = new DataGenerator();
  bt.once('data', bt.emit.bind(bt, 'connected'));
  gpio = new EventEmitter();
  gpio.changeDriveMode = dm => console.log('New drive mode:', dm);
  let rpmVal = 800;
  setInterval(() => {
    rpmVal += randInt(-5, 5);
    gpio.emit('rpmMeasure', rpmVal);
  }, 100);
}

function listenRenderer() {
  ipcMain.on('getAppState', e => (e.returnValue = state));
  ipcMain.on('driveModeChange', (e, dm) => gpio.changeDriveMode(dm));
  ipcMain.on('saveLog', (e, rows) => {
    logger.saveLog(rows, state.usbPath, err => {
      if (err) e.sender.send('saveError', err);
      else e.sender.send('logSaved');
    });
  });
  ipcMain.on('reload', () => {
    if (win) win.reload();
    bt.startScanning();
  });
}

function addPeripheralsListeners() {
  bt.on('connected', () => {
    win.webContents.send('btConnected');
    state.btConnected = true;
  })
    .on('disconnected', () => {
      win.webContents.send('btDisconnected');
      state.btConnected = false;
    })
    .on('data', data => win.webContents.send('btData', data))
    .on('error', error => win.webContents.send('error', error));
  gpio.on('rmpMesure', rpm => win.webContents.send('rpmMeasure', rpm));
  usb
    .on('connect', path => {
      win.webContents.send('usbConnected', path);
      state.usbPath = path;
    })
    .on('remove', path => {
      win.webContents.send('usbDisconnected', path);
      state.usbPath = void 0;
    });
}

function launch() {
  const screenArea = electron.screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: isPi ? screenArea.width : 1024,
    height: isPi ? screenArea.height : 600,
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
