<script>
  export let onChange;
  export let options;
  export let value;
  export let name;
  export let defaultOption;

  $: options.forEach(truncateOption);

  function truncateOption(option) {
    option.visibleLabel =
      option.label.substr(0, 16) + (option.label.length > 16 ? '...' : '');
  }

  $: active = value !== void 0;

  function selectOption(e) {
    const { name, value } = e.currentTarget;
    // selected = options[v];
    onChange(value, name);
  }
</script>

<select {name} class:active on:change={selectOption}>
  <option class="default" hidden disabled selected={value === void 0}>
    {defaultOption.label}
  </option>
  {#each options as option}
    <option
      value={option.id}
      title={option.label}
      selected={value === option.id}>
      {option.visibleLabel}
    </option>
  {/each}
</select>

<style>
  select {
    height: 3.2rem;
    width: 100%;
    padding: 0 1rem;
    margin: 8px 0;
    border: 1px solid var(--corporate-blue-darken);
    background-color: var(--bg-color);
    color: var(--text-color);
    outline: none;
    border-radius: 2px;
    font: italic 300 2rem/1.5 'Montserrat';
  }
  select.active {
    background-color: var(--corporate-blue-darken);
    color: var(--bg-color);
    font-weight: normal;
    font-style: normal;
  }

  option {
    font-style: normal;
    font-weight: normal;
  }
</style>
