const noble = require('noble');
const EventEmitter = require('events');
const DataHandler = require('./DataHandler');
const {
  CONNECTION_TIMEOUT,
  CHARACTERISTIC_UUID,
  SERVICE_UUID,
  SEPARATORS,
  __,
} = require('../constants');

class BluetoothConnector extends EventEmitter {
  constructor() {
    super();
    this.timeout = 0;
    this._connectedDevice = null;
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
      if (err) {
        console.error(err.message);
        this.startScanning();
        return;
      }
      device.once('disconnected', () => {
        this.emit('disconnected');
        this.startScanning();
      });
      device.discoverSomeServicesAndCharacteristics(
        [SERVICE_UUID],
        [CHARACTERISTIC_UUID],
        this.onServicesAndCharacteristicsDiscovered.bind(this)
      );
    });
  }

  onServicesAndCharacteristicsDiscovered(err, services, characteristics) {
    if (err) {
      this._handleError(err);
      return;
    }
    console.log('Noble discovered characteristic');
    const characteristic = characteristics[0];
    if (!characteristic) {
      this._handleError({ message: 'Characteristic list is empty' });
      return;
    }
    this._subscribeToCharacteristic(characteristic);
    this._listenCharacteristicData(characteristic);
  }

  _subscribeToCharacteristic(characteristic) {
    characteristic.subscribe(err => {
      if (err) {
        this._handleError(err);
        return;
      }
      console.log('Subscribed to characteristic');
      this.emit('connected');
    });
  }

  _listenCharacteristicData(characteristic) {
    const parser = new DataHandler();
    let firstChunk;
    const handleData = data => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.startScanning();
        this.emit('disconnected');
      }, CONNECTION_TIMEOUT);
      if (data.indexOf(SEPARATORS) == 0) firstChunk = data;
      else if (firstChunk) {
        try {
          data = parser.getHashMapFromBuffer(Buffer.concat([firstChunk, data]));
          this.emit('data', data);
        } catch (e) {
          console.error(e.message);
        } finally {
          firstChunk = null;
        }
      }
    };
    characteristic.on('data', handleData);
  }

  _handleError(err) {
    console.error(err.message);
    this.startScanning();
  }
}

module.exports = BluetoothConnector;
