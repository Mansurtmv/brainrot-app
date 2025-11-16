<!-- SCHRITT 1: Das Script MUSS immer ZUERST kommen -->
<script>
  // Importiere deine neue Komponente
  import PipelineTest from '$lib/components/PipelineTest.svelte';
</script>

<!-- SCHRITT 2: Dein HTML-Inhalt -->
<div class="container">
  <h1>BrainrotAI</h1>
  <p>
    Wir arbeiten gerade noch am Herz dieses Hirnstücks...
  </p>

  <img src="/brainman.png" alt="Ein Mensch, der an einem Gehirn hackt">

  <p class="small-text">Bleib dran für mehr Updates!</p>
</div>

<!-- HIER rufen wir die Komponente auf, damit sie UNTER dem Haupt-Container erscheint -->
<PipelineTest />


<!-- SCHRITT 3: Das CSS kommt immer ZULETZT -->
<style>
    :global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh; /* Macht die Seite hoch genug */
    text-align: center;
    background-color: #1a1a1a; /* Dunkler Hintergrund */
    color: #e0e0e0; /* Helle Schrift */
    font-family: 'Arial', sans-serif;
    padding: 20px;
  }

  h1 {
    font-size: 3em;
    color: #4b0872; /* Grüne Überschrift passend zu "hacken" */
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2em;
    max-width: 600px;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .small-text {
    font-size: 0.9em;
    color: #888;
    margin-top: 20px;
  }

  img {
    max-width: 80%;
    height: auto;
    margin-bottom: 30px;
    border-radius: 8px; /* Leicht abgerundete Ecken für das Bild */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Leichter Schatten */
  }
</style>