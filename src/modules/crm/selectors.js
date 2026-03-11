import {
  AGE_GROUP_OPTIONS,
  LEAD_STAGE_OPTIONS,
  REASON_JOINED_OPTIONS,
  REASON_NOT_JOINED_OPTIONS,
} from '../../domain/reference/catalogs';
import {
  differenceInHours,
  formatRelativeDue,
  getAgeFromBirthDate,
  getAgeGroup,
} from '../../shared/utils/date';
import { formatPercent, labelFromOptions } from '../../shared/utils/format';

const stageWeight = {
  'primer-contacto': 8,
  'seguimiento': 6,
  interes: 5,
  'pendiente-decision': 7,
  reserva: 9,
  alumno: 1,
  inactivo: 3,
  perdido: 2,
};

export function enrichLead(lead, centers) {
  const center = centers.find((item) => item.id === lead.centerId);
  const age = getAgeFromBirthDate(lead.dateOfBirth);
  const ageGroup = getAgeGroup(age);
  const firstContactOverdue =
    lead.pipelineStage === 'primer-contacto' &&
    !lead.lastContactAt &&
    differenceInHours(new Date(), lead.receivedAt) > 24;

  const followUpOverdue =
    !['primer-contacto', 'alumno', 'perdido'].includes(lead.pipelineStage) &&
    !!lead.nextActionAt &&
    differenceInHours(new Date(), lead.nextActionAt) > 0;

  return {
    ...lead,
    age,
    ageGroup,
    ageGroupLabel: labelFromOptions(AGE_GROUP_OPTIONS, ageGroup, 'Desconocida'),
    centerName: center?.name ?? lead.centerId ?? 'Sin centro',
    stageLabel: labelFromOptions(LEAD_STAGE_OPTIONS, lead.pipelineStage, lead.pipelineStage),
    reasonJoinedLabel: labelFromOptions(REASON_JOINED_OPTIONS, lead.reasonJoined, 'Sin definir'),
    reasonNotJoinedLabel: labelFromOptions(REASON_NOT_JOINED_OPTIONS, lead.reasonNotJoined, 'Sin definir'),
    isFirstContactOverdue: firstContactOverdue,
    isFollowUpOverdue: followUpOverdue,
    nextActionRelativeLabel: lead.nextActionAt ? formatRelativeDue(lead.nextActionAt) : 'Sin próxima acción',
  };
}

export function filterLeads(leads, filters) {
  const normalizedSearch = String(filters.search ?? '').trim().toLowerCase();

  return leads.filter((lead) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.activityInterest,
        lead.centerName,
        lead.notes,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesCenter = filters.centerId === 'all' || lead.centerId === filters.centerId;
    const matchesActivity = filters.activity === 'all' || lead.activityInterest === filters.activity;
    const matchesSource = filters.source === 'all' || lead.source === filters.source;
    const matchesAgeGroup = filters.ageGroup === 'all' || lead.ageGroup === filters.ageGroup;
    const matchesStage = filters.stage === 'all' || lead.pipelineStage === filters.stage;

    return matchesSearch && matchesCenter && matchesActivity && matchesSource && matchesAgeGroup && matchesStage;
  });
}

export function sortLeads(leads) {
  return [...leads].sort((left, right) => {
    const slaLeft = (left.isFirstContactOverdue ? 2 : 0) + (left.isFollowUpOverdue ? 1 : 0);
    const slaRight = (right.isFirstContactOverdue ? 2 : 0) + (right.isFollowUpOverdue ? 1 : 0);

    if (slaLeft !== slaRight) {
      return slaRight - slaLeft;
    }

    const stageDiff = (stageWeight[right.pipelineStage] ?? 0) - (stageWeight[left.pipelineStage] ?? 0);
    if (stageDiff !== 0) {
      return stageDiff;
    }

    return String(right.updatedAt ?? '').localeCompare(String(left.updatedAt ?? ''));
  });
}

function baseMetrics(leads) {
  const total = leads.length;
  const trialsCompleted = leads.filter((lead) => lead.testStatus === 'completed').length;
  const students = leads.filter((lead) => lead.pipelineStage === 'alumno').length;
  const firstContactAlerts = leads.filter((lead) => lead.isFirstContactOverdue).length;
  const followUpAlerts = leads.filter((lead) => lead.isFollowUpOverdue).length;

  const leadToTrialRatio = total ? (trialsCompleted / total) * 100 : 0;
  const trialToStudentRatio = trialsCompleted ? (students / trialsCompleted) * 100 : 0;
  const leadToStudentRatio = total ? (students / total) * 100 : 0;

  return {
    total,
    trialsCompleted,
    students,
    firstContactAlerts,
    followUpAlerts,
    leadToTrialRatio,
    trialToStudentRatio,
    leadToStudentRatio,
    leadToTrialRatioLabel: formatPercent(leadToTrialRatio),
    trialToStudentRatioLabel: formatPercent(trialToStudentRatio),
    leadToStudentRatioLabel: formatPercent(leadToStudentRatio),
  };
}

export function buildCrmSummary(leads) {
  return baseMetrics(leads);
}

export function buildCenterMetrics(leads, centers) {
  return centers.map((center) => ({
    center,
    metrics: baseMetrics(leads.filter((lead) => lead.centerId === center.id)),
  }));
}
