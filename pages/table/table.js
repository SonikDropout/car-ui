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
    this.bluetoothConnection = options.port;
    this.listenBluetoothConnection();
  }

  listenBluetoothConnection() {
    this.bluetoothConnection.on('data', this.handleBuffer);
  }

  handleBuffer(buffer) {
    try {
      const convertedBuffer = CarBuffer.makeHashMap(buffer);
      CarBuffer.entries.forEach((entry) => {
        const elementToFill = document.getElementById(entry.name);
        if (!elementToFill) return;
        else if (entry.displayType == 'number')
          elementToFill.innerText = `${
            convertedBuffer[entry.name]
          } ${entry.units || ''}`;
        else if (entry.displayType == 'text') 
          elementToFill.innerText = convertedBuffer[entry.name];
        else {
          elementToFill.classList.add(
            convertedBuffer[entry.name] ? 'positive' : 'negative'
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};
