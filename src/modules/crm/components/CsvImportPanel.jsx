import { useState } from 'react';
import { readFileAsText } from '../../../shared/utils/csv';

export function CsvImportPanel({ onImport }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  async function handleImport() {
    if (!file) {
      setStatus('Selecciona un CSV antes de importar.');
      return;
    }

    try {
      const text = await readFileAsText(file);
      onImport(text);
      setStatus(`Importado: ${file.name}`);
      setFile(null);
    } catch (error) {
      setStatus('No se pudo leer el archivo CSV.');
    }
  }

  return (
    <div className="panel">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Importación</p>
          <h3>IMPORTAR CSV</h3>
          <p className="section-subtitle">
            Compatible con export del formulario de prueba y también con CSV simple: name, email, phone, activity, center, source, notes.
          </p>
        </div>
      </div>

      <label className="file-dropzone">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <div>
          <strong>{file ? file.name : 'Selecciona un archivo CSV'}</strong>
          <p className="muted-copy">Click para elegir archivo</p>
        </div>
      </label>

      <div className="inline-actions top-gap">
        <button className="ghost-button" onClick={handleImport}>
          Importar CSV
        </button>
        {status ? <span className="muted-caption">{status}</span> : null}
      </div>
    </div>
  );
}
