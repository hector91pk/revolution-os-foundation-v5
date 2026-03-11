import { schedulePostTrialFollowUp, scheduleReservationPlannerEvent } from '../../../core/automations/crmAutomations';
import { createContactEntry, createLeadEntity } from '../../../domain/crm/factories';
import { addDays, addHours, nowIso } from '../../../shared/utils/date';
import { parseLeadPayloadsFromCsv } from './importService';

function defaultCenterId(state) {
  return state.shared.centers?.[0]?.id ?? '';
}

function isDuplicateLead(existingLead, incomingPayload) {
  const sameEmail =
    existingLead.email &&
    incomingPayload.email &&
    existingLead.email.toLowerCase() === incomingPayload.email.toLowerCase();

  const samePhone =
    existingLead.phone &&
    incomingPayload.phone &&
    existingLead.phone.replace(/\s+/g, '') === incomingPayload.phone.replace(/\s+/g, '');

  const sameName =
    existingLead.fullName.trim().toLowerCase() === incomingPayload.fullName.trim().toLowerCase();

  return sameName && (sameEmail || samePhone);
}

export function createLead(state, payload) {
  const lead = createLeadEntity(
    {
      ...payload,
      pipelineStage: payload.pipelineStage || 'primer-contacto',
      nextActionType: payload.nextActionType || 'primer-contacto',
      nextActionLabel: payload.nextActionLabel || 'Primer contacto y seguimiento operativo',
    },
    payload.centerId || defaultCenterId(state)
  );

  return {
    ...state,
    crm: {
      ...state.crm,
      leads: [lead, ...state.crm.leads],
    },
  };
}

export function updateLead(state, leadId, patch) {
  return {
    ...state,
    crm: {
      ...state.crm,
      leads: state.crm.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              ...patch,
              updatedAt: nowIso(),
            }
          : lead
      ),
    },
  };
}

export function addLeadContact(state, leadId, payload) {
  return {
    ...state,
    crm: {
      ...state.crm,
      leads: state.crm.leads.map((lead) => {
        if (lead.id !== leadId) {
          return lead;
        }

        const entry = createContactEntry(payload);
        const shouldKeepClosed = ['alumno', 'perdido'].includes(lead.pipelineStage);
        const nextActionAt = shouldKeepClosed ? '' : addHours(entry.at, 48).toISOString();

        return {
          ...lead,
          contactHistory: [entry, ...(lead.contactHistory ?? [])],
          lastContactAt: entry.at,
          nextActionAt,
          nextActionType: shouldKeepClosed ? lead.nextActionType : 'seguimiento',
          nextActionLabel: shouldKeepClosed ? lead.nextActionLabel : 'Seguimiento comercial cada 48h',
          pipelineStage: lead.pipelineStage === 'primer-contacto' ? 'seguimiento' : lead.pipelineStage,
          updatedAt: nowIso(),
        };
      }),
    },
  };
}

export function markLeadLost(state, leadId, reason) {
  return {
    ...state,
    crm: {
      ...state.crm,
      leads: state.crm.leads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              pipelineStage: 'perdido',
              reasonNotJoined: reason || lead.reasonNotJoined || '',
              nextActionAt: '',
              nextActionType: 'espera',
              nextActionLabel: 'No continuar salvo cambio de contexto',
              updatedAt: nowIso(),
            }
          : lead
      ),
    },
  };
}

export function scheduleLeadTrial(state, leadId, payload) {
  let scheduledLead = null;

  const nextState = {
    ...state,
    crm: {
      ...state.crm,
      leads: state.crm.leads.map((lead) => {
        if (lead.id !== leadId) {
          return lead;
        }

        scheduledLead = {
          ...lead,
          pipelineStage: 'reserva',
          reservationType: payload.reservationType || lead.reservationType || 'clase-prueba',
          testClassAt: payload.testClassAt || lead.testClassAt,
          testStatus: 'scheduled',
          nextActionAt: payload.testClassAt || lead.testClassAt || lead.nextActionAt,
          nextActionType: 'seguimiento',
          nextActionLabel: 'Confirmar asistencia a la clase de prueba',
          updatedAt: nowIso(),
        };

        return scheduledLead;
      }),
    },
  };

  if (!scheduledLead) {
    return state;
  }

  return {
    ...nextState,
    planner: {
      ...nextState.planner,
      items: scheduleReservationPlannerEvent(nextState.planner.items, scheduledLead),
    },
  };
}

export function markTrialCompleted(state, leadId) {
  let updatedLead = null;

  const nextState = {
    ...state,
    crm: {
      ...state.crm,
      leads: state.crm.leads.map((lead) => {
        if (lead.id !== leadId) {
          return lead;
        }

        const trialBase = lead.testClassAt ? new Date(lead.testClassAt) : new Date();
        const followUpAt = addDays(trialBase, 1).toISOString();

        updatedLead = {
          ...lead,
          testStatus: 'completed',
          pipelineStage: lead.pipelineStage === 'reserva' ? 'pendiente-decision' : lead.pipelineStage,
          nextActionAt: followUpAt,
          nextActionType: 'post-prueba',
          nextActionLabel: 'Seguimiento al día siguiente de la prueba',
          updatedAt: nowIso(),
        };

        return updatedLead;
      }),
    },
  };

  if (!updatedLead) {
    return state;
  }

  return {
    ...nextState,
    planner: {
      ...nextState.planner,
      items: schedulePostTrialFollowUp(nextState.planner.items, updatedLead),
    },
  };
}

export function importLeadsFromCsv(state, text) {
  const centerId = defaultCenterId(state);
  const payloads = parseLeadPayloadsFromCsv(text, state.shared.centers, centerId);

  if (!payloads.length) {
    return state;
  }

  const existingLeads = state.crm.leads;
  const imported = payloads
    .filter((payload) => !existingLeads.some((lead) => isDuplicateLead(lead, payload)))
    .map((payload) =>
      createLeadEntity(
        {
          ...payload,
          pipelineStage: 'primer-contacto',
          nextActionType: 'primer-contacto',
          nextActionLabel: 'Primer contacto y seguimiento operativo',
        },
        payload.centerId || centerId
      )
    );

  if (!imported.length) {
    return state;
  }

  return {
    ...state,
    crm: {
      ...state.crm,
      leads: [...imported, ...state.crm.leads],
    },
  };
}
export function deleteLead(state, leadId) {
  return {
    ...state,
    crm: {
      ...state.crm,
      leads: state.crm.leads.filter((lead) => lead.id !== leadId),
    },
  };
}