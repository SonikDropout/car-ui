const path = require('path');
const fs = require('fs');
const Component = require('../component');
const CarBuffer = require('../../modules/dataModel');
const modes = require('../../modules/driveModes');

module.exports = class Table extends Component {
  constructor(options) {
    super({
      cssPath: path.join(__dirname, 'info.css'),
      htmlPath: path.join(__dirname, 'info.html'),
      parent: options.parent,
      replace: options.replace,
    });
    this.bluetoothConnection = options.port;
    this.selectDriveMode = options.onDriveModeChange;
    this.listenBluetoothConnection();
    this.createDriveModeSelector(options.driveMode);
    this.listenCheckboxChanges();
  }

  createDriveModeSelector(defaultSelected) {
    document.querySelector('form').innerHTML = modes
      .map(
        (mode) =>
          // prettier-ignore
          `<input type="radio" id="${mode.groundType}" value="${mode.groundType};${mode.dutyCycle}" name="mode" ${ defaultSelected === mode.groundType ? 'checked' : ''}/><label title="${mode.label}" for="${mode.groundType}">${mode.label}</label>`
      )
      .join('');
  }

  listenCheckboxChanges() {
    document.forms[0].addEventListener(
      'click',
      this.handleFormClick.bind(this)
    );
  }

  handleFormClick(event) {
    if (event.target.value) this.selectDriveMode(event.target.value);
  }

  listenBluetoothConnection() {
    document.addEventListener('bluetoothData', this.handleData.bind(this));
  }

  handleData(carInfo) {
    try {
      CarBuffer.entries.forEach((entry) => {
        const elementToFill = document.getElementById(entry.name);
        if (!elementToFill) return;
        else if (entry.displayType == 'number')
          elementToFill.innerText = `${
            carInfo[entry.name]
          } ${entry.units || ''}`;
        else if (entry.displayType == 'text')
          elementToFill.innerText = carInfo[entry.name];
        else {
          elementToFill.classList.add(
            carInfo[entry.name] ? 'positive' : 'negative'
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};
