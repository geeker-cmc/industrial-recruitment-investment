import {
  AppstoreOutlined,
  BankOutlined,
  BarChartOutlined,
  FileProtectOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProjectOutlined,
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
  const isHomeModule =
    location.pathname.startsWith('/home') ||
    location.pathname.startsWith('/industries') ||
    location.pathname.startsWith('/companies');

  const managementNavItems = [
    {
      to: '/project-management',
      label: '项目管理',
      icon: <ProjectOutlined />,
      active:
        location.pathname.startsWith('/project-management') ||
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
      to: '/fund-management',
      label: '基金管理',
      icon: <BankOutlined />,
      active: location.pathname.startsWith('/fund-management'),
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
      to: '/data-statistics',
      label: '数据统计',
      icon: <BarChartOutlined />,
      active:
        location.pathname.startsWith('/data-statistics') ||
        location.pathname.startsWith('/investment-review'),
    },
    {
      to: '/document-management',
      label: '文档管理',
      icon: <FileProtectOutlined />,
      active: location.pathname.startsWith('/document-management'),
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
