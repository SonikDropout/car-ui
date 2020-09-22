<script>
  import Loader from './pages/Loader';
  import Info from './pages/Info';
  import ErrorPage from './pages/Error';
  import { btConnected, appError } from './stores';
  import { ipcRenderer } from 'electron';
  import Dashboard from './blocks/Dashboard';
  import Graph from './blocks/Graph';
  import Characteristics from './blocks/Characteristics';
  import Version from './elements/Version';
  import ReconnectButton from './elements/ReconnectButton';
  import BluetoothDialog from './pages/BluetoothDialog';
  import UpdateModal from './pages/UpdateModal';
  let updateAvailable = ipcRenderer.sendSync('checkUpdate');

  ipcRenderer.on('updateAvailable', () => (updateAvailable = true));

  let slide = 1;

  function incrementSlide() {
    slide += slide < 2 ? 1 : 0;
  }

  function decrementSlide() {
    slide -= slide > 0 ? 1 : 0;
  }
</script>

<Version />
{#if !$btConnected}
  <BluetoothDialog />
{:else}
  <ReconnectButton />
  <div class="slider slide-{slide}">
    <Graph onPrev={incrementSlide} />
    <Dashboard onNext={incrementSlide} onPrev={decrementSlide} />
    <Characteristics onPrev={decrementSlide} />
  </div>
{/if}
{#if updateAvailable}
  <UpdateModal />
{/if}

<style>
  .slider {
    display: flex;
    width: 300vw;
    transition: 0.3s ease-in-out;
  }
  .slider.slide-1 {
    transform: translateX(-100vw);
  }
  .slider.slide-2 {
    transform: translateX(-200vw);
  }
</style>
