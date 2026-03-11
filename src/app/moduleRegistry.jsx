import { todayKey } from '../shared/utils/date';
import { ControlCenterModule, getControlCenterTitle } from '../modules/control-center';
import { LeadsCrmModule, getCrmTitle } from '../modules/crm';
import { PlannerModule, getPlannerTitle } from '../modules/planner';
import { InboxModule, getInboxTitle } from '../modules/inbox';
import { ScaffoldModule } from '../modules/scaffold/ScaffoldModule';

function createScaffoldEntry({ id, label, description, allowedRoles }) {
  return {
    id,
    label,
    description,
    icon: '◌',
    group: 'prepared',
    status: 'scaffold',
    allowedRoles,
    defaultSubPath: '/',
    getTitle: (subPath, state) => `${label} · ${state.meta.appName ?? 'R-evolution OS'}`,
    Component: (props) => <ScaffoldModule {...props} moduleId={id} title={label} />,
  };
}

export const moduleRegistry = [
  {
    id: 'control-center',
    label: 'Control Center',
    description: 'Dirección, portafolio estratégico, foco y mapa de proyectos.',
    icon: '⌘',
    group: 'core',
    status: 'implemented',
    allowedRoles: ['founder'],
    defaultSubPath: '/',
    getTitle: getControlCenterTitle,
    Component: ControlCenterModule,
  },
  {
    id: 'planner',
    label: 'Planner',
    description: 'Agenda común para tareas, eventos, reservas y seguimientos.',
    icon: '◷',
    group: 'core',
    status: 'implemented',
    allowedRoles: ['founder', 'reception', 'admin'],
    defaultSubPath: `/day/${todayKey()}`,
    getTitle: getPlannerTitle,
    Component: PlannerModule,
  },
  {
    id: 'leads-crm',
    label: 'Leads / CRM',
    description: 'Embudo comercial multi-centro con pipeline, métricas y SLA.',
    icon: '◎',
    group: 'core',
    status: 'implemented',
    allowedRoles: ['founder', 'marketing', 'reception'],
    defaultSubPath: '/dashboard',
    getTitle: getCrmTitle,
    Component: LeadsCrmModule,
  },
  {
    id: 'inbox',
    label: 'Inbox / Router',
    description: 'Bandeja universal con clasificación y derivación por módulo.',
    icon: '✉',
    group: 'core',
    status: 'implemented',
    allowedRoles: ['founder', 'reception', 'admin'],
    defaultSubPath: '/dashboard',
    getTitle: getInboxTitle,
    Component: InboxModule,
  },
  createScaffoldEntry({
    id: 'administration',
    label: 'Administración',
    description: 'Altas, bajas, cobros, documentación y morosos.',
    allowedRoles: ['founder', 'admin'],
  }),
  createScaffoldEntry({
    id: 'operations',
    label: 'Operaciones',
    description: 'Centros, incidencias, mantenimiento y coordinación diaria.',
    allowedRoles: ['founder', 'reception'],
  }),
  createScaffoldEntry({
    id: 'students',
    label: 'Alumnos',
    description: 'Ficha del alumno y estado consolidado futuro.',
    allowedRoles: ['founder'],
  }),
  createScaffoldEntry({
    id: 'method',
    label: 'Método / Pedagogía',
    description: 'Niveles, progresión, evaluación y gamificación.',
    allowedRoles: ['founder'],
  }),
  createScaffoldEntry({
    id: 'events',
    label: 'Eventos',
    description: 'Cumpleaños, talleres, campus y servicios especiales.',
    allowedRoles: ['founder', 'reception'],
  }),
  createScaffoldEntry({
    id: 'marketing',
    label: 'Marketing',
    description: 'Canales, campañas, leads por fuente y reporting.',
    allowedRoles: ['founder', 'marketing'],
  }),
  createScaffoldEntry({
    id: 'documentation',
    label: 'Documentación / SOPs',
    description: 'Manuales, procesos, scripts y base documental.',
    allowedRoles: ['founder', 'admin', 'reception'],
  }),
  createScaffoldEntry({
    id: 'reporting',
    label: 'Reporting / KPIs',
    description: 'Visión global de negocio y métricas por centro.',
    allowedRoles: ['founder', 'admin'],
  }),
];

export const moduleMap = new Map(moduleRegistry.map((module) => [module.id, module]));

export function getFirstAllowedModule(roleId) {
  return moduleRegistry.find((module) => module.allowedRoles.includes(roleId)) ?? moduleRegistry[0];
}
