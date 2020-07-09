<script>
  import {ipcRenderer} from 'electron';
</script>

<button on:click={() =>ipcRenderer.send('findAnotherCar')}><img src="./icons/bluetooth.svg" alt="bt" /></button>

<style>
  button {
    border: none;
    background-color: transparent;
    box-shadow: none;
    position: fixed;
    left: 1rem;
    top: 1rem;
    cursor: pointer;
  }
  img {
    width: 2rem;
  }
</style>