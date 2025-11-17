<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { createEventDispatcher } from 'svelte';
  export let sartSessionId: string | null;
  const dispatch = createEventDispatcher();

  let totalMinutes = 0;
  let activations = 0;
  let app1Name = "TikTok";
  let app1Activations = 0;

  let ladeMeldung = '';

  async function saveScreentime() {
    if (!sartSessionId) {
      ladeMeldung = 'Fehler: Keine Session-ID vorhanden!';
      return;
    }
    ladeMeldung = 'Speichere...';

    const { error } = await supabase
      .from('screentime_reports')
      .insert({
        session_id: sartSessionId,
        total_minutes: totalMinutes,
        activations: activations,
        app1_name: app1Name,
        app1_activations: app1Activations,
      });

    if (error) {
      ladeMeldung = 'Fehler: ' + error.message;
    } else {
      ladeMeldung = 'Gespeichert!';
      dispatch('formComplete');
    }
  }
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Letzter Schritt: Screentime</h2>
    <p>Trage jetzt deine manuell abgelesenen Daten ein:</p>

    <div class="form-control w-full">
      <label class="label" for="totalMin">
        <span class="label-text">Gesamte Bildschirmzeit (Minuten)</span>
      </label>
      <input id="totalMin" type="number" class="input input-bordered" bind:value={totalMinutes} />
    </div>

    <div class="form-control w-full">
      <label class="label" for="activations">
        <span class="label-text">Aktivierungen (Handy entsperrt)</span>
      </label>
      <input id="activations" type="number" class="input input-bordered" bind:value={activations} />
    </div>
    
    <div class="card-actions justify-end mt-4">
      <p class="text-sm">{ladeMeldung}</p>
      <button class="btn btn-primary" on:click={saveScreentime}>Speichern & Beenden</button>
    </div>
  </div>
</div>