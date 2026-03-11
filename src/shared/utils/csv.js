export function parseCsv(text) {
  const rows = [];
  let current = '';
  let row = [];
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (character === '"') {
      if (insideQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === ',' && !insideQuotes) {
      row.push(current.trim());
      current = '';
      continue;
    }

    if ((character === '\n' || character === '\r') && !insideQuotes) {
      if (character === '\r' && next === '\n') {
        index += 1;
      }
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = '';
      continue;
    }

    current += character;
  }

  if (current.length || row.length) {
    row.push(current.trim());
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const [headers, ...dataRows] = rows;
  return dataRows
    .filter((cells) => cells.some((value) => String(value ?? '').trim().length > 0))
    .map((cells) =>
      headers.reduce((acc, header, index) => {
        acc[header] = cells[index] ?? '';
        return acc;
      }, {})
    );
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'));
    reader.readAsText(file);
  });
}
