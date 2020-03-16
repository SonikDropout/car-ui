<script>
  import { batteryData, fuelCellData, batteryCharge } from "../stores";
  import { __ } from '../../constants'
  import Footer from "./Footer";
  export let switchBlock;
</script>

<style>
  .layout {
    background-image: url("../../../app/backgrounds/chars.svg");
  }

  header {
    margin-bottom: 1rem;
  }

  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 1.6rem;
    grid-template-rows: 16rem auto 5rem;
  }

  ul {
    grid-column-end: span 5;
    grid-column-start: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul:first-of-type {
    grid-column-start: 2;
    color: var(--bg-color);
  }

  ul:last-of-type {
    grid-column-start: 7;
  }

  li {
    position: relative;
  }

  figure {
    grid-row: 1/ 2;
    grid-column: span 6;
    text-align: center;
  }

  figure .icon {
    font-size: 9rem;
    margin-bottom: 1rem;
    color: var(--corporate-blue-darken);
  }

  figcaption {
    font-weight: normal;
    font-size: 2.4rem;
    grid-column: span 6;
    text-align: center;
    margin-top: 1rem;
  }

  figure:first-child figcaption {
    color: var(--bg-color);
  }

  button {
    grid-column-start: 2;
    grid-column-end: span 2;
  }

  .warning {
    font-size: 2.4rem;
    color: var(--danger-color);
    position: absolute;
    left: -3rem;
    top: -0.5rem;
    animation: blink 1s linear infinite alternate;
  }

  .warning:hover + .tooltip {
    opacity: 1;
    transform: translate(-50%, -5.5rem);
    visibility: visible;
  }

  .tooltip {
    max-width: 12rem;
    transition: 0.3s ease-in-out;
    font-size: 1rem;
    position: absolute;
    left: -2.1rem;
    transform: translate(-50%, -6rem);
    padding: 0.5rem 1.5rem;
    background: var(--bg-color);
    border-radius: 4px;
    visibility: hidden;
    opacity: 0;
    filter: drop-shadow(0 0 4px var(--text-color));
    z-index: 9999;
  }

  .tooltip::after {
    content: "";
    border: 5px solid transparent;
    border-top-color: var(--bg-color);
    display: block;
    position: absolute;
    top: 100%;
    left: 50%;
  }

  .battery {
    border: 2px solid var(--bg-color);
    display: inline-block;
    width: 3rem;
    height: 2rem;
    padding: 1px;
    position: relative;
    top: 0.3rem;
  }

  .battery::after {
    content: "";
    display: block;
    position: absolute;
    border: 2px solid var(--bg-color);
    border-left: none;
    height: 1rem;
    width: 0.4rem;
    left: 100%;
    top: 50%;
    transform: translate(0, -50%);
  }

  .battery-charge {
    display: block;
    background-color: var(--bg-color);
    height: 100%;
  }

  .battery-charge.low {
    background-color: var(--danger-color);
  }

  .charge-value {
    display: inline-block;
    width: 4rem;
  }
</style>

<div class="layout">

  <header>{__('characteristics title')}</header>

  <main>
    <figure>
      <i class="icon icon-battery" />
      <figcaption>{__('battery')}</figcaption>
    </figure>
    <ul>
      {#each $batteryData as row}
        <li>
          {#if row.type == 'numeric'}
            <span>
              {row.label},
              <em>{row.units}</em>
              :
            </span>
            <strong>{row.value}</strong>
          {:else if row.type == 'textFlag'}
            <span>{row.label}:</span>
            <strong>{row.value}</strong>
          {:else if row.type == 'semaphoreFlag'}
            <span>{row.label}:</span>
            <i class="mark {row.value ? 'check' : 'cross'}" />
          {/if}

        </li>
      {/each}
      <li>
        <span>{__('charge level')}:</span>
        <strong class="charge-value">{$batteryCharge}%</strong>
        <span class="battery">
          <span
            class="battery-charge"
            class:low={$batteryCharge < 30}
            style="width:{$batteryCharge}%" />
        </span>
      </li>
    </ul>

    <figure>
      <i class="icon icon-fuelCell" />
      <figcaption>{__('fuel cell stack')}</figcaption>
    </figure>
    <ul>
      {#each $fuelCellData as row}
        <li>
          {#if row.type == 'numeric'}
            <span>
              {row.label},
              <em>{row.units}</em>
              :
            </span>
            <strong>{row.value}</strong>
          {:else if row.type == 'textFlag'}
            <span>{row.label}:</span>
            <strong>{row.value}</strong>
          {:else if row.type == 'restricted'}
            <span>{row.label}, {row.units}:</span>
            <strong>{row.value}</strong>
            {#if row.value < row.criticalValue}
              <i class="icon icon-exclamation warning" />
              <span class="tooltip">{row.warningMessage}</span>
            {/if}
          {/if}
        </li>
      {/each}
    </ul>
    <button
      on:click={() => switchBlock('Dashboard')}
      class="align-top span-2 first">
      <i class="icon icon-arrow-left" />
      {__('back')}
    </button>

  </main>

  <Footer />
</div>
