<script>
  import { scaleLinear, niceTicks } from '../../utils/numagic';
  import { getOffsetY, getOffsetX } from '../../utils/DOM';
  export let points;
  export let xLabel;
  export let yLabel;
  export let padding = { left: 40, right: 30, top: 20, bottom: 60 };
  export let type;
  export let style;

  let chart;

  $: if (points.length < 2) points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];

  $: xPoints = points.map(p => p.x);
  $: yPoints = points.map(p => p.y);

  $: width = chart ? chart.clientWidth : 500;
  $: height = chart ? chart.clientHeight : 300;
  $: chartX = chart ? getOffsetX(chart) : 0;
  $: chartY = chart ? getOffsetY(chart) : 0;

  $: minY = Math.min.apply(null, yPoints);
  $: maxY = Math.max.apply(null, yPoints);
  $: yTicks = niceTicks([minY, maxY], 10, true);
  $: xTicks = niceTicks([xPoints[0], xPoints.last], 10);

  $: xScale = scaleLinear(
    [xTicks[0], xTicks.last],
    [padding.left, width - padding.right]
  );
  $: yScale = scaleLinear(
    [yTicks[0], yTicks.last],
    [height - padding.bottom, padding.top]
  );
</script>

<div {style} class="chart" bind:this={chart}>
  <svg>
    <!-- y axis -->
    <g class="axis y-axis">
      <text dominant-baseline="hanging">{yLabel}</text>
      {#each yTicks.slice(0, yTicks.length - 1) as tick, i}
        <g class="tick tick-{i}" transform="translate(0, {yScale(tick)})">
          <line x2="100%" />
          <text y="-4">{tick}</text>
        </g>
      {/each}
    </g>

    <!-- x axis -->
    <g class="axis x-axis">
      {#each xTicks as tick, i}
        <g class="tick tick-{i}" transform="translate({xScale(tick)},{height})">
          <line
            y2="-{height - padding.top}"
            y1="-{padding.bottom}"
            x1="0"
            x2="0" />
          <text>{tick}</text>
        </g>
      {/each}
      <text x="100%" y="98%" text-anchor="end">{xLabel}</text>
    </g>

    <!-- data -->
    <g class="data">
      {#if type == 'line'}
        <path
          d={`M${points
            .map(p => `${xScale(p.x)},${yScale(p.y)}`)
            .join('L')}`} />
      {:else}
        {#each points as p}
          <circle cx={xScale(p.x)} cy={yScale(p.y)} r="4" />
        {/each}
      {/if}
    </g>
  </svg>

</div>

<style>
  .chart {
    position: relative;
  }
  svg {
    width: 100%;
    height: 100%;
  }

  .axis line {
    stroke: var(--corporate-emerald);
  }

  .tick line {
    stroke: #aaa;
    stroke-dasharray: 3;
  }

  .y-axis .tick-0 line {
    stroke-dasharray: 0;
  }

  .x-axis .tick text {
    text-anchor: middle;
  }

  .data path {
    fill: none;
    stroke: var(--corporate-emerald);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
    transition: 0.3s;
  }
  .data circle {
    fill: var(--corporate-emerald);
  }
</style>
