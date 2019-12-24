const { app, BrowserWindow, screen, ipcMain } = require("electron");
// const SerialPort = require("serialport");
// const SerialPort = require("virtual-serialport");
// const {testData} = require("./test");


function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Создаем окно браузера.
  let win = new BrowserWindow({
    width: 640,
    height: 480,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.maximize();

  // и загрузить index.html приложения.
  win.loadFile("index.html");
}

app.on("ready", createWindow);

// const standPort = new SerialPort("COM1", { baudRate: 115200 }, _ =>
//   handlePortError("stand-connection-error")
// );

// const carPort = new SerialPort("COM3", { baudRate: 115200 }, _ =>
//   handlePortError("car-connection-error")
// );

// function handlePortError(message) {
//   ipcMain.send("port-error", message);
// }

// ipcMain.on("flooring-change", (event, arg) => {
//   // standPort.write(arg, _ => event.reply("stand-port-error"));
//   standPort.write(testData)
//   standPort.on("data", data => event.reply("stand-data", data));
// });
