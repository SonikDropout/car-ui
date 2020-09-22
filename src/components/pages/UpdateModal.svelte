<script>
  import { ipcRenderer } from 'electron';
  import Spinner from '../elements/Spinner';
  let showModal = true,
    isUpdating;
  function startUpdate() {
    ipcRenderer.send('updateProgramm');
    isUpdating = true;
  }
  function closeModal() {
    showModal = false;
  }
</script>

{#if showModal}
  <div class="modal">
    <div class="modal-body">
      <h2>
        {#if !isUpdating}Доступно обновление!{:else}Обновление программы...{/if}
      </h2>
      {#if isUpdating}
        <Spinner size="lg" />
      {:else}
        <p>Обновить сейчас?</p>
        <div class="buttons">
          <button on:click={startUpdate}>Да</button>
          <button on:click={closeModal}>Нет</button>
        </div>
      {/if}

    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9004;
  }
  .modal-body {
    margin: auto;
    width: 50vw;
    height: 50vh;
    background-color: var(--bg-color);
    border-radius: 8px;
    padding: 4.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  h2 {
    margin-bottom: auto;
  }
  .buttons {
    margin-top: 3rem;
  }
</style>
