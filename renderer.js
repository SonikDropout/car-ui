const { startWritingTestData, stopWritingTestData } = require("./modules/test");
const { portID, DIVIDERS, CAR_PARAMS_ENTRIES } = require("./modules/constants");
const SerialPort = require("virtual-serialport");
const fs = require("fs");

let settings;
let port;

const settingsPromise = new Promise((resolve, reject) => {
  fs.readFile("./settings.json", (err, data) => {
    if (err) reject(err);
    else resolve(JSON.parse(data));
  });
});

const portOpenPromise = new Promise((resolve, reject) => {
  port = new SerialPort(portID, { baudrate: 115200 });

  port.on("open", err => {
    if (err) reject(err);
    else resolve();
  });
});

function tryConnectingToPort() {
  port = new SerialPort(portID, { baudrate: 115200 });

  port.on("open", err => {
    if (err) renderErrorScreen();
    else if (settings.selectedGroundType) actions.startListeningToData();
    else renderGroundTypeForm();
  });
}

function handleInitializationError(err) {
  console.error(err.message);
  renderErrorScreen();
}

function renderErrorScreen() {
  document.getElementById("content").innerHTML = `
  <main class="error-page">
    <h2 class="screen-title error">Пожалуйста, подключите машинку к стенду</h2>
    <button class="btn" data-action="reconnect">Сделано!</button>
  </main>
  `;
}

document.addEventListener("click", handleClick);
Promise.all([settingsPromise, portOpenPromise])
  .then(([resolvedSettings]) => {
    settings = resolvedSettings;
    if (settings.selectedGroundType) actions.startListeningToData();
    else renderGroundTypeForm();
  })
  .catch(handleInitializationError);

function handleClick(event) {
  const actionType = event.target.dataset.action;
  if (actionType) {
    console.log(actionType);
    actions[actionType].call(this, event.target);
  }
}

const actions = {
  reconnect() {
    showSpinner();
    tryConnectingToPort();
  },
  selectGroundType(target) {
    settings.selectedGroundType = target.dataset.groundType;
    console.log(this.dataset);
    document.querySelector(
      'button[data-action="startListeningToData"]'
    ).disabled = false;
  },
  startListeningToData() {
    startWritingTestData(port);
    renderCarDataTable();
    port.on("data", handleCarData);
  }
};

function renderGroundTypeForm() {
  document.getElementById("content").innerHTML = `
  <header class="screen-title">Выберете тип покрытия</header>
  <main class="ground-types">
    <div class="clickable-area" data-groundType="gravel" data-action="selectGroundType">
      <img src="./assets/icons/gravel.svg" />
      Грунт
    </div>
    <div class="clickable-area" data-groundType="asphalt" data-action="selectGroundType">
      <img src="./assets//icons/asphalt.jpg" />
      Асфальт
    </div>
    <div class="clickable-area" data-groundType="linoleum" data-action="selectGroundType">
      <img src="./assets/icons/linoleum.png" />
      Линолиум
    </div>
    <div class="clickable-area" data-groundType="tiles" data-action="selectGroundType">

      <img src="./assets/icons/tiles.png" />
      Плитка
    </div>
    <label>
      <input type="checkbox" name="remember" />
      Запомнить
    </label>
    <button class="btn" disabled data-action="startListeningToData">Далее</button>
  </main>
  `;
}

function showSpinner() {
  document.getElementById("content").innerHTML = `
  <main class="loader">
  <div class="spinner-box">
    <div class="blue-orbit leo"></div>

    <div class="green-orbit leo"></div>

    <div class="red-orbit leo"></div>

    <div class="white-orbit w1 leo"></div>
    <div class="white-orbit w2 leo"></div>
    <div class="white-orbit w3 leo"></div>
  </div>
  <p class="spinner-caption">Соединение</p>
</main>
  `;
}

function renderCarDataTable() {
  document.getElementById("content").innerHTML = `
  <header class="page-title">Параметры работы машинки</header>
  <main>
    <table class="parameters">
      ${Object.keys(CAR_PARAMS_ENTRIES)
        .map(
          id => `
        <tr>
          <td class="parameter-name">${CAR_PARAMS_ENTRIES[id].label}</td>
          <td class="parameter-value" id=${id}>Нет данных</td>
        </tr>
      `
        )
        .join("\n")}
    </table>
  </main>
  `;
}

function handleCarData(buffer) {
  const dataArray = new Uint8Array(buffer);

  let i;

  for (i = 0; i < DIVIDERS.length; i++) {
    if (dataArray[i] !== DIVIDERS[i]) {
      console.error("wrong data recieved");
      return;
    }
  }

  const dataMap = {
    firstCellVoltage: ((dataArray[i++] << 8) + dataArray[i++]) / 1000,
    batteryCurrent: ((dataArray[i++] << 8) + dataArray[i++]) / 1000,
    isAvailableRecharging: dataArray[i++] === 1,
    isAvailableDischarging: dataArray[i++] === 1,
    fuelCellVoltage: ((dataArray[i++] << 8) + dataArray[i++]) / 100,
    fuelCellCurrent: ((dataArray[i++] << 8) + dataArray[i++]) / 1000,
    fuellCellTemp: ((dataArray[i++] << 8) + dataArray[i++]) / 10,
    fuellCellFan: dataArray[i++],
    fuelCellOn: dataArray[i++],
    hydrogenConsumption: ((dataArray[i++] << 8) + dataArray[i++]) / 100,
    hydrogenPressure: (dataArray[i++] << 8) + dataArray[i++],
    currentDirection: dataArray[i++]
  };

  for (const id in dataMap) {
    const td = document.getElementById(id);
    if (td) {
      td.innerHTML = dataMap[id] + " " + CAR_PARAMS_ENTRIES[id].units;
    }
  }
}
