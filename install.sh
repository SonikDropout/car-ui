# INSTALL REQUIRED PACKAGES
sudo apt-get -y install xorg npm midori bluetooth bluez libbluetooth-dev libudev-dev

# MAIN APP INSTALLATION
ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/"
npm i
npm run build
sudo mkdir /opt/car-controller
sudo mv dist/linux-armv7l-unpacked/** /opt/car-controller/

# MAIN APP AUTOSTART
sudo echo '#!/bin/sh' > /etc/rc.local
sudo echo 'su -s /bin/bash -c startx pi&' >> /etc/rc.local
sudo echo 'exit 0' >> /etc/rc.local
sudo echo 'allowed_users=anybody' >> /etc/X11/Xwrapper.config
echo 'sudo /opt/car-controller/CarController' > ~/.xinitrc
chmod +x ~/.xinitrc


if [$1 -eq --optimize]
then
sudo cat <<EOT >> /boot/config.txt
# Disable the rainbow splash screen
disable_splash=1

#Disable Wifi
dtoverlay=disable-wifi

# Overclock the SD Card from 50 to 100MHz
# This can only be done with at least a UHS Class 1 card
dtoverlay=sdtweak,overclock_50=100

# Set the bootloader delay to 0 seconds. The default is 1s if not specified.
boot_delay=0

# Overclock the raspberry pi. This voids its warranty. Make sure you have a good power supply.
force_turbo=1
EOT

  sudo echo "quiet logo.nologo" >> /boot/cmdline.txt
  sudo systemctl disable dhcpcd.service networking.service ssh.service ntp.service dphys-swapfile.service keyboard-setup.service apt-daily.service wifi-country.service hciuart.service raspi-config.service avahi-daemon.service triggerhappy.service
fi
