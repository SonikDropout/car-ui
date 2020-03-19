<script>
  import Footer from './Footer';
  import { fly } from 'svelte/transition';
  import { graphPoints, lastGraphPoints, usbPath } from '../stores';
  import { CAR_CHARACTERISTICS, __ } from '../../constants';
  import { scaleLinear } from '../../utils/numagic';
  import Select from '../elements/Select';
  import { ipcRenderer } from 'electron';
  import { onMount } from 'svelte';
  import Chart from 'chart.js';
  import zoom from 'chartjs-plugin-zoom';
  import getChartConfig from './chart.config';
  export let onPrev;

  let isLogSaving, stateToggler, chart;

  onMount(() => {
    chart = new Chart(
      document.getElementById('chart').getContext('2d'),
      getChartConfig(graphPoints.points, {
        x: `${xAxis.label}, ${xAxis.units}`,
        y: `${yAxis.label}, ${yAxis.units}`,
      })
    );
    chart.options.onClick = chart.resetZoom;
  });

  const selectBlocks = {
    fuelCell: {
      title: __('FCS characteristics'),
      XOptions: {
        time: { label: __('time'), units: __('s'), icon: 'clock' },
        fuelCellCurrent: CAR_CHARACTERISTICS.fuelCellCurrent,
      },
      YOptions: {
        fuelCellCurrent: CAR_CHARACTERISTICS.fuelCellCurrent,
        fuelCellVoltage: CAR_CHARACTERISTICS.fuelCellVoltage,
        fuelCellTemp: CAR_CHARACTERISTICS.fuelCellTemp,
        fuelCellFan: CAR_CHARACTERISTICS.fuelCellFan,
        hydrogenConsumption: CAR_CHARACTERISTICS.hydrogenConsumption,
      },
    },
    battery: {
      title: __('battery characteristics'),
      XOptions: {
        time: { label: __('time'), units: __('s'), icon: 'clock' },
        batteryCurrent: CAR_CHARACTERISTICS.fuelCellCurrent,
      },
      YOptions: {
        batteryCurrent: CAR_CHARACTERISTICS.batteryCurrent,
        batteryVoltage: CAR_CHARACTERISTICS.batteryVoltage,
      },
    },
  };

  let selectedBlock = 'battery';
  let selectedX = 'time';
  let selectedY = 'batteryVoltage';

  $: xAxis = selectBlocks[selectedBlock].XOptions[selectedX];
  $: yAxis = selectBlocks[selectedBlock].YOptions[selectedY];

  function updateAxes(name, axis) {
    if (chart) {
      chart.options.scales[
        name + 'Axes'
      ][0].scaleLabel.labelString = `${axis.label}, ${axis.units}`;
      chart.update();
    }
  }

  $: graphPoints.XColumn = selectedX;
  $: graphPoints.YColumn = selectedY;

  $: updateAxes('x', xAxis);
  $: updateAxes('y', yAxis);

  lastGraphPoints.subscribe(newPoints => {
    // just to triggre rerender of chart
    if (chart) {
      chart.data.datasets[0].data = graphPoints.points;
      chart.update();
    }
  });

  function selectXOption(name, value) {
    console.log(name, value);
    selectedX = value;
    if (name != selectedBlock) selectedY = name + 'Voltage';
    selectedBlock = name;
  }

  function selectYOption(name, value) {
    selectedY = value;
    if (name != selectedBlock) selectedX = 'time';
    selectedBlock = name;
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
    {#each Object.entries(selectBlocks) as [name, block], i}
      <fieldset>
        <legend>{block.title}</legend>
        <Select
          onChange={selectXOption}
          {name}
          order={i * 2}
          options={block.XOptions}
          selected={(name == selectedBlock && block.XOptions[selectedX]) || { label: `-- ${__('x axis')} --` }} />
        <Select
          onChange={selectYOption}
          {name}
          order={i * 2 + 1}
          options={block.YOptions}
          selected={(name == selectedBlock && block.YOptions[selectedY]) || { label: `-- ${__('y axis')} --` }} />
      </fieldset>
    {/each}

    <div class="chart-wrapper">
      <canvas id="chart" width="590" height="370" />
    </div>

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

  .chart-wrapper {
    grid-row: 1 / 3;
    grid-column: 5 / 12;
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
