const { Workbook } = require('excel4node');
const {
  FUEL_CELL_CHARACTERISTICS,
  BATTERY_CHARACTERISTICS,
  STORED_VALUES,
} = require('../constants');
const path = require('path');
const { __ } = require('../constants');

class XLSLogger {
  constructor() {
    this.fileName = __('car');
    this.workbook = new Workbook();
    this._addWorksheets();
    this._createStyles();
    this._currentRow = 1;
    this._fillTablesHeads();
  }

  writeRow(values) {
    if (!this._validate(values)) return;

    // write time to both worksheets
    this.batteryWorksheet
      .cell(this._currentRow, 1)
      .number(values[0])
      .style(this.dataStyle);
    this.fuelCellWroksheet
      .cell(this._currentRow, 1)
      .number(values[0])
      .style(this.dataStyle);

    // write other data
    for (let i = 1; i < values.length; i++) {
      if (i < STORED_VALUES.numOfBatteryValues + 1) {
        this.batteryWorksheet
          .cell(this._currentRow, i + 1)
          .number(values[i])
          .style(this.dataStyle);
      } else {
        this.fuelCellWroksheet
          .cell(this._currentRow, i - STORED_VALUES.numOfBatteryValues + 1)
          .number(values[i])
          .style(this.dataStyle);
      }
    }

    this._currentRow++;
  }

  saveLog(rows, dir, cb = () => {}) {
    if (!rows || !dir) cb();
    const date = new Date();
    this.workbook.write(
      path.join(
        dir,
        `${this.fileName}_${date.getDate()}-${date.getMonth() +
          1}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}.xlsx`
      ),
      cb
    );
  }

  _fillTablesHeads() {
    this._fillFirstRow(this.batteryWorksheet, BATTERY_CHARACTERISTICS);
    this._fillFirstRow(this.fuelCellWroksheet, FUEL_CELL_CHARACTERISTICS);
    this._currentRow++;
  }

  _fillFirstRow(worksheet, entries) {
    worksheet
      .cell(1, 1)
      .string(__('time'))
      .style(this.headerStyle);
    let i = 2;
    for (let key in entries) {
      if (!STORED_VALUES.includes(key)) continue;
      let { label, units } = entries[key];
      let title = `${label}, ${units}`;
      worksheet.column(i).setWidth(Math.max(title.length, 10) + 2);
      worksheet
        .cell(1, i)
        .string(title)
        .style(this.headerStyle);
      i++;
    }
  }

  _addWorksheets() {
    this.batteryWorksheet = this.workbook.addWorksheet(__('battery'));
    this.fuelCellWroksheet = this.workbook.addWorksheet(__('fuel cell'));
  }

  _validate(values) {
    for (let i = 0; i < values.length; i++) if (isNaN(values[i])) return;
    return true;
  }

  _createStyles() {
    this.headerStyle = this.workbook.createStyle({
      font: {
        bold: true,
        color: 'ffffff',
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '8bc041',
      },
    });
    this.headerStyle.border = this._generateBorders();
    this.dataStyle = this.workbook.createStyle({
      alignment: {
        horizontal: 'right',
      },
    });
    this.dataStyle.border = this._generateBorders();
  }

  _generateBorders() {
    return ['left', 'right', 'top', 'bottom'].reduce(
      (acc, key) => {
        acc[key] = {
          style: 'thin',
          color: 'black',
        };
        return acc;
      },
      { outline: false }
    );
  }
}

module.exports = XLSLogger;
