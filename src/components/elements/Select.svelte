<script>
  export let onChange;
  export let options;
  export let disabled;
  export let value;
  export let name;
  export let defaultOption;

  $: active = value !== void 0;

  function selectOption(e) {
    const {name, value} = e.currentTarget;
    // selected = options[v];
    onChange(value, name);
  }
</script>

<select {name} class:active {disabled} on:change={selectOption}>
  <option value="" hidden disabled selected={value === void 0}>{defaultOption.label}</option>
  {#each options as option}
    <option value={option.id} selected={value === option.id}>
      {#if option.icon}
        <i class="icon icon-{option.icon}" />
      {/if}
      {option.label}
    </option>
  {/each}
</select>

<style>
  select {
    height: 3.2rem;
    width: 100%;
    font-size: 2rem;
    line-height: 1.5;
    margin: 8px 0;
    border: 1px solid var(--corporate-blue-darken);
  }
  select.active {
    background-color: var(--corporate-blue-darken);
    color: var(--bg-color);
  }
</style>
