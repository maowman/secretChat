<script lang="ts">
  export let sender: string, time: number, content: string, self: boolean;
  import { onMount } from "svelte";
  let timeString = "";
  onMount(() => {
    const timeObj = new Date();
    timeObj.setTime(time);
    timeString = timeObj.toLocaleString();
  });
</script>

{#if self}
  <div dir="rtl">
    <div class="columns m-0 p-0">
      <div class="column is-one-third m-0 p-0">
        <div class="box my-1 p-1 ">
          <p class="subtitle is-6 m-0">
            <strong>：{sender}</strong>
            <br />
            {content}
            <br />
          </p>
          <p class="subtitle is-7">{timeString}</p>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="columns m-0 p-0">
    <div class="column is-one-third m-0 p-0">
      <div class="box my-1 p-1 ">
        <p class="subtitle is-6 m-0">
          <strong>{sender}：</strong>
          <br />
          {content}
          <br />
        </p>
        <p class="subtitle is-7">{timeString}</p>
      </div>
    </div>
  </div>
{/if}
