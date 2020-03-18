<script>
  import Loader from './pages/Loader';
  import Info from './pages/Info';
  import ErrorPage from './pages/Error';
  import { btConnected, appError } from './stores';
  import { ipcRenderer } from 'electron';
  import Dashboard from './blocks/Dashboard';
  import Graph from './blocks/Graph';
  import Characteristics from './blocks/Characteristics';

  let slide = 1;

  function incrementSlide() {
    slide += slide < 2 ? 1 : 0;
  }

  function decrementSlide() {
    slide -= slide > 0 ? 1 : 0;
  }
</script>

{#if $appError}
  <ErrorPage {...$appError} onConfirm={() => ipcRenderer.send('reload')} />
{/if}
{#if !$btConnected}
  <Loader />
{:else}
  <div class="slider" style="transform: translateX(-{100 * slide}vw)">
    <Graph onPrev={incrementSlide} />
    <Dashboard onNext={incrementSlide} onPrev={decrementSlide} />
    <Characteristics onPrev={decrementSlide} />
  </div>
{/if}

<style>
  .slider {
    width: 300vw;
    height: 100vh;
    display: flex;
    transition: 0.3s ease-in-out;
  }
</style>
