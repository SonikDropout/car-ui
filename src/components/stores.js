const { writable, derived } = require('svelte/store');
const { groundResistance } = require('../../app/settings.json');
const {
  BATTERY_CHARACTERISTICS,
  FUEL_CELL_CHARACTERISTICS,
  STORED_VALUES,
  CAR_CHARACTERISTICS,
} = require('../constants');
const { ipcRenderer } = require('electron');
const graphPoints = require('../utils/graphDataStorage');

const initialState = ipcRenderer.sendSync('getAppState');

const driveMode = writable(groundResistance || 'medium');

const carData = writable(CAR_CHARACTERISTICS);

const rpm = writable(0);

const fuelCellData = derived(carData, ($carData) =>
  getArrayOfValues($carData, Object.keys(FUEL_CELL_CHARACTERISTICS))
);

const batteryData = derived(carData, ($carData) =>
  getArrayOfValues($carData, Object.keys(BATTERY_CHARACTERISTICS))
);

let timeStart;

const lastGraphPoints = derived(carData, ($carData) =>
  STORED_VALUES.map((valName) =>
    $carData[valName]
      ? $carData[valName].value
      : (Date.now() - timeStart) / 1000
  )
);

lastGraphPoints.subscribe((newPoints) => graphPoints.add(newPoints));

function getArrayOfValues(source, keys) {
  return keys.map((key) => source[key]);
}

const notNegative = (v) => (v < 0 ? 0 : v);

const batteryCharge = derived(carData, ($carData) => {
  const voltage = $carData.batteryVoltage,
    current = $carData.batteryCurrent;
  if (!voltage.value) return 0;
  if ($carData.batteryMode.value) {
    return notNegative(
      Math.round(
        (voltage.value * voltage.divider +
          current.value * current.divider * 0.05) *
          0.0333 -
          200
      )
    );
  } else {
    return notNegative(
      Math.round(voltage.value * voltage.divider * 0.0333 - 200)
    );
  }
});

const btConnected = writable(initialState.btConnected);

const usbPath = writable(initialState.usbPath);

const appError = writable();

ipcRenderer.on('btConnected', () => {
  timeStart = Date.now();
  btConnected.set(true);
  appError.set(void 0);
});
ipcRenderer.on('btDisconnected', () => {
  btConnected.set(false);
  appError.set({ title: 'Соединение потеряно', message: 'Пожалуйста, перезагрузите машинку' });
  timeStart = 0;
});
ipcRenderer.on('btData', (e, data) => {
  if (!timeStart) timeStart = Date.now();
  carData.set(data);
});
ipcRenderer.on('usbConnected', (e, path) => usbPath.set(path));
ipcRenderer.on('usbDisconnected', () => usbPath.set(''));
ipcRenderer.on('rpmMeasure', (e, val) => rpm.set(val));
ipcRenderer.on('error', (e, err) => appError.set(err));

driveMode.subscribe((newMode) => ipcRenderer.send('driveModeChange', newMode));

module.exports = {
  driveMode,
  carData,
  rpm,
  batteryData,
  fuelCellData,
  batteryCharge,
  lastGraphPoints,
  appError,
  usbPath,
  btConnected,
  graphPoints,
};
