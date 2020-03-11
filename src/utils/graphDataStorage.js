const { STORED_VALUES } = require('../constants');

class GraphDataStorage {
  constructor() {
    this.rows = [];
    this.XColIdx = 0; // time
    this.YColIdx = 1;
    this._points = [];
  }

  add(points) {
    if (!this._validate(points)) return;

    if (this.rows.length > 1000) {
      this.rows.shift();
    }

    this.rows.push(points);
    this._points.push({x: points[this.XColIdx], y: points[this.YColIdx]})
  }

  set XColumn(colName) {
    this.XColIdx = STORED_VALUES.indexOf(colName);
    this._updatePointsArray();
  }
  
  set YColumn(colName) {
    this.YColIdx = STORED_VALUES.indexOf(colName);
    this._updatePointsArray();
  }

  get points() {
    // sort points if x is not time
    if (this.XColIdx) return this._points.sort((p1, p2) => p1.x - p2.x);

    return this._points;
  }
  
  _updatePointsArray() {
    this._points = this.rows.map(row => ({
      x: row[this.XColIdx],
      y: row[this.YColIdx],
    }))
  }

  _validate(points) {
    for (let i = 0; i < points.length; i++) if (isNaN(points[i])) return;
    return true;
  }
}

module.exports = new GraphDataStorage();
