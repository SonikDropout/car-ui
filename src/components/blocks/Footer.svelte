<script>
  import { driveMode, rpm } from "../stores";
  import { GROUND_RESISTANCE } from "../../constants";
  let resistance;
  driveMode.subscribe(res => (resistance = GROUND_RESISTANCE[res].label));
</script>

<style>
  footer {
    display: flex;
    height: 5rem;
    line-height: 5rem;
    font-size: 1.6rem;
    padding: 0 9%;
    color: var(--bg-color);
  }

  div {
    width: 50%;
  }
</style>

<footer>
  <div>
    <span>Сопротивление грунта:</span>
    <strong>{resistance.toLowerCase()}</strong>
  </div>
  <div>
    <span>Скорость вращения колес, об/мин: </span>
    <strong>{$rpm}</strong>
  </div>
</footer>
