const { MAX_POINTS } = require('../constants');

class PointsStorage {
  constructor() {
    this.rows = [];
    this._xCol = 0;
    this._yCol = 1;
    this.points = [];
  }

  addRow(row) {
    this.rows.push(row);
    this.points.push({ x: row[this._xCol], y: row[this._yCol] });
    if (this.points.length > MAX_POINTS) {
      this.downsamplePoints();
    }
    this._sortPoints();
  }

  setXCol(col) {
    if (col !== this._xCol) {
      this._xCol = col;
      this._updatePoints();
    }
  }

  setYCol(col) {
    if (col !== this._yCol) {
      this._yCol = col;
      this._updatePoints();
    }
  }

  clear() {
    this.points = [];
    this.rows = [];
  }

  _downsamplePoints() {
    const divider = Math.round(this.rows.length / MAX_POINTS * 2);
    this.points = [];
    for (let i = 0; i < this.rows.length; ++i)
      if (!(i % divider))
        this.points.push({
          x: this.rows[i][this._xCol],
          y: this.rows[i][this._yCol],
        });
    this._sortPoints();
  }

  _updatePoints() {
    this.points = this.rows.map((row) => ({
      x: row[this._xCol],
      y: row[this._yCol],
    }));
    this._sortPoints();
  }

  _sortPoints() {
    if (!this._xCol) return;
    this.points = this.points.sort((p1, p2) => p1.x - p2.x);
  }
}

module.exports = new PointsStorage();
