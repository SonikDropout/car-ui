<script>
  import Footer from './Footer';
  import { fly } from 'svelte/transition';
  import Chart from '../elements/Chart';
  import {
    graphPoints,
    lastGraphPoints,
    usbPath,
    selectedXId,
    selectedYId,
    selectedBlockId,
  } from '../stores';
  import { CAR_CHARACTERISTICS, __ } from '../../constants';
  import { scaleLinear } from '../../utils/numagic';
  import Select from '../elements/Select';
  import { ipcRenderer } from 'electron';
  import { onMount, onDestroy } from 'svelte';
  import getChartConfig from './chart.config';
  import { selectBlocks, defaultXOption, defaultYOption } from './graphOptions';
  export let onPrev;

  let isLogSaving,
    stateToggler,
    points = graphPoints.points;

  lastGraphPoints.subscribe(() => (points = graphPoints.points));

  onDestroy(() => {
    selectedBlockId.set(selectedBlock.id);
    selectedXId.set(selectedX.id);
    selectedYId.set(selectedY.id);
  });

  let selectedBlock = selectBlocks[$selectedBlockId],
    selectedX = selectedBlock.xOptions[$selectedXId],
    isScatter = $selectedXId,
    selectedY = selectedBlock.yOptions[$selectedYId];

  $: graphPoints.XColumn = selectedX.name;
  $: graphPoints.YColumn = selectedY.name;

  function selectXOption(blockId, optionId) {
    if (blockId != selectedBlock.id) {
      selectedBlock = selectBlocks[blockId];
      selectedY = selectedBlock.yOptions[0];
    }
    if (optionId != selectedX) {
      selectedX = selectedBlock.xOptions[optionId];
    }
  }

  function selectYOption(blockId, optionId) {
    if (blockId != selectedBlock.id) {
      selectedBlock = selectBlocks[blockId];
      selectedX = selectedBlock.xOptions[0];
    }
    if (optionId != selectedX) {
      selectedY = selectedBlock.yOptions[optionId];
    }
  }

  function saveExcel() {
    isLogSaving = true;
    ipcRenderer.send('saveLog', graphPoints.rows);
    ipcRenderer
      .once('logSaved', () => (isLogSaving = false))
      .once('saveError', err => {
        isLogSaving = false;
      });
  }
</script>

<div class="layout">

  <header>{__('charts title')}</header>

  <main>
    {#each selectBlocks as block, i}
      <fieldset>
        <legend>{block.title}</legend>
        <Select
          onChange={selectXOption}
          name={i}
          order={i * 2}
          options={block.xOptions}
          selected={block === selectedBlock ? selectedX : defaultXOption} />
        <Select
          onChange={selectYOption}
          name={i}
          order={i * 2 + 1}
          options={block.yOptions}
          selected={block === selectedBlock ? selectedY : defaultYOption} />
      </fieldset>
    {/each}

    <Chart
      type={selectedX.id ? 'scatter' : 'line'}
      style="grid-area: 1 / 5 / 3 / 12; padding: 0 0 5rem 4rem"
      {points}
      xLabel="{selectedX.label}, {selectedX.units}"
      yLabel="{selectedY.label}, {selectedY.units}" />

    <button
      class="save"
      on:click={saveExcel}
      disabled={!$usbPath}
      title={$usbPath ? __('write usb') : __('connect usb')}>
      <i class="icon icon-{isLogSaving ? 'spinner' : 'usb'}" />
      {__('save usb')}
    </button>

    <button class="back" on:click={onPrev}>
      {__('back')}
      <i class="icon icon-arrow-right" />
    </button>
  </main>

  <Footer />

</div>

<style>
  .layout {
    background-image: url('../../../app/backgrounds/graph.svg');
  }

  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 1.6rem;
    grid-row-gap: 0.8rem;
    grid-template-rows: auto auto 5rem;
  }

  button.save {
    grid-column-start: 2;
    grid-column-end: span 7;
  }

  button.back {
    grid-column-end: span 3;
    grid-column-start: 9;
  }

  button {
    align-self: start;
  }

  fieldset {
    border: none;
    padding-top: 0;
    padding-left: 0;
    padding-right: 3rem;
    grid-column: 2 / 5;
  }

  legend {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 2rem;
    color: var(--bg-color);
  }
  .icon-spinner {
    animation: spin 1s linear infinite;
  }
</style>
