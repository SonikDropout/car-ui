const usbDetect = require('usb-detection');
const driveList = require('drivelist');
const EventEmitter = require('events');
const { isPi } = require('../constants');

class USBDetector extends EventEmitter {
  constructor() {
    super();
    usbDetect.startMonitoring();
    this._findDrive();
    this._listenAdd.bind(this)();
    this._listenRemove.bind(this)();
    this.stopMonitoring = usbDetect.stopMonitoring;
  }

  _listenAdd() {
    usbDetect.on('add', () => {
      this._findDrive();
    });
  }

  _listenRemove() {
    usbDetect.on('remove', () => {
      driveList.list((error, drives) => {
        if (error) {
          this.emit('remove');
          return;
        }
        if (!drives.find((drive) => drive.device === this.connectedDevice))
          this.emit('remove');
      });
    });
  }

  _findDrive() {
    driveList.list((error, drives) => {
      if (error) {
        return;
      }
      const drive = drives.find(this._isSuitableDrive);
      console.log(drives);
      if (drive) {
        this.connectedDevice = drive.device;
        this.emit('connect', drive.mountpoints[0].path);
      }
    });
  }

  _isSuitableDrive(drive) {
    if (isPi) return !drive.system && drive.device.startsWith('/dev/sd');
    return !drive.system;
  }
}

module.exports = USBDetector;
