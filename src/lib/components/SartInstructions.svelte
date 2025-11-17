<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">SART-Anleitung</h2>
    <ul class="list-disc list-inside space-y-2 my-4">
      <li>Es werden Zahlen von 1 bis 9 eingeblendet.</li>
      <li>Reagiere auf <strong>jede Zahl</strong> (Tippen)!</li>
      <li><strong>AUSNAHME:</strong> Bei der <strong>3</strong> NICHT reagieren!</li>
      <li>Der Test dauert ca. 1 Minute.</li>
    </ul>
    <div class="card-actions justify-end">
      <button class="btn btn-primary" on:click={() => dispatch('startTest')}>Test starten</button>
    </div>
  </div>
</div>