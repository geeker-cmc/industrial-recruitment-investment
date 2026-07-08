import {
  AppstoreOutlined,
  CompassOutlined,
  FileProtectOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProjectOutlined,
  RobotOutlined,
  TeamOutlined,
  WarningOutlined,
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
  const isIndustryModule =
    location.pathname.startsWith('/home') ||
    location.pathname.startsWith('/industries') ||
    location.pathname.startsWith('/companies');

  const managementNavItems = [
    {
      to: '/dashboard',
      label: '首页',
      icon: <HomeOutlined />,
      active: location.pathname.startsWith('/dashboard') || location.pathname === '/',
    },
    {
      to: '/project-management',
      label: '项目管理',
      icon: <ProjectOutlined />,
      active:
        location.pathname.startsWith('/project-management') ||
        location.pathname.startsWith('/projects') ||
        location.pathname.startsWith('/investment-management') ||
        location.pathname.startsWith('/investment-pool'),
    },
    {
      to: '/customer-management',
      label: '客户管理',
      icon: <TeamOutlined />,
      active: location.pathname.startsWith('/customer-management'),
    },
    {
      to: '/risk-management',
      label: '风险管理',
      icon: <WarningOutlined />,
      active:
        location.pathname.startsWith('/risk-management') ||
        location.pathname.startsWith('/risk-monitor') ||
        location.pathname.startsWith('/post-investment'),
    },
    {
      to: '/document-management',
      label: '文档管理',
      icon: <FileProtectOutlined />,
      active: location.pathname.startsWith('/document-management'),
    },
    {
      to: '/agents',
      label: '智能体',
      icon: <RobotOutlined />,
      active: location.pathname.startsWith('/agents'),
    },
    {
      to: '/home',
      label: '产业洞察',
      icon: <CompassOutlined />,
      active: isIndustryModule,
    },
  ];

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
      <div className="app-header__brand" onClick={() => navigate('/dashboard')}>
        <AppstoreOutlined />
        <span>产业招投平台</span>
      </div>
      <nav className="app-header__nav" aria-label="一级导航">
        {managementNavItems.map((item) => (
          <NavLink
            className={`app-header__nav-link ${item.active ? 'active' : ''}`}
            key={item.to}
            to={item.to}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
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
