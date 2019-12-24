const { ipcRenderer } = require("electron");
const { testPort } = require("./test");

const FLOORING_REQUEST_MAP = {
  gravel: new Uint8Array([34, 3, 32]),
  asphalt: new Uint8Array([34, 5, 120]),
  linuleum: new Uint8Array([34, 5, 220]),
  tiles: new Uint8Array([34, 6, 164])
};

ipcRenderer.on("port-error", (event, arg) => {
  switch (arg) {
    case "stand-connection-error":
      askForStandReload();
    case "car-connection-error":
      askToConnectCar();
  }
});

function askForStandReload() {
  document.querySelector("main").innerHTML = `
  <h2 class="screen-title error">При загрузке стенда возникла ошибка, поробуйте перезапусить стенд</h2>
  `;
}

function askToConnectCar() {
  document.querySelector("main").innerHTML = `
  <h2 class="screen-title error">Пожалуйста, подключите машинку к стенду</h2>
  `;
}

document.addEventListener("click", handleFlooringChange);

function handleFlooringChange(event) {
  if (event.target.classList.contains("flooring")){
    testPort.writeToComputer(testData)
  }
    // ipcRenderer.send("flooring-change", FLOORING_REQUEST_MAP[event.target.dataset.flooring]);
}

testPort.on('data', handleCarData);

ipcRenderer.on("car-data", handleCarData);

function handleCarData(data) {
  const dataArray = new Uint8Array(data);

  const dividers = new Uint8Array([161, 178, 195, 195, 212, 247]);

  let i;

  for (i = 0; i < dividers.length; i++) {
    if (dataArray[i] !== dividers[i]) {
      console.error("wrong data recieved");
      return;
    }
  }

  const dataMap = {
    firstCellVoltage: (dataArray[i++] << 8) + dataArray[i++],
    batteryCurrent: (dataArray[i++] << 8) + dataArray[i++],
    isAvailableRecharging: dataArray[i++] === 1,
    isAvailableDischarging: dataArray[i++] === 1,
    fuelCellVoltage: (dataArray[i++] << 8) + dataArray[i++],
    fuelCellCurrent: (dataArray[i++] << 8) + dataArray[i++],
    firstFuellCellTemp: (dataArray[i++] << 8) + dataArray[i++],
    firstFuellCellFan: dataArray[i++],
    hydrogenConsumption: (dataArray[i++] << 8) + dataArray[i++],
    hydrogenPressure: (dataArray[i++] << 8) + dataArray[i++],
    currentDirection: dataArray[i++]
  };

  document.querySelector("main").innerHTML = `
  <section id="second-screen">
    <h2 class="screen-title">Параметры работы машинки</h2>
    <table class="parameters">
      <tr>
        <td class="parameter-name">Напряжение АКБ 1банка</td class="parameter-name">
        <td class="parameter-value">${dataMap.firstCellVoltage} В</td>
      </tr>
      <tr>
        <td class="parameter-name">Ток АКБ</td>
        <td class="parameter-value">${dataMap.batteryCurrent} А</td>
      </tr>
      <tr>
        <td class="parameter-name">Напряжение топливного элемента</td>
        <td class="parameter-value">${dataMap.fuelCellVoltage} В</td>
      </tr>
      <tr>
        <td class="parameter-name">Ток топливного элемента</td>
        <td class="parameter-value">${dataMap.fuelCellCurrent} А</td>
      </tr>
      <tr>
        <td class="parameter-name">Температура топливного элемента</td>
        <td class="parameter-value">${dataMap.firstFuellCellTemp} С</td>
      </tr>
      <tr>
        <td class="parameter-name">Мощность вентилятора</td>
        <td class="parameter-value">${dataMap.firstFuellCellFan} %</td>
      </tr>
      <tr>
        <td class="parameter-name">Расход водорода</td>
        <td class="parameter-value">${dataMap.hydrogenConsumption} л/час</td>
      </tr>
      <tr>
        <td class="parameter-name">Давление водорода</td>
        <td class="parameter-value">${dataMap.hydrogenPressure} мбар</td>
      </tr>
    </table>
  </section>
  `;
}
