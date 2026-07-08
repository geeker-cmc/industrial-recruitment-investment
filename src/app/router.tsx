import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { Navigate, createHashRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../stores/useAuthStore';

const LoginPage = lazy(() => import('../pages/Login'));
const HomePage = lazy(() => import('../pages/Home'));
const IndustryDetailPage = lazy(() => import('../pages/IndustryDetail'));
const CompanyDetailPage = lazy(() => import('../pages/CompanyDetail'));
const InvestmentManagementPage = lazy(() => import('../pages/InvestmentManagement'));
const RiskMonitorPage = lazy(() => import('../pages/RiskMonitor'));
const InvestmentReviewPage = lazy(() => import('../pages/InvestmentReview'));

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
        element: <Navigate to="/home" replace />,
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
        element: <Navigate to="/investment-management" replace />,
      },
      {
        path: 'investment-management',
        element: withPageLoader(<InvestmentManagementPage />),
      },
      {
        path: 'risk-monitor',
        element: withPageLoader(<RiskMonitorPage />),
      },
      {
        path: 'post-investment',
        element: <Navigate to="/investment-review" replace />,
      },
      {
        path: 'investment-review',
        element: withPageLoader(<InvestmentReviewPage />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

export default router;
