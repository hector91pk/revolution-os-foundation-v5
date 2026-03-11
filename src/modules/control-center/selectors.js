import { isStale } from '../../shared/utils/date';

const priorityWeight = { alta: 3, media: 2, baja: 1 };
const statusWeight = { activo: 5, bloqueado: 4, idea: 3, pausado: 2, archivado: 1 };

export function sortProjects(projects) {
  return [...projects].sort((left, right) => {
    const priorityDiff = (priorityWeight[right.priority] ?? 0) - (priorityWeight[left.priority] ?? 0);
    if (priorityDiff !== 0) return priorityDiff;

    const statusDiff = (statusWeight[right.status] ?? 0) - (statusWeight[left.status] ?? 0);
    if (statusDiff !== 0) return statusDiff;

    return left.name.localeCompare(right.name, 'es');
  });
}

export function filterProjects(projects, { search = '', status = 'all' } = {}) {
  const normalizedSearch = search.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesStatus = status === 'all' || project.status === status;
    const matchesSearch =
      !normalizedSearch ||
      [project.name, project.description, project.nextStep, project.notes, project.blockers]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });
}

export function buildCategoryStats(projects, categoryId, staleAfterDays) {
  const scoped = projects.filter((project) => project.categoryId === categoryId);
  return {
    total: scoped.length,
    activos: scoped.filter((project) => project.status === 'activo').length,
    bloqueados: scoped.filter((project) => project.status === 'bloqueado').length,
    prioritarios: scoped.filter((project) => project.priority === 'alta').length,
    stale: scoped.filter((project) => isStale(project.lastReview, staleAfterDays)).length,
  };
}

export function buildDashboardStats(projects, staleAfterDays) {
  return {
    categories: new Set(projects.map((project) => project.categoryId)).size,
    projects: projects.length,
    activos: projects.filter((project) => project.status === 'activo').length,
    pausados: projects.filter((project) => project.status === 'pausado').length,
    bloqueados: projects.filter((project) => project.status === 'bloqueado').length,
    prioritarios: projects.filter((project) => project.priority === 'alta').length,
    stale: projects.filter((project) => isStale(project.lastReview, staleAfterDays)).length,
    core: projects.filter((project) => project.alignment === 'core').length,
    experimental: projects.filter((project) => project.alignment === 'experimental').length,
  };
}

export function buildFocusBuckets(projects, staleAfterDays) {
  const sorted = sortProjects(projects);
  return {
    priority: sorted.filter((project) => project.priority === 'alta' && project.status === 'activo').slice(0, 6),
    blocked: sorted.filter((project) => project.status === 'bloqueado').slice(0, 6),
    stale: sorted.filter((project) => isStale(project.lastReview, staleAfterDays)).slice(0, 6),
    core: sorted.filter((project) => project.alignment === 'core').slice(0, 6),
    experimental: sorted.filter((project) => project.alignment === 'experimental').slice(0, 6),
  };
}
