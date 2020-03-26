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
        <input type="radio" value={resistance} bind:group={$driveMode} />
        <i class="icon icon-{resistance}" />
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

    <button on:click={onPrev} class="align-top span-2 first">
      <i class="icon icon-graph" />
      {__('charts')}
    </button>
    <button on:click={onNext} class="last span-6 align-top">
      <i class="icon icon-lightning" />
      {__('characteristics')}
    </button>

  </main>

</div>

<style>
 .layout {
   background: url('../../../app/backgrounds/dash.png') no-repeat center/cover;
 }
 header {
   color: var(--bg-color);
 }
  main {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-column-gap: 2rem;
    grid-template-rows: 8rem repeat(3, auto) 10rem;
  }
  h3 {
    text-align: center;
    font-weight: 400;
    font-size: 2.4rem;
    grid-column: span 10;
    color: var(--bg-color);
  }
  .span-2 {
    grid-column-start: auto;
    grid-column-end: span 2;
  }
  .span-6 {
    grid-column: span 6;
  }
  .align-top {
    align-self: start;
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
    color: var(--bg-color);
  }

  header {
    grid-column: 1 / -1;
  }

  .first {
    grid-column-start: 2;
  }

  input[type='radio'] {
    position: absolute;
    top: -9999px;
    left: -9999px;
    opacity: 0;
    width: 0;
    height: 0;
    display: block;
  }

  label {
    grid-column-end: span 2;
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

  label .icon {
    font-size: 1.8rem;
  }

  label:first-of-type {
    grid-column-start: 2;
  }

  .selected {
    background-color: var(--corporate-orange);
    transform: translateY(2px);
    box-shadow: 0 1px var(--corporate-emerald-darken);
  }
</style>
