<script>
  import {
    scaleLinear,
    niceTicks,
    findClosest,
    findClosestIndex
  } from "../../utils/numagic";
  import {getOffsetY, getOffsetX} from '../../utils/DOM';
  export let yPoints = [];
  export let xPoints = []; // this array must be sorted!!
  export let xCaption;
  export let yCaption;
  export let type = "line";

  let cursorX,
    cursorY,
    chart,
    curPoint,
    zoomStart,
    zoomEnd,
    zoomedArea,
    isPanMode = false,
    panStart;

  $: width = chart ? chart.clientWidth : 440;
  $: height = chart ? chart.clientHeight : 240;
  $: chartX = chart ? getOffsetX(chart) : 0;
  $: chartY = chart ? getOffsetY(chart) : 0;

  const padding = { top: 20, right: 25, bottom: 40, left: 40 };

  $: isInitialized = xPoints.length > 1 && yPoints.length > 1;

  $: minY = Math.min.apply(null, zoomedArea ? zoomedArea.y : yPoints);
  $: maxY = Math.max.apply(null, zoomedArea ? zoomedArea.y : yPoints);
  $: yTicks = niceTicks([minY, maxY], 5, true);
  $: xTicks = niceTicks(
    zoomedArea
      ? [zoomedArea.x[0], zoomedArea.x.last]
      : [xPoints[0], xPoints.last],
    5
  );

  $: xScale = scaleLinear(
    [xTicks[0], xTicks.last],
    [padding.left, width - padding.right]
  );
  $: yScale = scaleLinear(
    [yTicks[0], yTicks.last],
    [height - padding.bottom, padding.top]
  );

  $: pathXPoints = zoomedArea ? zoomedArea.x : xPoints;
  $: pathYPoints = zoomedArea ? zoomedArea.y : yPoints;

  const handlePointerDown = e => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (isPanMode) {
      panStart = e.clientX;
    } else {
      setZoomStart(e);
    }
  };

  const handlePointerMove = e => {
    if (!isNaN(panStart)) {
      panChart(e);
    } else if (!isNaN(zoomStart)) {
      setZoomEnd(e);
    }
    highlightPoint(e);
  };

  const handlePointerUp = e => {
    if (!isNaN(panStart)) {
      releasePan(e);
    } else if (!isNaN(zoomStart)) {
      zoomChart(e);
    }
  };

  // start ZOOM related logic block
  const setZoomStart = e => {
    e.preventDefault();
    zoomStart = e.clientX - chartX;
    console.log(chartX, zoomStart);
  };

  const setZoomEnd = e => {
    const end = e.clientX - chartX;
    zoomEnd = Math.max(Math.min(end, width), 0);
  };

  const zoomChart = e => {
    setZoomedArea(findZoomBorders(e));
    unsetZoomBorders();
    releaseZoom(e);
  };

  const unsetZoomBorders = () => {
    zoomStart = zoomEnd = undefined;
  };

  const findZoomBorders = e => {
    const zoomStartIndex = findClosestIndex(xPoints, xScale.invert(zoomStart));
    const zoomEndIndex = findClosestIndex(xPoints, xScale.invert(zoomEnd));
    const left = Math.min(zoomStartIndex, zoomEndIndex);
    const right = Math.max(zoomStartIndex, zoomEndIndex);
    return [left, right];
  };

  const setZoomedArea = ([start, end]) => {
    if (end - start < 2) return;
    zoomedArea = {
      x: xPoints.slice(start, end),
      y: yPoints.slice(start, end),
      sliceStart: start,
      sliceEnd: end
    };
    zoomedArea.step = Math.ceil(
      (zoomedArea.x[zoomedArea.x.length - 1] - zoomedArea.x[0]) / (end - start)
    );
  };

  const releaseZoom = e => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const revertZoom = e => {
    e.stopPropagation();
    isPanMode = false;
    zoomedArea = null;
  };
  // end ZOOM related logic block

  // start PAN logic block
  const panChart = e => {
    e.preventDefault();
    const diff = e.clientX - panStart;
    const additive = -Math.ceil(diff / zoomedArea.step);
    zoomedArea.sliceStart += additive;
    zoomedArea.sliceEnd += additive;
    if (zoomedArea.sliceStart < 0 || zoomedArea.sliceEnd > xPoints.length)
      return;
    zoomedArea.x = xPoints.slice(zoomedArea.sliceStart, zoomedArea.sliceEnd);
    zoomedArea.y = yPoints.slice(zoomedArea.sliceStart, zoomedArea.sliceEnd);
    panStart = e.clientX;
  };

  const releasePan = e => {
    panStart = void 0;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const setPanMode = e => {
    e.stopPropagation();
    isPanMode = !isPanMode;
  };
  // end PAN logick block

  // strat POINT highlight block
  const removePointTooltip = () => {
    cursorX = cursorY = undefined;
    curPoint = null;
  };

  $: if (!isNaN(cursorX) && !isNaN(cursorY)) {
    const goal = xScale.invert(cursorX);
    const x = findClosest(xPoints, goal);
    curPoint = {
      x: xScale(x),
      y: yScale(yPoints[xPoints.indexOf(x)])
    };
  }

  const highlightPoint = e => {
    e.preventDefault();
    cursorX = e.clientX - chartX;
    cursorY = e.clientY - chartY;
  };
</script>

<style>
  .chart {
    position: relative;
  }
  svg, .chart-inner {
    width: 100%;
    height: 100%;
  }
  svg.move {
    cursor: all-scroll;
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

  .zoom-preview line {
    stroke: var(--corporate-emerald);
  }

  .zoom-preview path {
    fill: rgba(55, 171, 184, 0.3);
    stroke: none;
  }

  .chart-controls {
    position: absolute;
    right: 10px;
    top: 10px;
    --size: 3.2rem;
  }

  .chart-controls a {
    border: 1px solid var(--text-color);
    border-radius: 2px;
    background-color: var(--bg-color);
    color: var(--text-color);
    text-decoration: none;
    width: var(--size);
    height: var(--size);
    display: inline-block;
    line-height: var(--size);
    font-size: 2rem;
    text-align: center;
  }

  .chart-controls a:hover {
    background-color: var(--corporate-blue-darken);
    color: var(--bg-color);
    border-color: var(--bg-color);
  }
</style>

<div class="chart">
  <div class="chart-inner" bind:this={chart}>
    {#if isInitialized}
      <svg
        class:move={isPanMode}
        on:pointerleave={removePointTooltip}
        on:pointerdown={handlePointerDown}
        on:pointermove={handlePointerMove}
        on:pointerup={handlePointerUp}>
        <!-- y axis -->
        <g class="axis y-axis">
          <text dominant-baseline="hanging">{yCaption}</text>
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
            <g
              class="tick tick-{i}"
              transform="translate({xScale(tick)},{height})">
              <line
                y2="-{height - padding.top}"
                y1="-{padding.bottom}"
                x1="0"
                x2="0" />
              <text y="-20">{tick}</text>
            </g>
          {/each}
          <text x="100%" y="98%" text-anchor="end">{xCaption}</text>
        </g>

        <g class="zoom-preview">
          {#if !isNaN(zoomStart)}
            <line
              class="zoom-border"
              y1="0"
              y2={height - padding.bottom}
              x1={zoomStart}
              x2={zoomStart} />
          {/if}
          {#if !isNaN(zoomEnd)}
            <line
              class="zoom-border"
              y1="0"
              y2={height - padding.bottom}
              x1={zoomEnd}
              x2={zoomEnd} />
            <path
              class="zoom-area"
              d="M{zoomStart} 0H{zoomEnd}V{height - padding.bottom}H{zoomStart}Z" />
          {/if}
        </g>

        <!-- data -->
        <g class="data">
          {#if type == 'line'}
            <path
              d={`M${xPoints
                .map((p, i) => `${xScale(p)},${yScale(yPoints[i])}`)
                .join('L')}`} />
            {#if curPoint}
              <circle cx={curPoint.x} cy={curPoint.y} r="2" />
              <rect
                x={curPoint.x - 25}
                y={curPoint.y - 25}
                fill="#fff"
                width="100"
                height="20"
                stroke="#aaa" />
              <text
                x={curPoint.x + 25}
                y={curPoint.y - 20}
                text-anchor="middle"
                alignment-baseline="hanging">
                {xScale.invert(curPoint.x).toPrecision(3)} : {xScale
                  .invert(curPoint.y)
                  .toPrecision(3)}
              </text>
            {/if}
          {:else}
            {#each pathXPoints as x, i}
              <circle cx={xScale(x)} cy={yScale(pathYPoints[i])} r="4" />
            {/each}
          {/if}
        </g>
      </svg>
    {/if}

    {#if zoomedArea}
      <div class="chart-controls">
        <a on:click={revertZoom} href="#chart" class="fa fa-undo" title="revert">
          <i class="icon icon-revert" /> 
        </a>
        <a on:click={setPanMode} href="#chart" class="fa fa-arrows" title="pan">
          <i class="icon icon-{isPanMode ? 'zoom' : 'pan'}" /> 
        </a>
      </div>
    {/if}
  </div>
</div>
