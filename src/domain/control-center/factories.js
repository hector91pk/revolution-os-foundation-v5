import { createId } from '../../shared/utils/id';
import { nowIso } from '../../shared/utils/date';

/**
 * @typedef {Object} ProjectEntity
 * @property {string} id
 * @property {string} categoryId
 * @property {string} name
 * @property {string} description
 * @property {string} status
 * @property {string} priority
 * @property {string} nextStep
 * @property {string} lastReview
 * @property {string} notes
 * @property {string} documentation
 * @property {string} ideas
 * @property {string} blockers
 * @property {string[]} relatedProjectIds
 * @property {string} relatedLinks
 * @property {string} estimatedTime
 * @property {number} interestLevel
 * @property {number} impactPotential
 * @property {string} alignment
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export function createProjectEntity(payload = {}) {
  const timestamp = nowIso();
  return {
    id: payload.id || createId('project', payload.name),
    categoryId: payload.categoryId || '',
    name: payload.name || 'Nuevo proyecto',
    description: payload.description || '',
    status: payload.status || 'idea',
    priority: payload.priority || 'media',
    nextStep: payload.nextStep || '',
    lastReview: payload.lastReview || timestamp.slice(0, 10),
    notes: payload.notes || '',
    documentation: payload.documentation || '',
    ideas: payload.ideas || '',
    blockers: payload.blockers || '',
    relatedProjectIds: Array.isArray(payload.relatedProjectIds) ? payload.relatedProjectIds : [],
    relatedLinks: payload.relatedLinks || '',
    estimatedTime: payload.estimatedTime || '',
    interestLevel: Number.isFinite(payload.interestLevel) ? payload.interestLevel : 7,
    impactPotential: Number.isFinite(payload.impactPotential) ? payload.impactPotential : 7,
    alignment: payload.alignment || 'experimental',
    createdAt: payload.createdAt || timestamp,
    updatedAt: payload.updatedAt || timestamp,
  };
}
