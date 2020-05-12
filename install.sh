# INSTALL REQUIRED PACKAGES
apt-get -y install xorg midori bluetooth bluez libbluetooth-dev libudev-dev

# MAIN APP INSTALLATION
npm i
npm run build
mkdir /opt/car-controller
mv dist/linux-armv7l-unpacked/** /opt/car-controller/

# MAIN APP AUTOSTART
echo '#!/bin/sh' > /etc/rc.local
echo 'su -s /bin/bash -c startx pi&' >> /etc/rc.local
echo 'exit 0' >> /etc/rc.local
echo 'allowed_users=anybody' >> /etc/X11/Xwrapper.config
echo 'sudo /opt/car-controller/CarController' > ~/.xinitrc
chmod +x ~/.xinitrc


if [$1 -eq --optimize]
then
cat <<EOT >> /boot/config.txt
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

  echo "quiet logo.nologo" >> /boot/cmdline.txt
  systemctl disable dhcpcd.service
  systemctl disable networking.service
  systemctl disable ssh.service
  systemctl disable ntp.service
  systemctl disable dphys-swapfile.service
  systemctl disable keyboard-setup.service
  systemctl disable apt-daily.service
  systemctl disable wifi-country.service
  systemctl disable hciuart.service
  systemctl disable raspi-config.service
  systemctl disable avahi-daemon.service
  systemctl disable triggerhappy.service
fi
