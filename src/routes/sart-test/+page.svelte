<script lang="ts">
  // Importiere die Komponenten, die wir gleich erstellen
  import SartInstructions from '$lib/components/SartInstructions.svelte';
  import SartTest from '$lib/components/SartTest.svelte';
  import SartResult from '$lib/components/SartResult.svelte';
  import ScreentimeForm from '$lib/components/ScreentimeForm.svelte';

  // Das ist Ruwens "State-Maschine"
  let step: 'instructions' | 'test' | 'result' | 'screentime' | 'done' = 'instructions';

  // Hier speichern wir die Daten zwischen den Schritten
  let sartMetrics: any = null; // Wird vom Test gefüllt
  let sessionId: string | null = null; // Kommt von Supabase

  function onTestComplete(event: CustomEvent<{ metrics: any; sessionId: string | null; }>) {
    sartMetrics = event.detail.metrics;
    sessionId = event.detail.sessionId;
    step = 'result';
  }
</script>

<div class="max-w-xl mx-auto p-4">

  {#if step === 'instructions'}
    <SartInstructions on:startTest={() => step = 'test'} />

  {:else if step === 'test'}
    <SartTest on:testComplete={onTestComplete} />

  {:else if step === 'result'}
    <SartResult 
      metrics={sartMetrics} 
      on:next={() => step = 'screentime'} 
    />

  {:else if step === 'screentime'}
    <ScreentimeForm 
      sartSessionId={sessionId} 
      on:formComplete={() => step = 'done'} 
    />

  {:else if step === 'done'}
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h2 class="card-title text-success">Danke!</h2>
        <p>Deine Daten wurden erfolgreich übermittelt.</p>
        <a href="/" class="btn btn-primary mt-4">Zurück zur Startseite</a>
      </div>
    </div>
  {/if}

</div>