const { writable, derived } = require('svelte/store');
const {
  BATTERY_CHARACTERISTICS,
  FUEL_CELL_CHARACTERISTICS,
  STORED_VALUES,
  CAR_CHARACTERISTICS,
  isPi,
  __,
} = require('../constants');
const { ipcRenderer } = require('electron');

const initialState = ipcRenderer.sendSync('getAppState');

const driveMode = writable('low');

const carData = writable(CAR_CHARACTERISTICS);

const rpm = writable(0);

const fuelCellData = derived(carData, ($carData) =>
  getValuesByKeys($carData, Object.keys(FUEL_CELL_CHARACTERISTICS))
);

const batteryData = derived(carData, ($carData) =>
  getValuesByKeys($carData, Object.keys(BATTERY_CHARACTERISTICS))
);

let timeStart;

const lastGraphPoints = derived(carData, ($carData) =>
  STORED_VALUES.map((valName) =>
    $carData[valName]
      ? $carData[valName].value
      : timeStart++
  )
);

function getValuesByKeys(source, keys) {
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

const btConnected = writable(isPi ? initialState.btConnected : true);

const usbConnected = writable(!!initialState.usbPath);

const appError = writable();

ipcRenderer.on('btConnected', () => {
  btConnected.set(true);
  appError.set(void 0);
});
ipcRenderer.on('btDisconnected', () => {
  timeStart = 0;
  btConnected.set(false);
  appError.set({
    title: __('connection lost'),
    message: __('try reconnecting'),
  });
});
ipcRenderer.on('btData', (e, data) => {
  carData.set(data);
});
ipcRenderer.on('usbConnected', () => usbConnected.set(true));
ipcRenderer.on('usbDisconnected', () => usbConnected.set(false));
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
  usbConnected,
  btConnected,
  selectedXId: writable(0),
  selectedYId: writable(0),
  selectedBlockId: writable(1),
};
