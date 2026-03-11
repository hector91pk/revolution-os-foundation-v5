export const PROJECT_STATUS_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'bloqueado', label: 'Bloqueado' },
  { value: 'idea', label: 'Idea' },
  { value: 'archivado', label: 'Archivado' },
];

export const PRIORITY_OPTIONS = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

export const ALIGNMENT_OPTIONS = [
  { value: 'core', label: 'Negocio principal' },
  { value: 'experimental', label: 'Laboratorio / experimental' },
];

export const PLANNER_VIEW_OPTIONS = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
];

export const PLANNER_STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'hecha', label: 'Hecha' },
  { value: 'cancelada', label: 'Cancelada' },
];

export const PLANNER_KIND_OPTIONS = [
  { value: 'task', label: 'Tarea' },
  { value: 'event', label: 'Evento' },
  { value: 'reservation', label: 'Reserva / prueba' },
  { value: 'follow-up', label: 'Seguimiento' },
];

export const LEAD_STAGE_OPTIONS = [
  { value: 'primer-contacto', label: '1 · Primer contacto' },
  { value: 'seguimiento', label: '2 · Seguimiento' },
  { value: 'interes', label: '3 · Interés' },
  { value: 'inactivo', label: '4 · Inactivo' },
  { value: 'pendiente-decision', label: '5 · Pendiente decisión' },
  { value: 'reserva', label: '6 · Reserva' },
  { value: 'alumno', label: '7 · Alumno' },
  { value: 'perdido', label: '8 · Perdido' },
];

export const CONTACT_CHANNEL_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'interno', label: 'Interno' },
];

export const CONTACT_DIRECTION_OPTIONS = [
  { value: 'saliente', label: 'Saliente' },
  { value: 'entrante', label: 'Entrante' },
  { value: 'nota', label: 'Nota interna' },
];

export const LEAD_LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
];

export const LEAD_SOURCE_OPTIONS = [
  { value: 'formulario-web', label: 'Formulario web' },
  { value: 'landing-page', label: 'Landing page' },
  { value: 'google-ads', label: 'Google Ads' },
  { value: 'meta-ads', label: 'Meta Ads' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'recomendacion', label: 'Recomendación' },
  { value: 'colegio', label: 'Colegio / colaboración' },
  { value: 'otro', label: 'Otro' },
];

export const NEXT_ACTION_TYPE_OPTIONS = [
  { value: 'primer-contacto', label: 'Primer contacto' },
  { value: 'seguimiento', label: 'Seguimiento' },
  { value: 'post-prueba', label: 'Post-prueba' },
  { value: 'cierre', label: 'Cierre' },
  { value: 'recepcion', label: 'Coordinar con recepción' },
  { value: 'espera', label: 'Esperar respuesta' },
];

export const RESERVATION_TYPE_OPTIONS = [
  { value: '', label: 'Sin definir' },
  { value: 'clase-prueba', label: 'Clase de prueba' },
  { value: 'entrenamiento-personal', label: 'Entrenamiento personal' },
  { value: 'cumpleanos', label: 'Cumpleaños' },
  { value: 'taller', label: 'Taller' },
  { value: 'campus', label: 'Campus' },
  { value: 'otro', label: 'Otro servicio' },
];

export const REASON_JOINED_OPTIONS = [
  { value: '', label: 'Sin definir' },
  { value: 'cercania', label: 'Cercanía' },
  { value: 'recomendacion', label: 'Recomendación' },
  { value: 'interes-actividad', label: 'Interés en actividad' },
  { value: 'ambiente', label: 'Ambiente' },
  { value: 'precio', label: 'Precio' },
  { value: 'otros', label: 'Otros' },
];

export const REASON_NOT_JOINED_OPTIONS = [
  { value: '', label: 'Sin definir' },
  { value: 'precio', label: 'Precio' },
  { value: 'horario', label: 'Horario' },
  { value: 'distancia', label: 'Distancia' },
  { value: 'falta-tiempo', label: 'Falta de tiempo' },
  { value: 'otra-actividad', label: 'Otra actividad' },
  { value: 'otros', label: 'Otros' },
];

export const INBOX_CHANNEL_OPTIONS = [
  { value: 'formulario', label: 'Formulario web' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'instagram', label: 'Instagram / Meta' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'ads', label: 'Campaña Ads' },
];

export const REQUEST_TYPE_OPTIONS = [
  { value: 'lead', label: 'Lead comercial' },
  { value: 'alumno', label: 'Alumno actual' },
  { value: 'cambio-horario', label: 'Cambio horario' },
  { value: 'baja', label: 'Baja' },
  { value: 'incidencia', label: 'Incidencia' },
  { value: 'evento', label: 'Evento / cumpleaños' },
  { value: 'facturacion', label: 'Facturación' },
  { value: 'moroso', label: 'Moroso' },
  { value: 'consulta-general', label: 'Consulta general' },
  { value: 'tarea-interna', label: 'Tarea interna' },
];

export const INBOX_STATUS_OPTIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'clasificado', label: 'Clasificado' },
  { value: 'derivado', label: 'Derivado' },
  { value: 'resuelto', label: 'Resuelto' },
];

export const ROUTE_TARGET_OPTIONS = [
  { value: 'leads-crm', label: 'CRM / Comercial' },
  { value: 'planner', label: 'Planner / Tareas' },
  { value: 'administration', label: 'Administración' },
  { value: 'operations', label: 'Operaciones' },
  { value: 'events', label: 'Eventos' },
  { value: 'human', label: 'Escalar a humano' },
];

export const AGE_GROUP_OPTIONS = [
  { value: 'all', label: 'Todas las edades' },
  { value: '0-5', label: '0-5' },
  { value: '6-9', label: '6-9' },
  { value: '10-13', label: '10-13' },
  { value: '14-17', label: '14-17' },
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35+', label: '35+' },
  { value: 'desconocida', label: 'Desconocida' },
];

export const ACTIVITY_OPTIONS = [
  { value: '', label: 'Todas / sin definir' },
  { value: 'Parkour', label: 'Parkour' },
  { value: 'Telas aéreas', label: 'Telas aéreas' },
  { value: 'Calistenia', label: 'Calistenia' },
  { value: 'Capoeira', label: 'Capoeira' },
  { value: 'Escalada', label: 'Escalada' },
  { value: 'Entrenamiento personal', label: 'Entrenamiento personal' },
  { value: 'Cumpleaños', label: 'Cumpleaños' },
  { value: 'Taller', label: 'Taller' },
  { value: 'Campus', label: 'Campus' },
];

export const FOUNDATION_MODULE_GROUPS = [
  { id: 'core', label: 'Núcleo operativo' },
  { id: 'prepared', label: 'Preparado para crecer' },
];
