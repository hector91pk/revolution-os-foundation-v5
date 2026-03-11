import { createId } from '../../shared/utils/id';
import { nowIso, todayKey } from '../../shared/utils/date';

/**
 * @typedef {Object} PlannerItemEntity
 * @property {string} id
 * @property {string} kind
 * @property {string} title
 * @property {string} description
 * @property {string} dueDate
 * @property {string} dueTime
 * @property {string} status
 * @property {string} priority
 * @property {string} centerId
 * @property {string} sourceModule
 * @property {string} linkedEntityType
 * @property {string} linkedEntityId
 * @property {string} automationKey
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export function createPlannerItemEntity(payload = {}) {
  const timestamp = nowIso();
  return {
    id: payload.id || createId('planner', payload.title),
    kind: payload.kind || 'task',
    title: payload.title || 'Nueva tarea',
    description: payload.description || '',
    dueDate: payload.dueDate || todayKey(),
    dueTime: payload.dueTime || '',
    status: payload.status || 'pendiente',
    priority: payload.priority || 'media',
    centerId: payload.centerId || '',
    sourceModule: payload.sourceModule || 'planner',
    linkedEntityType: payload.linkedEntityType || '',
    linkedEntityId: payload.linkedEntityId || '',
    automationKey: payload.automationKey || '',
    createdAt: payload.createdAt || timestamp,
    updatedAt: payload.updatedAt || timestamp,
  };
}
