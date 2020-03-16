<script>
  import { onDestroy } from "svelte";
  import Spinner from "../elements/Spinner";
  import { __ } from '../../constants';
  let dots = 1;
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
  div {
    font-size: 2rem;
    max-width: 50vw;
    text-align: center;
    color: var(--danger-color);
    /* animation: blink 1s ease-in-out infinite alternate; */
  }
</style>

<main>
  <Spinner />
  <h2>{__('loading')}</h2>
  <div>{__('loading hint')}</div>
</main>
