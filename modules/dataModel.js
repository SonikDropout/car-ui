module.exports = {
  idx: 0,
  length: 24,
  separators: [161, 178, 195, 195, 212, 247],
  entries: [
    {
      units: 'В',
      displayType: 'number',
      name: 'batteryVoltage',
      label: 'Напряжение АКБ',
      getFromBuffer(buffer) {
        return (buffer[this.idx++] * 256 + buffer[this.idx++]) / 1000;
      },
    },
    {
      units: 'А',
      displayType: 'number',
      name: 'batteryCurrent',
      label: 'Ток АКБ',
      getFromBuffer(buffer) {
        return (buffer[this.idx++] * 256 + buffer[this.idx++]) / 1000;
      },
    },
    {
      name: 'isAvailableRecharging',
      label: '',
      displayType: 'indicator',
      getFromBuffer(buffer) {
        return buffer[this.idx++] == 1;
      },
    },
    {
      name: 'isAvailableDischarging',
      label: '',
      displayType: 'indicator',
      getFromBuffer(buffer) {
        return buffer[this.idx++] == 1;
      },
    },
    {
      units: 'В',
      displayType: 'number',
      name: 'fuelCellVoltage',
      label: 'Напряжение БТЭ',
      getFromBuffer(buffer) {
        return (buffer[this.idx++] * 256 + buffer[this.idx++]) / 100;
      },
    },
    {
      units: 'А',
      displayType: 'number',
      name: 'fuelCellCurrent',
      label: 'Ток БТЭ',
      getFromBuffer(buffer) {
        return (buffer[this.idx++] * 256 + buffer[this.idx++]) / 1000;
      },
    },
    {
      units: '\u2103',
      displayType: 'number',
      name: 'fuellCellTemp',
      label: 'Температура БТЭ',
      getFromBuffer(buffer) {
        return (buffer[this.idx++] * 256 + buffer[this.idx++]) / 10;
      },
    },
    {
      units: '%',
      displayType: 'number',
      name: 'fuellCellFan',
      label: 'Мощность вентилятора БТЭ',
      getFromBuffer(buffer) {
        return buffer[this.idx++];
      },
    },
    {
      name: 'fuellCellOn',
      label: '',
      displayType: 'text',
      getFromBuffer(buffer) {
        return buffer[this.idx++] ? 'работает' : 'выключено';
      },
    },
    {
      units: 'л/час',
      displayType: 'number',
      name: 'hydrogenConsumption',
      label: 'Расход водорода',
      getFromBuffer(buffer) {
        return (buffer[this.idx++] * 256 + buffer[this.idx++]) / 100;
      },
    },
    {
      units: 'мбар',
      displayType: 'number',
      name: 'hydrogenPressure',
      label: 'Давление водорода',
      getFromBuffer(buffer) {
        return buffer[this.idx++] * 256 + buffer[this.idx++];
      },
    },
    {
      name: 'currentDirection',
      label: '',
      displayType: 'text',
      getFromBuffer(buffer) {
        return buffer[this.idx++] ? 'зарядка' : 'разрядка';
      },
    },
  ],
  isInvalidBuffer(buffer) {
    for (let i = 0; i < this.separators.length; i++) {
      if (buffer[i] !== this.separators[i]) return true;
    }
  },
  makeHashMap(buffer) {
    buffer = new Uint8Array(buffer);
    if (this.isInvalidBuffer(buffer))
      throw new TypeError('wrong data recieved from connection');
    this.idx = 0;
    return this.entries.reduce((hashMap, entry) => {
      hashMap[entry.name] = entry.getFromBuffer.call(this, buffer);
      return hashMap;
    }, {});
  },
};
