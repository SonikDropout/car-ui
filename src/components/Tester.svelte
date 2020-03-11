<script>
  import Chart from "./elements/Chart";

  const timeStart = Date.now();

  let xPoints = [0];
  let yPoints = [45];

  function noise(seed) {
    return seed + (0.6 - Math.random()) * 5;
  }

  function update() {
    yPoints = yPoints.concat(noise(yPoints.last));
    xPoints = xPoints.concat((Date.now() - timeStart) / 1000);
  }

  setInterval(update, 1000);
</script>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-column-gap: 1.6rem;
    grid-template-rows: repeat(3, auto);
    padding: 2rem;
  }

  main :global(.chart) {
    grid-area: 2 / 2 / 4 / 10;
  }
</style>

<main>
  <Chart xCaption="Время, с" yCaption="Ток, А" {xPoints} {yPoints} />
</main>
