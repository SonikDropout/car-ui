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
    if (this.rows.length > 1000) {
      this.rows.shift();
      this.points.shift();
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

  _updatePoints() {
    this.points = this.rows.map(row => ({
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
