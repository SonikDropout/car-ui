<script>
  export let options;
  export let value;
  export let name;
  export let label;
</script>

<div class="radio-group">
  <span class="group-label">{label}</span>
  {#each options as element}
    <label>
      <input
        class="hidden"
        type="radio"
        {name}
        on:change
        bind:group={value}
        value={element.id} />
      <span class="label">{element.label}</span>
    </label>
  {/each}
</div>

<style>
  .radio-group {
    margin-bottom: 0.8rem;
  }
  .group-label {
    font-weight: 500;
    margin-right: 0.4rem;
  }
  input:checked + .label {
    background-color: var(--corporate-blue);
    color: var(--bg-color);
    border-color: var(--corporate-blue);
    font-weight: 500;
  }
  .label {
    position: relative;
    display: inline-block;
    margin-right: 0.4rem;
    margin-bottom: 0.8rem;
    height: 3.2rem;
    line-height: 3.2rem;
    white-space: nowrap;
    border-radius: 0.4rem;
    border: 0.1rem solid var(--text-color);
    padding: 0 0.8rem;
  }
</style>
