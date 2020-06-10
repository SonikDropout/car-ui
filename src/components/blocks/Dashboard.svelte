<script>
  import { driveMode, carData, rpm } from '../stores';
  import { GROUND_RESISTANCE, __ } from '../../constants';
  import { ipcRenderer } from 'electron';
  export let onPrev;
  export let onNext;
</script>

<div class="layout">

  <header>{__('dash title')}</header>

  <main>
    <h3>{__('ground type')}</h3>
    {#each Object.keys(GROUND_RESISTANCE) as resistance, i}
      <label class:selected={resistance === $driveMode}>
        <input type="radio" class="hidden" value={resistance} bind:group={$driveMode} />
        {GROUND_RESISTANCE[resistance].label}
      </label>
    {/each}
    <p>
      <span>{__('rpm')}</span>
      <strong>{$rpm}</strong>
    </p>
    <p>
      <span>{__('recuperation')}:</span>
      <strong>{$carData.recuperation.value || __('no')}</strong>
    </p>

    <button on:click={onPrev} class="charts">
      <i class="icon icon-graph" />
      {__('charts')}
    </button>
    <button on:click={onNext} class="characteristics">
      <i class="icon icon-lightning" />
      {__('characteristics')}
    </button>

  </main>

</div>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 2rem;
    grid-template-rows: 8rem repeat(3, auto) 10rem;
    padding: 0 3.6rem;
  }
  h3 {
    text-align: center;
    font-weight: 400;
    font-size: 2.4rem;
    grid-column: span 12;
  }
  p {
    grid-column: 2 / -2;
    display: flex;
    justify-content: space-between;
    margin: 0;
  }
  span {
    font-weight: 500;
    font-size: 2rem;
  }
  strong {
    grid-column: span 2;
    text-align: center;
  }

  header {
    grid-column: 1 / -1;
  }

  label {
    grid-column-end: span 3;
    grid-column-start: auto;
    background-color: var(--corporate-grey);
    color: var(--bg-color);
    box-shadow: 0 3px var(--corporate-emerald-darken);
    border-radius: 4px;
    height: 5rem;
    line-height: 5rem;
    font-size: 2rem;
    text-align: center;
  }

  button {
    align-self: start;
  }

  .charts {
    grid-column: span 3;
  }

  .characteristics {
    grid-column: span 7;
    grid-column-end: -1;
  }

  .selected {
    background-color: var(--corporate-orange);
    transform: translateY(2px);
    box-shadow: 0 1px var(--corporate-emerald-darken);
  }
</style>
