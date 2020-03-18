const usbDetect = require('usb-detection');
const driveList = require('drivelist');
const EventEmitter = require('events');
const { exec } = require('child_process');
const { isPi } = require('../constants');
const { delay } = require('./others');

class USBDetector extends EventEmitter {
  constructor() {
    super();
    usbDetect.startMonitoring();
    this._findDrive();
    this._listenAdd.bind(this)();
    this._listenRemove.bind(this)();
    this._delayedFindDrive = delay(this._findDrive, 1500);
    this.stopMonitoring = usbDetect.stopMonitoring;
  }

  _listenAdd() {
    usbDetect.on('add', () => {
      this._delayedFindDrive();
    });
  }

  _listenRemove() {
    usbDetect.on('remove', () => {
      driveList.list((error, drives) => {
        if (error) {
          this.emit('remove');
          return;
        }
        if (!drives.find(drive => drive.device === this.connectedDevice))
          this.emit('remove');
      });
    });
  }

  _findDrive() {
    driveList.list((error, drives) => {
      if (error) return;
      const drive = drives.find(this._isSuitableDrive);
      if (!drive) return;
      if (drive.mountpoints[0]) this.emit('connect', drive.mountpoints[0].path);
      else this._mountDevice(drive);
    });
  }

  _mountDevice(drive) {
    exec(
      `mount ${drive.device}1 /media/usb1`,
      (error, stdout, stderr) => {
        if (error) {
          console.error('Error mounting device:', error.message);
          return;
        }
        if (stderr) {
          console.error('Error mounting device:', stderr);
          return;
        }
        this.emit('connect', '/media/usb1');
      }
    );
  }

  _isSuitableDrive(drive) {
    if (isPi) return !drive.system && drive.device.startsWith('/dev/sd');
    return !drive.system;
  }
}

module.exports = USBDetector;
