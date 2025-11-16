<script>
  // Importiere deine Supabase-Verbindung
  import { supabase } from '$lib/supabaseClient';
  
  // Diese Variablen speichern, was der Nutzer eintippt
  let stunden = 0;
  let ladeMeldung = ''; // Für Feedback an den Nutzer

  /**
   * Diese Funktion wird aufgerufen, wenn der Button geklickt wird.
   */
  async function speichereBildschirmzeit() {
    ladeMeldung = 'Speichere Daten...';

    // DEINE IDEE: Wir rechnen Stunden in Minuten um!
    // Genau wie du sagtest: Wir können das umrechnen.
    // Es ist am besten, es *vor* dem Speichern zu tun.
    const minuten = stunden * 60;

    // Das ist der Befehl, um Daten in Supabase zu speichern
    const { data, error } = await supabase
      .from('daily_log') // 1. Wähle deine Tabelle
      .insert([
        { 
          // 2. Wähle die Spalten und die Daten
          screentime_manual_min: minuten 
          // (Wir fügen hier später noch die 'user_id' hinzu)
        }
      ]);

    // 3. Gib dem Nutzer Feedback
    if (error) {
      ladeMeldung = 'Fehler! ' + error.message;
    } else {
      ladeMeldung = `Erfolgreich! ${minuten} Minuten wurden gespeichert.`;
    }
  }
</script>

<div class="test-container">
  <h2>Supabase Test</h2>
  <p>
    Gib hier deine Bildschirmzeit von heute an:
  </p>
  
  <label for="stunden">Bildschirmzeit in Stunden:</label>
  <input 
    id="stunden"
    type="number" 
    bind:value={stunden} 
  />
  
  <button on:click={speichereBildschirmzeit}>
    An Supabase senden
  </button>

  <p class="feedback">{ladeMeldung}</p>
</div>


<style>
  /* ... (dein altes CSS für .container, h1, etc. ist hier oben) ... */

  .test-container {
    padding: 30px;
    margin: 40px auto; /* Etwas Abstand */
    max-width: 600px;
    background-color: #2a2a2a; /* Etwas hellerer Kasten */
    border-radius: 8px;
    border: 1px solid #C71585; /* Rand im "mystischen Lila" */
    text-align: left;
    color: #e0e0e0;
  }

  .test-container label {
    display: block;
    margin-top: 15px;
    font-size: 0.9em;
    color: #aaa;
  }

  .test-container input {
    width: 100%;
    padding: 8px;
    background-color: #333;
    color: #fff;
    border: 1px solid #555;
    border-radius: 4px;
    font-size: 1.1em;
  }

  .test-container button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #C71585; /* Lila Button */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
  }

  .test-container button:hover {
    background-color: #b31273;
  }

  .feedback {
    margin-top: 15px;
    font-size: 0.9em;
    color: #4CAF50; /* Grüne Erfolgs-Farbe */
  }
</style>