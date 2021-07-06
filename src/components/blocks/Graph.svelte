<script>
  import Footer from './Footer';
  import { fly } from 'svelte/transition';
  import {
    lastGraphPoints,
    usbConnected,
    selectedXId,
    selectedYId,
    selectedBlockId,
  } from '../stores';
  import {
    __,
    STORED_VALUES,
    CHART_CONSTRAINTS,
  } from '../../constants';
  import RadioGroup from '../elements/RadioGroup';
  import { ipcRenderer } from 'electron';
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js';
  import 'chartjs-plugin-zoom';
  import getChartConfig from './chart.config';
  import { selectBlocks } from './graphOptions';
  import pStorage from '../../utils/graphDataStorage';
  export let onPrev;

  let isLogSaving, chart, savedMessage;

  onMount(() => {
    const xRange = CHART_CONSTRAINTS[selectedX.name];
    const yRange = CHART_CONSTRAINTS[selectedY.name];
    chart = new Chart(
      document.getElementById('chart').getContext('2d'),
      getChartConfig(pStorage.points, {
        x: {
          label: `${selectedX.label}, ${selectedX.units}`,
          max: xRange[1],
          min: xRange[0],
        },
        y: {
          label: `${selectedY.label}, ${selectedY.units}`,
          max: yRange[1],
          min: yRange[0],
        },
      })
    );
    chart.options.onClick = chart.resetZoom;
  });

  onDestroy(() => {
    selectedBlockId.set(selectedBlock.id);
    selectedXId.set(selectedX.id);
    selectedYId.set(selectedY.id);
    unsubscribePoints();
    chart.destroy();
    pStorage.clear();
  });

  let selectedBlock = selectBlocks[$selectedBlockId],
    selectedX = selectedBlock.xOptions[$selectedXId],
    selectedY = selectedBlock.yOptions[$selectedYId];

  function updateAxes() {
    pStorage.setXCol(STORED_VALUES.indexOf(selectedX.name));
    pStorage.setYCol(STORED_VALUES.indexOf(selectedY.name));
    const xRange = CHART_CONSTRAINTS[selectedX.name];
    const yRange = CHART_CONSTRAINTS[selectedY.name];
    chart.options.scales.xAxes[0].scaleLabel.labelString = `${selectedX.label}, ${selectedX.units}`;
    chart.options.scales.xAxes[0].ticks = {
      suggestedMax: xRange[1],
      suggestedMin: xRange[0],
    };
    chart.options.scales.yAxes[0].scaleLabel.labelString = `${selectedY.label}, ${selectedY.units}`;
    chart.options.scales.yAxes[0].ticks = {
      suggestedMax: yRange[1],
      suggestedMin: yRange[0],
    };
    chart.update();
  }

  let firstSkipt,
    unsubscribePoints = lastGraphPoints.subscribe((newPoints) => {
      if (!firstSkipt) return (firstSkipt = true);
      pStorage.addRow(newPoints);
      ipcRenderer.send('excelRow', newPoints);
      if (chart) {
        chart.data.datasets[0].data = pStorage.points;
        chart.update();
      }
    });

  function selectXOption(e) {
    const blockId = e.target.name[0];
    const optionId = e.target.value;
    if (blockId != selectedBlock.id) {
      selectedBlock = selectBlocks[blockId];
      selectedY = selectedBlock.yOptions[0];
    }
    selectedX = selectedBlock.xOptions[optionId];
    updateAxes();
  }

  function selectYOption(e) {
    const blockId = e.target.name[0];
    const optionId = e.target.value;
    if (blockId != selectedBlock.id) {
      selectedBlock = selectBlocks[blockId];
      selectedX = selectedBlock.xOptions[0];
    }
    selectedY = selectedBlock.yOptions[optionId];
    updateAxes();
  }

  function saveExcel() {
    isLogSaving = true;
    ipcRenderer.send('saveLog');
    ipcRenderer
      .once('logSaved', () => {
        isLogSaving = false;
        savedMessage = __('save success');
      })
      .once('saveError', (_, err) => {
        isLogSaving = false;
        savedMessage = __('save error');
        console.error(err);
      });
  }

  function ejectUSB() {
    savedMessage = void 0;
    ipcRenderer.send('ejectUSB');
  }
</script>

<div class="layout">
  {#if savedMessage}
    <div class="popup" transition:fly={{ y: -100 }}>
      <span class="popup-close" on:click={() => (savedMessage = void 0)}>
        &#x2715;
      </span>
      <p>{savedMessage}</p>
      <button class="eject" on:click={ejectUSB}>{__('eject')}</button>
    </div>
  {/if}

  <header>{__('charts title')}</header>

  <main>
    {#each selectBlocks as block, i}
      <fieldset>
        <legend>{block.title}</legend>
        <RadioGroup
          label={__('x axis') + ': '}
          on:change={selectXOption}
          name={i + 'x'}
          options={block.xOptions}
          value={block === selectedBlock ? selectedX.id : void 0}
        />
        <RadioGroup
          label={__('y axis') + ': '}
          on:change={selectYOption}
          name={i + 'y'}
          options={block.yOptions}
          value={block === selectedBlock ? selectedY.id : void 0}
        />
      </fieldset>
    {/each}

    <div class="chart-wrapper">
      <canvas id="chart" width="580" height="370" />
    </div>

    <button
      class="save"
      on:click={saveExcel}
      disabled={!$usbConnected || isLogSaving}
      title={$usbConnected ? __('write usb') : __('connect usb')}
    >
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
  main {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 1.6rem;
    grid-row-gap: 0.8rem;
    grid-template-rows: auto auto 5rem;
    padding: 0 3.6rem;
  }

  .chart-wrapper {
    grid-row: 1 / 3;
    grid-column: 5 / 13;
  }

  button.save {
    grid-column-start: 1;
    grid-column-end: span 7;
  }

  button.back {
    grid-column-end: span 2;
    grid-column-start: 11;
  }

  button {
    align-self: start;
  }

  fieldset {
    border: none;
    padding-top: 0;
    padding-left: 0;
    grid-column: 1 / 5;
  }

  legend {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 2rem;
    font-family: 'Oswald', sans-serif;
  }
  .icon-spinner {
    animation: spin 1s linear infinite;
  }

  .popup {
    position: absolute;
    background-color: var(--bg-color);
    top: 3px;
    left: calc(50% - 15rem);
    width: 30rem;
    padding: 0 2rem 1rem;
    border-radius: 4px;
    box-shadow: 0 0 6px -1px var(--text-color);
  }
  .popup-close {
    background-color: transparent;
    position: absolute;
    top: 1rem;
    right: 1rem;
    border: none;
    outline: none;
    font-size: 1rem;
    cursor: pointer;
  }

  .eject {
    font-size: 1.4rem;
    padding: 0.4rem 0.8rem;
  }

  canvas {
    touch-action: pinch-zoom;
  }
</style>
