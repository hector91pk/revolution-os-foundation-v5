import { useMemo, useState } from 'react';
import { useAppStore } from '../../app/state/useAppStore';
import { parseControlCenterRoute, getControlCenterTitle } from './routes';
import { buildCategoryStats, buildDashboardStats, buildFocusBuckets, filterProjects, sortProjects } from './selectors';
import { CategoryView } from './views/CategoryView';
import { DashboardView } from './views/DashboardView';
import { FocusView } from './views/FocusView';
import { MapView } from './views/MapView';
import { ProjectView } from './views/ProjectView';

function buildDraft(categoryId = '') {
  return {
    categoryId,
    name: '',
    nextStep: '',
    priority: 'media',
  };
}

export function ControlCenterModule({ subPath, navigateWithinModule }) {
  const { state, actions } = useAppStore();
  const route = useMemo(() => parseControlCenterRoute(subPath), [subPath]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [dashboardDraft, setDashboardDraft] = useState(() => buildDraft(state.controlCenter.categories[0]?.id || ''));
  const [categoryDraft, setCategoryDraft] = useState(() => buildDraft(''));
  const staleAfterDays = state.meta.staleAfterDays ?? 21;

  const categoriesWithStats = useMemo(
    () =>
      state.controlCenter.categories.map((category) => ({
        ...category,
        stats: buildCategoryStats(state.controlCenter.projects, category.id, staleAfterDays),
      })),
    [state.controlCenter.categories, state.controlCenter.projects, staleAfterDays]
  );

  const dashboard = useMemo(
    () => buildDashboardStats(state.controlCenter.projects, staleAfterDays),
    [state.controlCenter.projects, staleAfterDays]
  );

  const sortedProjects = useMemo(() => sortProjects(state.controlCenter.projects), [state.controlCenter.projects]);
  const focusBuckets = useMemo(
    () => buildFocusBuckets(state.controlCenter.projects, staleAfterDays),
    [state.controlCenter.projects, staleAfterDays]
  );

  const category = state.controlCenter.categories.find((item) => item.id === route.categoryId);
  const project = state.controlCenter.projects.find((item) => item.id === route.projectId);
  const categoryProjects = category
    ? sortProjects(filterProjects(state.controlCenter.projects.filter((item) => item.categoryId === category.id), { search, status }))
    : [];

  const projectsByCategory = state.controlCenter.projects.reduce((acc, current) => {
    if (!acc[current.categoryId]) {
      acc[current.categoryId] = [];
    }
    acc[current.categoryId].push(current);
    return acc;
  }, {});

  function openCategory(categoryId) {
    navigateWithinModule(`/category/${encodeURIComponent(categoryId)}`);
    setCategoryDraft(buildDraft(categoryId));
  }

  function openProject(projectId) {
    navigateWithinModule(`/project/${encodeURIComponent(projectId)}`);
  }

  function createDashboardProject() {
    if (!dashboardDraft.name.trim() || !dashboardDraft.categoryId) {
      return;
    }
    const created = actions.controlCenter.createProject({
      categoryId: dashboardDraft.categoryId,
      name: dashboardDraft.name.trim(),
      nextStep: dashboardDraft.nextStep.trim(),
      priority: dashboardDraft.priority,
      alignment:
        state.controlCenter.categories.find((item) => item.id === dashboardDraft.categoryId)?.defaultAlignment || 'experimental',
    });
    setDashboardDraft(buildDraft(dashboardDraft.categoryId));
    openProject(created.id);
  }

  function createCategoryProject() {
    if (!category || !categoryDraft.name.trim()) {
      return;
    }
    const created = actions.controlCenter.createProject({
      categoryId: category.id,
      name: categoryDraft.name.trim(),
      nextStep: categoryDraft.nextStep.trim(),
      priority: categoryDraft.priority,
      alignment: category.defaultAlignment || 'experimental',
    });
    setCategoryDraft(buildDraft(category.id));
    openProject(created.id);
  }

  if (route.view === 'category' && category) {
    return (
      <CategoryView
        category={category}
        projects={categoryProjects}
        search={search}
        status={status}
        setSearch={setSearch}
        setStatus={setStatus}
        onBack={() => navigateWithinModule('/')}
        onOpenProject={openProject}
        draft={categoryDraft}
        setDraft={setCategoryDraft}
        onCreateProject={createCategoryProject}
      />
    );
  }

  if (route.view === 'project' && project) {
    return (
      <ProjectView
        project={project}
        categories={state.controlCenter.categories}
        onBack={() => navigateWithinModule(`/category/${encodeURIComponent(project.categoryId)}`)}
        onChange={(field, value) => actions.controlCenter.updateProject(project.id, { [field]: value })}
        onDelete={() => {
          const confirmed = window.confirm('¿Seguro que quieres eliminar este proyecto?');
          if (!confirmed) return;
          actions.controlCenter.deleteProject(project.id);
          navigateWithinModule(`/category/${encodeURIComponent(project.categoryId)}`);
        }}
      />
    );
  }

  if (route.view === 'focus') {
    return <FocusView buckets={focusBuckets} onOpenProject={openProject} />;
  }

  if (route.view === 'map') {
    return (
      <MapView
        categories={state.controlCenter.categories}
        projectsByCategory={projectsByCategory}
        onOpenProject={openProject}
      />
    );
  }

  return (
    <DashboardView
      categoriesWithStats={categoriesWithStats}
      dashboard={dashboard}
      projects={sortedProjects}
      draft={dashboardDraft}
      setDraft={setDashboardDraft}
      onCreateProject={createDashboardProject}
      onOpenCategory={openCategory}
      onOpenProject={openProject}
    />
  );
}

export { getControlCenterTitle };
