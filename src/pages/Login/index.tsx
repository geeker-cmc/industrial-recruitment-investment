import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

type LoginFormValues = {
  account: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (values: LoginFormValues) => {
    login(values.account);
    message.success('登录成功');
    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-page__intro">
        <div className="login-page__brand">
          <SafetyCertificateOutlined />
          <span>产业招投平台</span>
        </div>
        <h1>产业洞察与股权投资业务管理工作台</h1>
        <p>
          统一承载首页看板、项目全生命周期、投资客户、风险、文档、智能体工具和产业洞察流程。
        </p>
        <div className="login-page__metrics" aria-label="平台概览">
          <div>
            <strong>10</strong>
            <span>精选产业专题</span>
          </div>
          <div>
            <strong>2</strong>
            <span>区域重点规划</span>
          </div>
          <div>
            <strong>80+</strong>
            <span>产业链入口</span>
          </div>
        </div>
      </section>
      <section className="login-card" aria-label="登录表单">
        <div className="login-card__header">
          <h2>账号登录</h2>
          <span>欢迎回来</span>
        </div>
        <Form<LoginFormValues>
          layout="vertical"
          initialValues={{ account: 'demo', password: 'demo123' }}
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              autoComplete="username"
              prefix={<UserOutlined />}
              placeholder="请输入账号"
              size="large"
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              autoComplete="current-password"
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>
          <Button block htmlType="submit" size="large" type="primary">
            登录
          </Button>
        </Form>
      </section>
    </main>
  );
}
