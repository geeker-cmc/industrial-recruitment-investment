import {
  AppstoreOutlined,
  BarChartOutlined,
  FundProjectionScreenOutlined,
  HomeOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, MenuProps, Space } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isHomeModule =
    location.pathname.startsWith('/home') ||
    location.pathname.startsWith('/industries') ||
    location.pathname.startsWith('/companies');

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login', { replace: true });
      },
    },
  ];

  return (
    <Header className="app-header">
      <div className="app-header__brand" onClick={() => navigate('/home')}>
        <AppstoreOutlined />
        <span>产业招投平台</span>
      </div>
      <nav className="app-header__nav" aria-label="一级导航">
        <NavLink
          className={`app-header__nav-link ${isHomeModule ? 'active' : ''}`}
          to="/home"
        >
          <HomeOutlined />
          <span>产业洞察</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `app-header__nav-link ${isActive ? 'active' : ''}`
          }
          to="/investment-management"
        >
          <FundProjectionScreenOutlined />
          <span>投管</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `app-header__nav-link ${isActive ? 'active' : ''}`
          }
          to="/risk-monitor"
        >
          <SafetyCertificateOutlined />
          <span>风险监控</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `app-header__nav-link ${isActive ? 'active' : ''}`
          }
          to="/investment-review"
        >
          <BarChartOutlined />
          <span>投资复盘</span>
        </NavLink>
      </nav>
      <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
        <Button className="app-header__user" type="text">
          <Space size={10}>
            <Avatar size={28}>{user?.name?.slice(0, 1) || '演'}</Avatar>
            <span>{user?.name || '演示用户'}</span>
          </Space>
        </Button>
      </Dropdown>
    </Header>
  );
}
