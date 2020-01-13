const { app, BrowserWindow, screen } = require('electron');

require('electron-reload')(__dirname, { ignored: './settings.json' });

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Создаем окно браузера.
  let win = new BrowserWindow({
    width: 800,
    height: 480,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // win.maximize();

  // и загрузить index.html приложения.
  win.loadFile('index.html');
}

app.on('ready', createWindow);
