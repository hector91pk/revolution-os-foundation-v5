export const scaffoldModuleConfigs = {
  administration: {
    summary: 'Altas, bajas, cambios de membresía, cobros y procesos de back-office.',
    goals: ['Altas y bajas', 'Facturas y cobros', 'Morosos y seguimiento', 'Bonos y cambios'],
    integrations: ['Virtuagym', 'Email', 'Facturación / banco'],
  },
  operations: {
    summary: 'Centros, incidencias, mantenimiento, sustituciones y coordinación diaria.',
    goals: ['Incidencias de centro', 'Material y stock', 'Sustituciones', 'Mejoras de instalaciones'],
    integrations: ['Planner', 'WhatsApp', 'Virtuagym'],
  },
  students: {
    summary: 'Ficha unificada del alumno con estado administrativo, comercial y deportivo.',
    goals: ['Ficha alumno', 'Historial completo', 'Incidencias', 'Comunicaciones'],
    integrations: ['CRM', 'Virtuagym', 'Método'],
  },
  method: {
    summary: 'Pedagogía, niveles, progresión, evaluación y gamificación del método R-evolution.',
    goals: ['Niveles y habilidades', 'Evaluación', 'Cromos y logros', 'Conexión con cuadernos'],
    integrations: ['App de retos', 'Alumnos', 'Documentación'],
  },
  events: {
    summary: 'Cumpleaños, talleres, campus y reservas de servicios especiales.',
    goals: ['Reservas especiales', 'Pagos', 'Seguimiento y confirmaciones'],
    integrations: ['CRM', 'Planner', 'Cobros'],
  },
  marketing: {
    summary: 'Canales de captación, campañas, contenidos y reporting de adquisición.',
    goals: ['Google Ads', 'Meta Ads', 'Landing pages', 'Leads por fuente'],
    integrations: ['CRM', 'Ads', 'Analytics'],
  },
  documentation: {
    summary: 'Manual comercial, SOPs, protocolos y base documental futura para IA / RAG.',
    goals: ['Manuales', 'FAQs', 'Scripts de respuesta', 'Historial de procesos'],
    integrations: ['Inbox', 'IA / RAG'],
  },
  reporting: {
    summary: 'KPIs comerciales, marketing, ocupación, centros y visión global de negocio.',
    goals: ['KPIs comerciales', 'KPIs por centro', 'Ocupación', 'Conversión'],
    integrations: ['CRM', 'Planner', 'Marketing', 'Virtuagym'],
  },
};
