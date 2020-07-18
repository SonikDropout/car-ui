# INSTALL REQUIRED PACKAGES
sudo apt-get update &&
sudo apt-get -y install libudev-dev libbluetooth-dev pigpio &&

# MAIN APP INSTALLATION
ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/" &&
npm i &&
npm run build &&
sudo mkdir /opt/bt-car &&
sudo mv dist/linux-armv7l-unpacked/** /opt/bt-car/ &&

# MAIN APP AUTOSTART
echo 'sudo /opt/bt-car/CarController' > ~/.xinitrc
chmod +x ~/.xinitrc

while read p; do sudo systemctl disable "$p"; done < unused-packages.list

reboot
