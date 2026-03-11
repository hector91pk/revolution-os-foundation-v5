import { createContactEntry, createLeadEntity } from '../../../domain/crm/factories';
import { createInboxItemEntity } from '../../../domain/inbox/factories';
import { createPlannerItemEntity } from '../../../domain/planner/factories';
import { createId } from '../../../shared/utils/id';
import { normalizeInboxPayload, mapInboxChannelToLeadSource, suggestModuleForRequestType } from './routerRules';

function getDefaultCenterId(state) {
  return state.shared.centers?.[0]?.id ?? '';
}

function normalizeContactValue(value) {
  return String(value ?? '').trim();
}

function extractEmail(text) {
  const match = String(text ?? '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const compact = String(text ?? '').replace(/[^\d+]/g, ' ').trim();
  const match = compact.match(/(\+?\d[\d\s]{7,}\d)/);
  return match ? match[1].replace(/\s+/g, '') : '';
}

function findExistingLeadByInboxItem(state, item) {
  const email = extractEmail(item.senderContact);
  const phone = extractPhone(item.senderContact);
  const fullName = String(item.senderName ?? '').trim().toLowerCase();

  return state.crm.leads.find((lead) => {
    const sameEmail = email && lead.email && lead.email.toLowerCase() === email.toLowerCase();
    const samePhone = phone && lead.phone && lead.phone.replace(/\s+/g, '') === phone;
    const sameName = fullName && lead.fullName.trim().toLowerCase() === fullName;
    return sameEmail || samePhone || (sameName && (email || phone));
  });
}

function inboxToLeadPayload(state, item) {
  const email = extractEmail(item.senderContact);
  const phone = extractPhone(item.senderContact);

  return {
    fullName: item.senderName || 'Lead desde inbox',
    centerId: item.centerId || getDefaultCenterId(state),
    email,
    phone,
    activityInterest: item.activityInterest || '',
    source: mapInboxChannelToLeadSource(item.channel),
    expectations: item.message || '',
    notes: item.notes || '',
    receivedAt: item.receivedAt,
    createdAt: item.createdAt,
    pipelineStage: 'primer-contacto',
    nextActionType: 'primer-contacto',
    nextActionLabel: 'Primer contacto y seguimiento operativo',
    contactHistory: [
      createContactEntry({
        at: item.receivedAt,
        channel: item.channel || 'interno',
        direction: 'entrante',
        summary: item.subject || `Entrada desde inbox · ${item.channel}`,
        outcome: 'Lead creado desde bandeja universal',
      }),
    ],
  };
}

export function createInboxItem(state, payload) {
  const item = createInboxItemEntity(normalizeInboxPayload(payload));

  return {
    ...state,
    inbox: {
      ...state.inbox,
      items: [item, ...state.inbox.items],
    },
  };
}

export function updateInboxItem(state, itemId, patch) {
  const normalizedPatch =
    patch.requestType || patch.suggestedModuleId
      ? normalizeInboxPayload({
          ...state.inbox.items.find((entry) => entry.id === itemId),
          ...patch,
        })
      : patch;

  return {
    ...state,
    inbox: {
      ...state.inbox,
      items: state.inbox.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...normalizedPatch,
            }
          : item
      ),
    },
  };
}

export function deriveInboxItemToLead(state, itemId) {
  const item = state.inbox.items.find((entry) => entry.id === itemId);
  if (!item) return state;

  const existingLead = findExistingLeadByInboxItem(state, item);

  if (existingLead) {
    return {
      ...state,
      crm: {
        ...state.crm,
        leads: state.crm.leads.map((lead) =>
          lead.id === existingLead.id
            ? {
                ...lead,
                contactHistory: [
                  createContactEntry({
                    at: item.receivedAt,
                    channel: item.channel || 'interno',
                    direction: 'entrante',
                    summary: item.subject || 'Entrada adicional desde inbox',
                    outcome: 'Entrada enlazada al lead existente',
                  }),
                  ...(lead.contactHistory ?? []),
                ],
              }
            : lead
        ),
      },
      inbox: {
        ...state.inbox,
        items: state.inbox.items.map((entry) =>
          entry.id === itemId
            ? {
                ...entry,
                status: 'derivado',
                suggestedModuleId: 'leads-crm',
                derivedEntityType: 'lead',
                derivedEntityId: existingLead.id,
              }
            : entry
        ),
      },
    };
  }

  const lead = createLeadEntity(
    inboxToLeadPayload(state, item),
    item.centerId || getDefaultCenterId(state)
  );

  return {
    ...state,
    crm: {
      ...state.crm,
      leads: [lead, ...state.crm.leads],
    },
    inbox: {
      ...state.inbox,
      items: state.inbox.items.map((entry) =>
        entry.id === itemId
          ? {
              ...entry,
              status: 'derivado',
              requestType: 'lead',
              suggestedModuleId: 'leads-crm',
              derivedEntityType: 'lead',
              derivedEntityId: lead.id,
            }
          : entry
      ),
    },
  };
}

export function deriveInboxItemToPlanner(state, itemId) {
  const item = state.inbox.items.find((entry) => entry.id === itemId);
  if (!item) return state;

  const plannerItem = createPlannerItemEntity({
    id: createId('planner', item.subject || item.senderName || 'inbox'),
    kind: item.requestType === 'evento' ? 'event' : 'task',
    title: item.subject || `${item.senderName || 'Entrada'} · ${item.requestType}`,
    description: item.message || item.notes || '',
    dueDate: String(item.receivedAt || '').slice(0, 10),
    dueTime: '',
    status: 'pendiente',
    priority: item.requestType === 'lead' || item.requestType === 'incidencia' ? 'alta' : 'media',
    centerId: item.centerId || '',
    sourceModule: 'inbox',
    linkedEntityType: 'inbox-item',
    linkedEntityId: item.id,
    automationKey: '',
  });

  return {
    ...state,
    planner: {
      ...state.planner,
      items: [plannerItem, ...state.planner.items],
    },
    inbox: {
      ...state.inbox,
      items: state.inbox.items.map((entry) =>
        entry.id === itemId
          ? {
              ...entry,
              status: 'derivado',
              suggestedModuleId: suggestModuleForRequestType(entry.requestType),
              derivedEntityType: 'planner-item',
              derivedEntityId: plannerItem.id,
            }
          : entry
      ),
    },
  };
}

export function deleteInboxItem(state, itemId) {
  return {
    ...state,
    inbox: {
      ...state.inbox,
      items: state.inbox.items.filter((item) => item.id !== itemId),
    },
  };
}
