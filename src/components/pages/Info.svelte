<script>
  import Dashboard from "../blocks/Dashboard";
  import Graph from "../blocks/Graph";
  import Characteristics from "../blocks/Characteristics";
  const blocks = {
    Graph,
    Dashboard,
    Characteristics,
  };
  let idx = 1;

  function switchBlock(blockName) {
    idx = Object.keys(blocks).indexOf(blockName);
  }
</script>

<style>
  .content {
    width: 300vw;
    display: flex;
    transition: transform .5s;
  }
</style>

<div class="content" style="transform:translateX(-{idx * 100}vw)">
  {#each Object.values(blocks) as Block}
    <Block {switchBlock} />
  {/each}
</div>
