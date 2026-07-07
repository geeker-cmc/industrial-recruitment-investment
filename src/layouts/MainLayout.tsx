import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

export default function MainLayout() {
  return (
    <Layout className="app-shell">
      <AppHeader />
      <Content className="app-content">
        <Outlet />
      </Content>
    </Layout>
  );
}
