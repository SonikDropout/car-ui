<script>
  import {__} from '../../constants';
  export let message = __("try reloading");
  export let onConfirm;
  export let title = __("error");
</script>

<section>
  <div>
    <i class="icon icon-exclamation" />
    <h2>{title}</h2>
    <p>{message}</p>
    <button on:click={onConfirm}>{__('try again')}</button>
  </div>
</section>

<style>
  .icon {
    color: var(--danger-color);
    font-size: 8rem;
    margin-bottom: 2rem;
    margin-top: auto;
  }
  h2 {
    color: var(--danger-color);
    font-size: 2.4rem;
    text-align: center;
    margin-bottom: 0;
  }
  p {
    font-size: 1.6rem;
    text-align: center;
  }
  section {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    z-index: 9999;
  }
  div {
    margin: auto;
    background-color: white;
    height: 85vh;
    width: 90vh;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    display: flex;
    padding: 2.4rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  button {
    background-color: var(--corporate-orange);
    margin-top: auto;
    margin-bottom: 4rem;
    box-shadow: 0 3px 0 var(--corporate-grey);
  }
  button:active {
    box-shadow: 0 2px 0 var(--corporate-grey-darken);
  }
</style>
