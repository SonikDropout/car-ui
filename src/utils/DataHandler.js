const {
  SEPARATORS,
  CAR_CHARACTERISTICS,
  BUFFER_LENGTH
} = require("../constants");

class DataHandler {
  constructor() {
    this.values = JSON.parse(JSON.stringify(CAR_CHARACTERISTICS));
  }

  getHashMapFromBuffer(buffer) {
    this._validateBuffer(buffer)
    for (let key in this.values) {
      this.values[key].value = this._getValueFromBuffer(
        buffer,
        this.values[key]
      );
    }
    return this.values;
  }

  getArrayFromBuffer(buffer) {
    this._validateBuffer(buffer);
    return STORED_VALUES.map(name =>
      this._getValueFromBuffer(buffer, this.values[name])
    );
  }

  _getValueFromBuffer(buffer, options) {
    let divider = options.divider || 1;
    if (options.bytes == 2) 
      return buffer.readUInt16BE(options.offset) / divider;
    else if (options.type == "textFlag")
      return buffer[options.offset] ? options.posText : options.negText;
    return buffer[options.offset] / divider;
  }

  _validateBuffer(buffer) {
    if (buffer.length < BUFFER_LENGTH) throw new Error('Buffer has incorrect length');
    for (let i = 0; i < SEPARATORS.length; i++) {
      if (buffer[i] != SEPARATORS[i]) throw new Error('Buffer has no separators in it');
    }
  }
}

module.exports = DataHandler;
