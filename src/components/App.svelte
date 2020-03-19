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
{:else if !slide}
  <Graph onPrev={incrementSlide} />
{:else if slide == 2}
  <Characteristics onPrev={decrementSlide} />
{:else}
  <Dashboard onNext={incrementSlide} onPrev={decrementSlide} />
{/if}
