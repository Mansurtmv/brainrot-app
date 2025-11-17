<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let metrics: any; // Daten kommen von der Hauptseite
  const dispatch = createEventDispatcher();
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Test-Ergebnis</h2>
    
    <div class="stats stats-vertical shadow my-4">
      <div class="stat">
        <div class="stat-title">BrainScore (SART)</div>
        <div class="stat-value">{metrics.score}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Fehler (auf "3" geklickt)</div>
        <div class="stat-value">{metrics.ceCount}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Fehler (Auslassungen)</div>
        <div class="stat-value">{metrics.oeCount}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Mittlere Reaktionszeit</div>
        <div class="stat-value">{metrics.meanRtMs} ms</div>
      </div>
    </div>

    <div class="card-actions justify-end">
      <button class="btn btn-primary" on:click={() => dispatch('next')}>Weiter</button>
    </div>
  </div>
</div>