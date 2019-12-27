const path = require('path');
const fs = require('fs');
const Component = require('../component');
const CarBuffer = require('../../modules/dataModel');

module.exports = class Table extends Component {
  constructor(options) {
    super({
      cssPath: path.join(__dirname, 'table.css'),
      htmlPath: path.join(__dirname, 'table.html'),
      parent: options.parent,
      replace: options.replace,
    });
    this.fillTable();
    this.bluetoothConnection = options.port;
    this.listenBluetoothConnection();
  }

  fillTable() {
    document.querySelector('table').innerHTML = CarBuffer.entries
      .map((entry) =>
        entry.displayType === 'table'
          ? `
      <tr>
        <td class="parameter-name">${entry.label}</td>
        <td class="parameter-value" id=${entry.name}>Нет данных</td>
      </tr>
    `
          : ''
      )
      .join('\n');
  }

  listenBluetoothConnection() {
    this.bluetoothConnection.on('data', this.handleBuffer);
  }

  handleBuffer(buffer) {
    try {
      const convertedBuffer = CarBuffer.makeHashMap(buffer);
      CarBuffer.entries.forEach((entry) => {
        const elementToFill = document.getElementById(entry.name);
        if (elementToFill)
          elementToFill.innerText = `${
            convertedBuffer[entry.name]
          } ${entry.units || ''}`;
      });
    } catch (err) {
      console.log(err);
    }
  }
};
