import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { Navigate, createHashRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../stores/useAuthStore';

const LoginPage = lazy(() => import('../pages/Login'));
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const HomePage = lazy(() => import('../pages/Home'));
const IndustryDetailPage = lazy(() => import('../pages/IndustryDetail'));
const CompanyDetailPage = lazy(() => import('../pages/CompanyDetail'));
const BusinessManagementPage = lazy(() => import('../pages/BusinessManagement'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetail'));
const AgentToolsPage = lazy(() => import('../pages/AgentTools'));
const ReportFactoryPage = lazy(() => import('../pages/ReportFactory'));
const KnowledgeBasePage = lazy(() => import('../pages/KnowledgeBase'));
const OpportunityDiscoveryPage = lazy(() => import('../pages/OpportunityDiscovery'));

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function withPageLoader(element: JSX.Element) {
  return (
    <Suspense
      fallback={
        <div className="page-loading">
          <Spin size="large" />
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

const router = createHashRouter([
  {
    path: '/login',
    element: withPageLoader(<LoginPage />),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withPageLoader(<DashboardPage />),
      },
      {
        path: 'home',
        element: withPageLoader(<HomePage />),
      },
      {
        path: 'industries/:industryChainId',
        element: withPageLoader(<IndustryDetailPage />),
      },
      {
        path: 'companies/:companyId',
        element: withPageLoader(<CompanyDetailPage />),
      },
      {
        path: 'investment-pool',
        element: withPageLoader(<BusinessManagementPage moduleKey="project" />),
      },
      {
        path: 'post-investment',
        element: withPageLoader(<BusinessManagementPage moduleKey="risk" />),
      },
      {
        path: 'investment-management',
        element: withPageLoader(<BusinessManagementPage moduleKey="project" />),
      },
      {
        path: 'risk-monitor',
        element: withPageLoader(<BusinessManagementPage moduleKey="risk" />),
      },
      {
        path: 'investment-review',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'project-management',
        element: withPageLoader(<BusinessManagementPage moduleKey="project" />),
      },
      {
        path: 'projects/:projectId',
        element: withPageLoader(<ProjectDetailPage />),
      },
      {
        path: 'customer-management',
        element: withPageLoader(<BusinessManagementPage moduleKey="customer" />),
      },
      {
        path: 'fund-management',
        element: <Navigate to="/project-management" replace />,
      },
      {
        path: 'risk-management',
        element: withPageLoader(<BusinessManagementPage moduleKey="risk" />),
      },
      {
        path: 'data-statistics',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'document-management',
        element: withPageLoader(<ReportFactoryPage />),
      },
      {
        path: 'agents',
        element: withPageLoader(<AgentToolsPage />),
      },
      {
        path: 'knowledge-base',
        element: withPageLoader(<KnowledgeBasePage />),
      },
      {
        path: 'opportunity-discovery',
        element: withPageLoader(<OpportunityDiscoveryPage />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
