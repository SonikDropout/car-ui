# INSTALL REQUIRED PACKAGES
sudo apt-get update &&
sudo apt-get -y install libbluetooth-dev pigpio &&

# MAIN APP INSTALLATION
ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/" &&
npm i &&
npm run build &&
sudo mkdir /opt/bt-car &&
sudo mv dist/linux-armv7l-unpacked/** /opt/bt-car/ &&

# MAIN APP AUTOSTART
sudo su
echo '#!/bin/sh' > /etc/rc.local
echo 'su -s /bin/bash -c startx pi&' >> /etc/rc.local
echo 'exit 0' >> /etc/rc.local
echo 'allowed_users=anybody' >> /etc/X11/Xwrapper.config
exit
echo 'sudo /opt/bt-car/CarController' > ~/.xinitrc
chmod +x ~/.xinitrc
