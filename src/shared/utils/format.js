export function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return '0%';
  }

  return `${Math.round(value)}%`;
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value ?? 0);
}

export function labelFromOptions(options, value, fallback = 'Sin definir') {
  return options.find((item) => item.value === value)?.label ?? fallback;
}
