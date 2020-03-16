const noble = require('noble');
const EventEmitter = require('events');
const DataHandler = require('./DataHandler');
const {
  CONNECTION_TIMEOUT,
  CHARACTERISTIC_UUID,
  SERVICE_UUID,
  SEPARATORS,
  __
} = require('../constants');

class BluetoothConnector extends EventEmitter {
  constructor() {
    super();
    this.timeout = 0;
    this.tryOpeningConnection();
  }

  startScanning() {
    noble.startScanning([SERVICE_UUID]);
  }

  tryOpeningConnection() {
    this.listenStateChange();
    this.listenToDiscover();
  }

  listenStateChange() {
    noble.on('stateChange', state => {
      if (state === 'poweredOn') {
        console.info('Noble start scanning');
        this.startScanning();
      } else {
        console.warn('Noble stop scanning');
        noble.stopScanning();
      }
    });
  }

  listenToDiscover() {
    noble.on('discover', device => {
      console.info('Noble discovered device');
      noble.stopScanning();
      this.connectToDevice(device);
    });
  }

  connectToDevice(device) {
    device.connect(err => {
      if (err) this.emit('error', err);
      else {
        device.once('disconnected', this.emit.bind(this, 'disconnected'));
        device.discoverSomeServicesAndCharacteristics(
          [SERVICE_UUID],
          [CHARACTERISTIC_UUID],
          this.onServicesAndCharacteristicsDiscovered.bind(this)
        );
      }
    });
  }

  onServicesAndCharacteristicsDiscovered(err, services, characteristics) {
    if (err) this.emit('error', err);
    else {
      console.info('Noble discovered characteristic');
      const characteristic = characteristics[0];
      if (!characteristic) {
        this.emit('error', {
          title: __('error connecting'),
          message: __('please reload'),
        });
        return;
      }
      const handler = new DataHandler();
      characteristic.subscribe(error => {
        if (error) this.emit('error', error);
        else this.emit('connected');
      });
      let firstChunk;
      characteristic.on('data', data => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.emit('disconnected');
        }, CONNECTION_TIMEOUT);
        if (!firstChunk && data.indexOf(SEPARATORS) == 0) firstChunk = data;
        else if (firstChunk) {
          data = handler.getHashMapFromBuffer(
            Buffer.concat([firstChunk, data])
          );
          if (data) this.emit('data', data);
          firstChunk = null;
        }
      });
    }
  }
}

module.exports = BluetoothConnector;
