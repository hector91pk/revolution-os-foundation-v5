import { createPlannerItemEntity } from '../../domain/planner/factories';
import { addDays, toDateKey } from '../../shared/utils/date';

function upsertPlannerItemByAutomationKey(items, payload) {
  const item = createPlannerItemEntity(payload);
  const index = items.findIndex((entry) => entry.automationKey && entry.automationKey === item.automationKey);

  if (index === -1) {
    return [item, ...items];
  }

  const nextItems = [...items];
  nextItems[index] = {
    ...nextItems[index],
    ...item,
  };
  return nextItems;
}

export function scheduleReservationPlannerEvent(items, lead) {
  if (!lead.testClassAt) {
    return items;
  }

  const trialDate = new Date(lead.testClassAt);
  if (Number.isNaN(trialDate.getTime())) {
    return items;
  }

  return upsertPlannerItemByAutomationKey(items, {
    kind: 'reservation',
    title: `Clase de prueba · ${lead.fullName}`,
    description: `Reserva comercial para ${lead.activityInterest || 'actividad por definir'}.`,
    dueDate: toDateKey(trialDate),
    dueTime: lead.testClassAt.slice(11, 16),
    priority: 'alta',
    centerId: lead.centerId,
    sourceModule: 'crm',
    linkedEntityType: 'lead',
    linkedEntityId: lead.id,
    automationKey: `lead:${lead.id}:reservation:${toDateKey(trialDate)}`,
  });
}

export function schedulePostTrialFollowUp(items, lead) {
  if (!lead.testClassAt) {
    return items;
  }

  const trialDate = new Date(lead.testClassAt);
  if (Number.isNaN(trialDate.getTime())) {
    return items;
  }

  const followUpDate = addDays(trialDate, 1);

  return upsertPlannerItemByAutomationKey(items, {
    kind: 'follow-up',
    title: `Seguimiento post-prueba · ${lead.fullName}`,
    description: 'Contactar al día siguiente para feedback y cierre.',
    dueDate: toDateKey(followUpDate),
    dueTime: '10:00',
    priority: 'alta',
    centerId: lead.centerId,
    sourceModule: 'crm',
    linkedEntityType: 'lead',
    linkedEntityId: lead.id,
    automationKey: `lead:${lead.id}:post-trial:${toDateKey(followUpDate)}`,
  });
}
