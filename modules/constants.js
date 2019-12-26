exports.CAR_PARAMS_SEQUENCE = Array(6)
  .fill("divider")
  .concat([
    "firstCellVoltage",
    "firstCellVoltage",
    "batteryCurrent",
    "batteryCurrent",
    "isAvailableRecharging",
    "isAvailableDischarging",
    "fuelCellVoltage",
    "fuelCellVoltage",
    "fuelCellCurrent",
    "fuelCellCurrent",
    "fuellCellTemp",
    "fuellCellTemp",
    "fuellCellFan",
    "hydrogenConsumption",
    "hydrogenConsumption",
    "hydrogenPressure",
    "hydrogenPressure",
    "currentDirection"
  ]);

exports.portID = "COM1";

exports.DIVIDERS = [161, 178, 195, 195, 212, 247];

exports.CAR_PARAMS_ENTRIES = {
  firstCellVoltage: {
    label: "Напряжении первой банки аккумуляторная батарии",
    units: "В"
  },
  batteryCurrent: {
    label: "Ток аккумуляторная батарии",
    units: "А"
  },
  fuelCellVoltage: {
    label: "Напряжение на топливном элементе",
    units: "В"
  },
  fuelCellCurrent: {
    label: "Ток на топливном элементе",
    units: "А"
  },
  fuellCellTemp: {
    label: "Температура топливного элемента",
    units: "С"
  },
  fuellCellFan: {
    label: "Скорость первого вентилятора",
    units: "%"
  },
  hydrogenConsumption: {
    label: "Расход водорода",
    units: "л/час"
  },
  hydrogenPressure: {
    label: "Давлние водорода",
    units: "мбар"
  }
};


const FLOORING_REQUEST_MAP = {
  gravel: new Uint8Array([34, 3, 32]),
  asphalt: new Uint8Array([34, 5, 120]),
  linuleum: new Uint8Array([34, 5, 220]),
  tiles: new Uint8Array([34, 6, 164])
};
