<script>
  export let selected;
  // export let selectedY;
  export let title;
  export let XOptions;
  export let YOptions;
  export let onChange;
  export let name;

  // DOMElement representing currently active select
  let currentlyActive, xSelect, ySelect;

  $: selectedX = selected.x && selected.y ? selected.x.label : "-- Ось x --";
  $: selectedY = selected.y ? selected.y.label : "-- Ось y --";

  $: active = selected.x && selected.y;

  function showOptions(e) {
    if (currentlyActive === e.currentTarget) currentlyActive = null;
    else currentlyActive = e.currentTarget;
    document.body.addEventListener("click", handleClickOutside);
  }

  function handleClickOutside(e) {
    if (currentlyActive && !currentlyActive.contains(e.target))
      currentlyActive = null;
    document.body.removeEventListener("click", handleClickOutside);
  }
</script>

<style>
  fieldset {
    border: none;
    padding-top: 0;
    padding-left: 0;
    padding-right: 1rem;
  }

  legend {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 2rem;
    color: var(--bg-color);
  }

  .select {
    position: relative;
    width: 100%;
    margin-bottom: 0.4rem;
  }

  .options {
    width: 100%;
    z-index: 1000;
    list-style-type: none;
    background-color: white;
    border-radius: 0 0 4px 4px;
    border: 1px solid var(--corporate-blue-darken);
    border-top: none;
    position: absolute;
    top: 100%;
    visibility: hidden;
    padding: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
    transition: 0.3s ease-in;
    max-height: 0;
  }

  .options.visible {
    max-height: 700%;
    opacity: 1;
    visibility: visible;
  }

  li {
    padding: 0.8rem;
  }

  li:hover {
    background-color: var(--corporate-blue);
    color: white;
  }

  li,
  .selected {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .selected {
    border: 1px solid var(--corporate-blue-darken);
    border-radius: 4px;
    background-color: white;
    height: 4rem;
    line-height: 4rem;
    padding-left: 0.8rem;
  }

  .selected::after {
    content: "";
    border: 5px solid transparent;
    border-top-color: var(--corporate-blue);
    border-bottom-width: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.6rem;
    transform-origin: center center;
    transition: 0.3s ease-in-out;
  }

  .select.active > .selected {
    color: white;
    background-color: var(--corporate-blue-darken);
  }

  .select.open > .selected::after {
    transform: translateY(-50%) rotate(180deg);
  }

  .select.open .selected {
    border-radius: 4px 4px 0 0;
  }
</style>

<fieldset>
  <legend>{title}</legend>
  <div
    class="select"
    class:active
    class:open={currentlyActive === xSelect}
    bind:this={xSelect}
    on:click={showOptions}
    data-axis="X">
    <div class="selected">{selectedX}</div>
    <ul
      class="options"
      class:visible={currentlyActive && currentlyActive.dataset.axis == 'X'}
      on:click={e => onChange('X', name, e.target.dataset.value)}>
      {#each Object.entries(XOptions) as [value, option]}
        <li class="option" data-value={value}>
          <i class="icon icon-${option.icon}" />
          {option.label}
        </li>
      {/each}
    </ul>
  </div>
  <div
    class="select"
    class:active
    class:open={currentlyActive === ySelect}
    bind:this={ySelect}
    on:click={showOptions}
    data-axis="Y">
    <div class="selected">{selectedY}</div>
    <ul
      class="options"
      class:visible={currentlyActive && currentlyActive.dataset.axis == 'Y'}
      on:click={e => onChange('Y', name, e.target.dataset.value)}>
      {#each Object.entries(YOptions) as [value, option]}
        <li class="option" data-value={value}>
          <i class="icon icon-${option.icon}" />
          {option.label}
        </li>
      {/each}
    </ul>
  </div>
</fieldset>
