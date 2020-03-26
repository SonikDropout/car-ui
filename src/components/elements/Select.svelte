<script>
  import { onMount, onDestroy } from 'svelte';
  export let onChange;
  export let options;
  export let disabled;
  export let selected;
  export let order = 0;
  export let name;

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  function handleClickOutside(e) {
    if (optionsVisible && !select.contains(e.target)) optionsVisible = false;
  }

  // let selected = defaultSelected;

  let optionsVisible = false,
    select;
  const h = 100 * options.length;

  $: active = !selected.label.startsWith('--');

  function toggleOptions() {
    if (disabled) return;
    optionsVisible = !optionsVisible;
  }

  function selectOption(e) {
    optionsVisible = false;
    const v = e.target.dataset.value;
    // selected = options[v];
    onChange(v, name);
  }
</script>

<div class="select-wrapper">
  <div
    style="z-index:{2000 - order}"
    class="select"
    bind:this={select}
    class:disabled
    class:active
    class:expand={optionsVisible}>
    <div class="selected" on:click={toggleOptions}>
      <span class="value">{selected.label}</span>
      <span class="arrow" />
    </div>
    {#if optionsVisible}
      <ul>
        {#each options as { icon, label, id }}
          <li data-value={id} on:click={selectOption} title={label}>
            {#if icon}
              <i class="icon icon-{icon}" />
            {/if}
            {label}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .select-wrapper {
    position: relative;
    height: 3.2rem;
    line-height: 3.2rem;
    width: 100%;
    margin: 8px 0;
  }

  .select {
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid var(--corporate-blue-darken);
    border-radius: 4px;
    background-color: var(--bg-color);
  }

  .select.disabled {
    opacity: 0.8;
  }
  .select.active {
    background-color: var(--corporate-blue-darken);
    color: var(--bg-color);
  }

  .selected {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .value {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .arrow {
    display: block;
    border: 5px solid transparent;
    position: relative;
    top: 3px;
    border-top-color: var(--corporate-blue);
    transition: 0.3s ease;
  }
  .select.active .arrow {
    border-top-color: var(--corporate-blue);
  }
  .select.expand .arrow {
    transform: rotate(180deg) translateY(5px);
  }

  .curr-value,
  li {
    line-height: 3.2rem;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    padding: 0 1rem;
  }

  li :global(.icon) {
    display: inline-block;
    text-align: center;
    min-width: 2.5rem;
  }
</style>
