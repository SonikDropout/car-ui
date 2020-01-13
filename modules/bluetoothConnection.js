const noble = require('../index');

const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';

const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

const DEVICE_UUID = '00001101-0000-1000-8000-00805F9B34FB';

module.exports = class BluetoothConnection {
  constructor({ onError, onData }) {
    this.handleError = onError;
    this.handleData = onData;
    this.listenToStateChange();
    this.tryDiscoveringDevice();
  }

  listenToStateChange() {
    noble.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        noble.startScanning();
      } else {
        noble.stopScanning();
      }
    });
  }

  tryDiscoveringDevice() {
    noble.on('discover', function(device) {
      if (device.id === DEVICE_UUID) {
        noble.stopScanning();
        this.connectToDevice(device);
      }
    });
  }

  connectToDevice(device) {
    device.connect((err) => {
      if (err) this.handleError(err);
      else device.discoverServices([SERVICE_UUID], this.handleServices);
    });
  }

  handleServices(err, services) {
    if (err) this.handleError(err);
    else
      services[0].discoverCharacteristics(
        [CHARACTERISTIC_UUID],
        this.handleCharachteristics
      );
  }

  handleCharachteristics(err, characteristics) {
    if (err) this.handleError(err);
    else this.subscribeToCharacteristic(characteristics[0]);
  }

  subscribeToCharacteristic(characteristic) {
    characteristic.subscribe(this.handleError);
    characteristic.on('data', this.handleData);
  }
};
