<script>
  import { driveMode, rpm } from "../stores";
  import { GROUND_RESISTANCE, __ } from "../../constants";
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
  }

  div {
    width: 50%;
  }
</style>

<footer>
  <div>
    <span>{__('ground type')}:</span>
    <strong>{resistance.toLowerCase()}</strong>
  </div>
  <div>
    <span>{__('rpm')}: </span>
    <strong>{$rpm}</strong>
  </div>
</footer>
