module.exports = {
  idx: 0,
  length: 24,
  separators: [161, 178, 195, 195, 212, 247],
  entries: [
    {
      units: 'В',
      displayType: 'table',
      name: 'firstCellVoltage',
      label: 'Напряжении первой банки аккумуляторная батарии',
      getFromBuffer: (buffer) =>
        (buffer[this.idx++] * 256 + buffer[this.idx++]) / 1000,
    },
    {
      units: 'А',
      displayType: 'table',
      name: 'batteryCurrent',
      label: 'Ток аккумуляторная батарии',
      getFromBuffer: (buffer) =>
        (buffer[this.idx++] * 256 + buffer[this.idx++]) / 1000,
    },
    {
      name: 'isAvailableRecharging',
      label: '',
      displayType: 'checkmark',
      getFromBuffer: (buffer) => buffer[this.idx++] == 1,
    },
    {
      name: 'isAvailableDischarging',
      label: '',
      displayType: 'checkmark',
      getFromBuffer: (buffer) => buffer[this.idx++] == 1,
    },
    {
      units: 'В',
      displayType: 'table',
      name: 'fuelCellVoltage',
      label: 'Напряжение на топливном элементе',
      getFromBuffer: (buffer) =>
        (buffer[this.idx++] * 256 + buffer[this.idx++]) / 100,
    },
    {
      units: 'А',
      displayType: 'table',
      name: 'fuelCellCurrent',
      label: 'Ток на топливном элементе',
      getFromBuffer: (buffer) =>
        (buffer[this.idx++] * 256 + buffer[this.idx++]) / 1000,
    },
    {
      units: '\u2103',
      displayType: 'table',
      name: 'fuellCellTemp',
      label: 'Температура топливного элемента',
      getFromBuffer: (buffer) =>
        (buffer[this.idx++] * 256 + buffer[this.idx++]) / 10,
    },
    {
      units: '%',
      displayType: 'table',
      name: 'fuellCellFan',
      label: 'Скорость вентилятора топливного элемента',
      getFromBuffer: (buffer) => buffer[this.idx++],
    },
    {
      name: 'fuellCellOn',
      label: '',
      displayType: 'checkmark',
      getFromBuffer: (buffer) => buffer[this.idx++] == 1,
    },
    {
      units: 'л/час',
      displayType: 'table',
      name: 'hydrogenConsumption',
      label: 'Расход водорода',
      getFromBuffer: (buffer) =>
        (buffer[this.idx++] * 256 + buffer[this.idx++]) / 100,
    },
    {
      units: 'мбар',
      displayType: 'table',
      name: 'hydrogenPressure',
      label: 'Давление водорода',
      getFromBuffer: (buffer) => buffer[this.idx++] * 256 + buffer[this.idx++],
    },
    {
      name: 'currentDirection',
      label: '',
      displayType: 'checkmark',
      getFromBuffer: (buffer) => buffer[this.idx++],
    },
  ],
  isInvalidBuffer(buffer) {
    for (let i = 0; i < this.separators.length; i++) {
      if (buffer[i] !== this.separators[i]) return false;
    }
  },
  makeHashMap(buffer) {
    if (this.isInvalidBuffer(buffer))
      throw new TypeError('wrong data recieved from connection');
    this.idx = this.separators.length;
    return this.entries.reduce((hashMap, entry) => {
      hashMap[entry.name] = entry.getFromBuffer(buffer);
      return hashMap;
    }, {});
  },
};
