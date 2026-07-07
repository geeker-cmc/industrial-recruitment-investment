import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { Navigate, createHashRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../stores/useAuthStore';

const LoginPage = lazy(() => import('../pages/Login'));
const HomePage = lazy(() => import('../pages/Home'));
const IndustryDetailPage = lazy(() => import('../pages/IndustryDetail'));
const CompanyDetailPage = lazy(() => import('../pages/CompanyDetail'));
const InvestmentPoolPage = lazy(() => import('../pages/InvestmentPool'));
const PostInvestmentPage = lazy(() => import('../pages/PostInvestment'));

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
        element: withPageLoader(<InvestmentPoolPage />),
      },
      {
        path: 'post-investment',
        element: withPageLoader(<PostInvestmentPage />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);

export default router;
