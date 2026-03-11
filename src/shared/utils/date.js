function pad(value) {
  return String(value).padStart(2, '0');
}

export function parseDateKey(dateKey) {
  if (!dateKey || typeof dateKey !== 'string') {
    return null;
  }

  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function toDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDays(value, amount) {
  const base = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(base.getTime())) {
    return new Date();
  }

  base.setDate(base.getDate() + amount);
  return base;
}

export function addHours(value, amount) {
  const base = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(base.getTime())) {
    return new Date();
  }

  base.setHours(base.getHours() + amount);
  return base;
}

export function startOfDay(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date();
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(value = new Date()) {
  const dayStart = startOfDay(value);
  const day = dayStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  dayStart.setDate(dayStart.getDate() + diff);
  return dayStart;
}

export function startOfWeekKey(value = new Date()) {
  return toDateKey(startOfWeek(value));
}

export function getWeekKeys(value = new Date()) {
  const start = startOfWeek(value);
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(start, index)));
}

export function getMonthGrid(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  const current = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = startOfWeek(current);
  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = addDays(start, index);
    return {
      dateKey: toDateKey(cellDate),
      date: cellDate,
      isCurrentMonth: cellDate.getMonth() === current.getMonth(),
      isToday: toDateKey(cellDate) === todayKey(),
    };
  });
}

export function toDateTimeInputValue(isoValue) {
  if (!isoValue) return '';
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return '';
  return `${toDateKey(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeInputValue(value) {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

export function formatDateLabel(value) {
  if (!value) return 'Sin fecha';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTimeLabel(value) {
  if (!value) return 'Sin fecha';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatWeekdayLabel(dateKey) {
  const date = typeof dateKey === 'string' ? parseDateKey(dateKey) : dateKey;
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).format(date);
}

export function formatRelativeDue(value) {
  if (!value) return 'Sin próxima acción';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin próxima acción';

  const diff = startOfDay(date).getTime() - startOfDay(new Date()).getTime();
  const days = Math.round(diff / 86400000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days === -1) return 'Ayer';
  if (days > 1) return `En ${days} días`;
  return `Hace ${Math.abs(days)} días`;
}

export function isStale(dateString, staleAfterDays = 21) {
  if (!dateString) return true;
  const date = parseDateKey(dateString);
  if (!date) return true;
  const diff = startOfDay(new Date()).getTime() - startOfDay(date).getTime();
  return diff / 86400000 >= staleAfterDays;
}

export function differenceInHours(target, base = new Date()) {
  const targetDate = target instanceof Date ? target : new Date(target);
  const baseDate = base instanceof Date ? base : new Date(base);
  if (Number.isNaN(targetDate.getTime()) || Number.isNaN(baseDate.getTime())) {
    return 0;
  }
  return (targetDate.getTime() - baseDate.getTime()) / 3600000;
}

export function getAgeFromBirthDate(dateOfBirth, referenceDate = new Date()) {
  if (!dateOfBirth) return null;
  const birthDate = typeof dateOfBirth === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
    ? parseDateKey(dateOfBirth)
    : new Date(dateOfBirth);
  const reference = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

  if (!birthDate || Number.isNaN(reference.getTime())) {
    return null;
  }

  let age = reference.getFullYear() - birthDate.getFullYear();
  const monthDiff = reference.getMonth() - birthDate.getMonth();
  const dayDiff = reference.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

export function getAgeGroup(age) {
  if (age === null || age === undefined) return 'desconocida';
  if (age <= 5) return '0-5';
  if (age <= 9) return '6-9';
  if (age <= 13) return '10-13';
  if (age <= 17) return '14-17';
  if (age <= 24) return '18-24';
  if (age <= 34) return '25-34';
  return '35+';
}
