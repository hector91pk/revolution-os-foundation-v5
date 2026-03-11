import { createId } from '../../shared/utils/id';
import { nowIso } from '../../shared/utils/date';

/**
 * @typedef {Object} InboxItemEntity
 * @property {string} id
 * @property {string} channel
 * @property {string} centerId
 * @property {string} senderName
 * @property {string} senderContact
 * @property {string} subject
 * @property {string} message
 * @property {string} requestType
 * @property {string} status
 * @property {string} suggestedModuleId
 * @property {string} derivedEntityType
 * @property {string} derivedEntityId
 * @property {string} activityInterest
 * @property {string} source
 * @property {string} notes
 * @property {string} receivedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export function createInboxItemEntity(payload = {}) {
  const timestamp = payload.receivedAt || payload.createdAt || nowIso();
  return {
    id: payload.id || createId('inbox', payload.senderName || payload.subject),
    channel: payload.channel || 'formulario',
    centerId: payload.centerId || '',
    senderName: payload.senderName || '',
    senderContact: payload.senderContact || '',
    subject: payload.subject || '',
    message: payload.message || '',
    requestType: payload.requestType || 'consulta-general',
    status: payload.status || 'nuevo',
    suggestedModuleId: payload.suggestedModuleId || 'human',
    derivedEntityType: payload.derivedEntityType || '',
    derivedEntityId: payload.derivedEntityId || '',
    activityInterest: payload.activityInterest || '',
    source: payload.source || payload.channel || 'formulario',
    notes: payload.notes || '',
    receivedAt: timestamp,
    createdAt: payload.createdAt || timestamp,
    updatedAt: payload.updatedAt || timestamp,
  };
}
