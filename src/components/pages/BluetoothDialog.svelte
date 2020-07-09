<script>
  import { __ } from '../../constants';
  export let title = __('select car');
  import { ipcRenderer } from 'electron';

  let cars = ipcRenderer.sendSync('getCarList');

  ipcRenderer.on('updateCarsList', (e, newCars) => (cars = newCars));

  function selectCar(e) {
    ipcRenderer.send('connectToCar', e.target.dataset.address);
  }
</script>

<section>
  <div>
    <h2>{title}</h2>
    <ul>
      {#each cars as car (car.address)}
        <li data-address={car.address} on:click={selectCar}>{car.name}</li>
      {/each}
    </ul>
  </div>
</section>

<style>
  h2 {
    font-size: 2.4rem;
    text-align: center;
    margin-bottom: 0;
  }
  section {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    z-index: 9999;
  }
  div {
    margin: auto;
    background-color: white;
    height: 85vh;
    width: 90vh;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    padding: 2.4rem;
  }
  ul {
    font-size: 2rem;
    font-weight: bold;
  }
</style>
