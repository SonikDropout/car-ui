<script>
  import Loader from "./pages/Loader";
  import Info from "./pages/Info";
  import ErrorPage from "./pages/Error";
  import { btConnected, appError } from "./stores";
  import { ipcRenderer } from "electron";
  import Dashboard from "./blocks/Dashboard";
  import Graph from "./blocks/Graph";
  import Characteristics from "./blocks/Characteristics";

  let state = "Dashboard";

  function switchBlock(blockName) {
    state = blockName;
  }
</script>

{#if $appError}
  <ErrorPage {...$appError} onConfirm={() => ipcRenderer.send('reload')} />
{/if}
{#if !$btConnected}
  <Loader />
{:else if state == 'Dashboard'}
  <Dashboard {switchBlock} />
{:else if state == 'Graph'}
  <Graph {switchBlock} />
{:else if state == 'Characteristics'}
  <Characteristics {switchBlock} />
{/if}
