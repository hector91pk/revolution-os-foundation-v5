import { createId } from '../../shared/utils/id';
import { addHours, nowIso } from '../../shared/utils/date';

/**
 * @typedef {Object} ContactHistoryEntry
 * @property {string} id
 * @property {string} at
 * @property {string} channel
 * @property {string} direction
 * @property {string} summary
 * @property {string} outcome
 */

/**
 * @typedef {Object} LeadEntity
 * @property {string} id
 * @property {string} centerId
 * @property {string} fullName
 * @property {string} activityInterest
 * @property {string} phone
 * @property {string} email
 * @property {string} preferredChannel
 * @property {string} language
 * @property {string} source
 * @property {string} expectations
 * @property {string} dateOfBirth
 * @property {string} pipelineStage
 * @property {string} receivedAt
 * @property {string} lastContactAt
 * @property {string} nextActionAt
 * @property {string} nextActionType
 * @property {string} nextActionLabel
 * @property {string} notes
 * @property {string} reservationType
 * @property {string} testClassAt
 * @property {string} testStatus
 * @property {string} paymentConfirmedAt
 * @property {string} iban
 * @property {string} ibanHolder
 * @property {string} alternativeOfferNotes
 * @property {string} reasonJoined
 * @property {string} reasonNotJoined
 * @property {ContactHistoryEntry[]} contactHistory
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export function createContactEntry(payload = {}) {
  return {
    id: payload.id || createId('contact', payload.summary),
    at: payload.at || nowIso(),
    channel: payload.channel || 'whatsapp',
    direction: payload.direction || 'saliente',
    summary: payload.summary || '',
    outcome: payload.outcome || '',
  };
}

export function createLeadEntity(payload = {}, defaultCenterId = '') {
  const receivedAt = payload.receivedAt || payload.createdAt || nowIso();
  const nextActionAt = payload.nextActionAt || addHours(receivedAt, 48).toISOString();
  const timestamp = nowIso();

  return {
    id: payload.id || createId('lead', payload.fullName),
    centerId: payload.centerId || defaultCenterId,
    fullName: payload.fullName || payload.name || 'Nuevo lead',
    activityInterest: payload.activityInterest || payload.activity || '',
    phone: payload.phone || '',
    email: payload.email || '',
    preferredChannel: payload.preferredChannel || 'whatsapp',
    language: payload.language || 'es',
    source: payload.source || 'formulario-web',
    expectations: payload.expectations || '',
    dateOfBirth: payload.dateOfBirth || '',
    pipelineStage: payload.pipelineStage || 'primer-contacto',
    receivedAt,
    lastContactAt: payload.lastContactAt || '',
    nextActionAt,
    nextActionType: payload.nextActionType || 'primer-contacto',
    nextActionLabel: payload.nextActionLabel || 'Primer contacto y seguimiento operativo',
    notes: payload.notes || '',
    reservationType: payload.reservationType || '',
    testClassAt: payload.testClassAt || '',
    testStatus: payload.testStatus || 'not-scheduled',
    paymentConfirmedAt: payload.paymentConfirmedAt || '',
    iban: payload.iban || '',
    ibanHolder: payload.ibanHolder || '',
    alternativeOfferNotes: payload.alternativeOfferNotes || '',
    reasonJoined: payload.reasonJoined || '',
    reasonNotJoined: payload.reasonNotJoined || '',
    contactHistory: Array.isArray(payload.contactHistory)
      ? payload.contactHistory.map((entry) => createContactEntry(entry))
      : [],
    createdAt: payload.createdAt || timestamp,
    updatedAt: payload.updatedAt || timestamp,
  };
}
