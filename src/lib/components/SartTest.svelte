<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { createEventDispatcher, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  // --- SART Spezifikation (nach Ruwens Plan) ---
  type Trial = {
    index: number;
    digit: number;        // 1-9
    isNoGo: boolean;      // digit === 3
    responded: boolean;
    rtMs: number | null;
  };

  const N_TRIALS = 45; // Gekürzt für den Prototyp (statt 90)
  const TRIAL_MS = 1000; // 1s pro Zahl
  const NOGO_DIGIT = 3;

  let trials: Trial[] = [];
  let currentIndex = 0;
  let testRunning = false;
  let trialStartTime = 0;
  let timer: any = null;
  let currentDigit = 0; // Was der Nutzer sieht

  // --- 1. Trials generieren ---
  function generateTrials(): Trial[] {
    let generatedTrials: Trial[] = [];
    // (Simpel-Implementierung: 1/9 Chance für eine 3)
    for (let i = 0; i < N_TRIALS; i++) {
      const digit = Math.floor(Math.random() * 9) + 1;
      generatedTrials.push({
        index: i,
        digit: digit,
        isNoGo: digit === NOGO_DIGIT,
        responded: false,
        rtMs: null,
      });
    }
    return generatedTrials;
  }

  // --- 2. Test-Ablauf ---
  function startTest() {
    trials = generateTrials();
    currentIndex = 0;
    testRunning = true;
    nextTrial();
  }

  function nextTrial() {
    if (currentIndex >= trials.length) {
      stopTest();
      return;
    }

    const trial = trials[currentIndex];
    currentDigit = trial.digit; // Zahl im UI anzeigen
    trialStartTime = performance.now(); // Zeitmessung starten

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      currentIndex += 1;
      nextTrial();
    }, TRIAL_MS);
  }

  // --- 3. Reaktions-Handler ---
  function handleRespond() {
    if (!testRunning || currentIndex >= trials.length) return;

    const trial = trials[currentIndex];
    const now = performance.now();
    const rt = now - trialStartTime;

    if (!trial.responded) { // Nur erste Reaktion zählen
      trial.responded = true;
      trial.rtMs = rt;
    }

    // Bei Reaktion SOFORT zum nächsten Trial
    currentIndex += 1;
    nextTrial();
  }

  // --- 4. Test-Ende & Berechnung (Ruwens Spezifikation) ---
  async function stopTest() {
    testRunning = false;
    currentDigit = 0;
    if (timer) clearTimeout(timer);

    const metrics = computeSartMetrics(trials);
    const sessionId = await saveSartSession(metrics);

    // Daten an die Hauptseite (+page.svelte) senden
    dispatch('testComplete', { metrics, sessionId });
  }

  function computeSartMetrics(trials: Trial[]) {
    let goTrials = trials.filter(t => !t.isNoGo);
    let noGoTrials = trials.filter(t => t.isNoGo);

    const ceCount = noGoTrials.filter(t => t.responded).length;
    const oeCount = goTrials.filter(t => !t.responded).length;
    const goCount = goTrials.length;
    const noGoCount = noGoTrials.length;

    const rts = goTrials.filter(t => t.responded && t.rtMs !== null).map(t => t.rtMs!);
    const meanRtMs = rts.length ? rts.reduce((a,b) => a + b, 0) / rts.length : 0;
    const sdRtMs = 0; // (SD-Berechnung für Prototyp übersprungen)

    const ceRate = noGoCount ? ceCount / noGoCount : 0;
    const oeRate = goCount ? oeCount / goCount : 0;
    const speedScore = meanRtMs ? Math.max(0, Math.min(100, (700 - meanRtMs) / 4)) : 50;
    const stabilityScore = 50; // (Übersprungen)

    const inhibitionComponent  = 100 * (1 - ceRate);
    const vigilanceComponent   = 100 * (1 - oeRate);

    const score = 0.35 * inhibitionComponent + 0.25 * vigilanceComponent + 0.25 * speedScore + 0.15 * stabilityScore;

    return {
      ceCount, oeCount, goCount, noGoCount,
      meanRtMs: Math.round(meanRtMs),
      sdRtMs,
      score: Math.round(score)
    };
  }

  // --- 5. Supabase-Insert (Ruwens Spezifikation) ---
  async function saveSartSession(metrics: any) {
    const { data, error } = await supabase
      .from('sart_sessions')
      .insert({
        ce_count: metrics.ceCount,
        oe_count: metrics.oeCount,
        go_count: metrics.goCount,
        nogo_count: metrics.noGoCount,
        mean_rt_ms: metrics.meanRtMs,
        sd_rt_ms: metrics.sdRtMs,
        score: metrics.score
      })
      .select('id') // WICHTIG: die ID zurückgeben
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data.id; // Die Session-ID für das Screentime-Formular
  }

  // Timer aufräumen
  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });

  // Beim Laden der Komponente Test starten
  startTest();
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body items-center text-center">
    <h2 class="card-title">Test läuft...</h2>

    <div class="min-h-[200px] flex items-center justify-center my-4 p-4 border rounded-box w-full">
      {#if testRunning}
        <div class="font-mono text-9xl">{currentDigit}</div>
      {:else}
        <p>Test wird beendet...</p>
      {/if}
    </div>

    <div class="card-actions w-full">
      <button class="btn btn-secondary w-full" on:click={handleRespond}>Reagieren</button>
    </div>
  </div>
</div>