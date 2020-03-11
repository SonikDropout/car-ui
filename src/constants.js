const CONNECTION_TIMEOUT = 30000;

const SEPARATORS = Buffer.from([161, 178, 195, 195, 212, 247]);

const SERVICE_UUID = 'ffe0';
const CHARACTERISTIC_UUID = 'ffe1';

const OUTPUT_PIN = 2;
const INPUT_PIN = 3;

const HYDROGEN_CRITICAL_PRESSURE = 0.3;

const BATTERY_CHARACTERISTICS = {
  batteryVoltage: {
    label: 'Напряжение',
    units: 'В',
    type: 'numeric',
    icon: 'volts',
    bytes: 2,
    offset: 6,
    divider: 1000,
  },
  batteryCurrent: {
    label: 'Ток',
    units: 'А',
    type: 'numeric',
    icon: 'amps',
    bytes: 2,
    offset: 8,
    divider: 1000,
  },
  batteryMode: {
    label: 'Режим работы',
    type: 'textFlag',
    bytes: 1,
    offset: 24,
    posText: 'заряд',
    negText: 'разряд',
  },
  rechargingAvailable: {
    label: 'Возможность заряда',
    type: 'semaphorFlag',
    bytes: 1,
    offset: 10,
  },
  dischargingAvailable: {
    label: 'Возможность разряда',
    type: 'semaphorFlag',
    bytes: 1,
    offset: 11,
  },
};

const FUEL_CELL_CHARACTERISTICS = {
  fuelCellMode: {
    label: 'Состояние',
    type: 'textFlag',
    bytes: 1,
    offset: 19,
    posText: 'вкл',
    negText: 'выкл',
  },
  fuelCellVoltage: {
    label: 'Напряжение',
    units: 'В',
    type: 'numeric',
    icon: 'volts',
    bytes: 2,
    offset: 12,
    divider: 1000,
  },
  fuelCellCurrent: {
    label: 'Ток',
    units: 'А',
    type: 'numeric',
    icon: 'amps',
    bytes: 2,
    divider: 1000,
    offset: 14,
  },
  fuelCellTemp: {
    label: 'Температура',
    units: '\u2103',
    type: 'numeric',
    icon: 'heat',
    bytes: 2,
    offset: 16,
    divider: 10,
  },
  fuelCellFan: {
    label: 'Мощность вентилятора от макс',
    units: '%',
    type: 'numeric',
    icon: 'fan',
    bytes: 1,
    offset: 18,
  },
  hydrogenConsumption: {
    label: 'Расход водорода',
    units: 'мл/мин',
    type: 'numeric',
    icon: 'hydrogen',
    bytes: 2,
    offset: 20,
  },
  hydrogenPressure: {
    label: 'Давление водорода',
    units: 'атм',
    type: 'restricted',
    bytes: 2,
    offset: 22,
    divider: 1000,
    criticalValue: HYDROGEN_CRITICAL_PRESSURE,
    warningMessage: 'Пожалуйста, замените балончик!',
  },
};

const CAR_CHARACTERISTICS = Object.assign(
  {},
  BATTERY_CHARACTERISTICS,
  FUEL_CELL_CHARACTERISTICS,
  {
    recuperation: {
      label: 'Рекуперация',
      type: 'textFlag',
      bytes: 1,
      offset: 25,
      posText: 'есть',
      negText: 'нет',
    },
  }
);

const BUFFER_LENGTH = Object.values(CAR_CHARACTERISTICS).reduce(
  (sum, ch) => sum + ch.bytes,
  0
);

const STORED_VALUES = [
  'time',
  'batteryVoltage',
  'batteryCurrent',
  'fuelCellVoltage',
  'fuelCellCurrent',
  'fuelCellTemp',
  'fuelCellFan',
  'hydrogenConsumption',
];

STORED_VALUES.numOfBatteryValues = 2;

const GROUND_RESISTANCE = {
  low: { dutyCycle: 255, label: 'Низкое' },
  medium: { dutyCycle: 200, label: 'Среднее' },
  high: { dutyCycle: 100, label: 'Высокое' },
  veryHigh: { dutyCycle: 150, label: 'Очень высокое' },
};

const isPi = process.platform === 'linux' && process.arch === 'arm';

module.exports = {
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
  CAR_CHARACTERISTICS,
  BATTERY_CHARACTERISTICS,
  FUEL_CELL_CHARACTERISTICS,
  GROUND_RESISTANCE,
  STORED_VALUES,
  SEPARATORS,
  CONNECTION_TIMEOUT,
  BUFFER_LENGTH,
  INPUT_PIN,
  OUTPUT_PIN,
  isPi
};
