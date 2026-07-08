import {
  ApartmentOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FundProjectionScreenOutlined,
  LineChartOutlined,
  ProfileOutlined,
  ProjectOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Progress, Space, Table, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  customerRecords,
  documentRecords,
  investmentProjects,
  riskRecords,
  type CustomerRecord,
  type DocumentRecord,
  type InvestmentProject,
  type LifecycleStage,
  type ProjectStatus,
  type RiskLevel,
  type RiskRecord,
} from '../../mock/investment';

type ManagementKey = 'project' | 'customer' | 'risk' | 'document';

type MetricItem = {
  label: string;
  value: string;
  description: string;
};

type ManagementModule = {
  key: ManagementKey;
  navName: string;
  title: string;
  description: string;
  icon: ReactNode;
  metrics: MetricItem[];
  highlights: string[];
  handoff: {
    from: string;
    current: string;
    to: string;
  };
};

const modules: Record<ManagementKey, ManagementModule> = {
  project: {
    key: 'project',
    navName: '项目管理',
    title: '项目全生命周期管理',
    description: '以募、投、管、退为核心，覆盖新建项目、立项、尽调估值、投决合同、投后跟踪与退出复盘。',
    icon: <ProjectOutlined />,
    metrics: [
      { label: '募集中', value: '18', description: '已建档并等待认缴实缴的项目' },
      { label: '投决中', value: '26', description: '尽调、估值和投委会项目' },
      { label: '投后管理', value: '132', description: '进入经营跟踪的项目' },
      { label: '退出处理', value: '32', description: '退出准备、执行与复盘项目' },
    ],
    highlights: ['新建项目发起业务闭环', 'AI辅助尽调、估值参考和合同审查', '投后任务、风险规则和文档归档自动联动'],
    handoff: {
      from: '新建项目、客户出资意向、项目立项材料',
      current: '募投管退状态流转、任务分派、投决合同、投后与退出',
      to: '风险处置、文档归档、首页看板和智能体输出',
    },
  },
  customer: {
    key: 'customer',
    navName: '客户管理',
    title: '投资客户与出资人管理',
    description: '仅管理投资人、出资人和投资机构，维护认证、偏好、认缴实缴和回访记录，为项目募集阶段提供资金来源。',
    icon: <TeamOutlined />,
    metrics: [
      { label: '投资机构', value: '214', description: '机构客户和产业资本' },
      { label: '出资人', value: '126', description: '已关联认缴计划' },
      { label: '待认证', value: '16', description: '待完成资质与适当性审核' },
      { label: '本月回访', value: '42', description: '已生成客户跟进记录' },
    ],
    highlights: ['客户认证决定项目募集准入', '认缴实缴同步到项目详情', '客户回访影响后续投资额度与节奏'],
    handoff: {
      from: '客户拜访、投资人推荐、渠道导入',
      current: '客户录入、认证审核、投资偏好、认缴实缴和回访记录',
      to: '项目募集、投决资金确认、投后沟通和退出收益分配',
    },
  },
  risk: {
    key: 'risk',
    navName: '风险管理',
    title: '风险管理与监控',
    description: '接入尽调、合同、财报、工商、舆情和人工线索，持续识别项目募投管退过程中的风险并闭环处置。',
    icon: <WarningOutlined />,
    metrics: [
      { label: '高风险', value: '5', description: '需要优先处置的风险对象' },
      { label: '新增预警', value: '18', description: '近 7 日规则命中事件' },
      { label: '已闭环', value: '42', description: '完成确认和处置的事项' },
      { label: '平均闭环', value: '6.8天', description: '风险处置平均周期' },
    ],
    highlights: ['立项前做准入风险识别', '投后经营报告触发风险预警', '风险结论反写项目状态和退出策略'],
    handoff: {
      from: '项目资料、AI尽调、合同审核、财报经营报告和第三方数据',
      current: '风险识别、分级预警、责任分派、处置闭环',
      to: '项目暂停/继续、投后整改、退出策略和文档留痕',
    },
  },
  document: {
    key: 'document',
    navName: '文档管理',
    title: '文档管理',
    description: '统一管理立项、尽调、估值、投决、合同、投后报告和退出复盘材料，保证项目资料完整与可追溯。',
    icon: <FileProtectOutlined />,
    metrics: [
      { label: '立项材料', value: '86', description: '已结构化归档的项目材料' },
      { label: '尽调合同', value: '210', description: '报告、合同和补充协议' },
      { label: '投后报告', value: '96', description: '经营、财务和重大事项报告' },
      { label: '待归档', value: '11', description: '需要补齐或确认的文档' },
    ],
    highlights: ['业务动作自动生成归档任务', '审批文件和合同全流程留痕', '文档完整性反向约束项目流转'],
    handoff: {
      from: '立项审批、尽调估值、合同签署、投后报告、退出复盘',
      current: '文件归集、版本管理、审批留痕、缺失提醒',
      to: '项目可追溯档案、审计检查、首页统计和知识沉淀',
    },
  },
};

const flowSteps: Array<{
  module: ManagementKey;
  stage: LifecycleStage;
  title: string;
  description: string;
}> = [
  { module: 'project', stage: '募', title: '新建项目', description: '发起立项，确定项目来源、拟投金额和责任人' },
  { module: 'customer', stage: '募', title: '客户出资', description: '绑定投资人、出资人和投资机构，跟踪认缴实缴' },
  { module: 'project', stage: '投', title: '尽调投决', description: '完成尽调、估值参考、投委会、合同审核与交割' },
  { module: 'risk', stage: '管', title: '投后风控', description: '经营报告、财务报告、重大事项和风险处置闭环' },
  { module: 'document', stage: '退', title: '退出归档', description: '退出审批、收益测算、复盘报告和全量文档留痕' },
];

const stageCards = [
  { stage: '募' as const, title: '募集与立项', value: '18', description: '新建项目、投资人/出资人绑定、认缴实缴跟踪', icon: <ProjectOutlined /> },
  { stage: '投' as const, title: '投资决策', value: '26', description: '尽调报告、估值参考、投委会、合同审核与交割', icon: <AuditOutlined /> },
  { stage: '管' as const, title: '投后管理', value: '132', description: '经营跟踪、财务报告、重大事项和风险预警', icon: <SafetyCertificateOutlined /> },
  { stage: '退' as const, title: '退出管理', value: '32', description: '退出计划、收益测算、审批和退出复盘', icon: <CheckCircleOutlined /> },
];

const customerPieOption = {
  tooltip: {},
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '45%'],
      data: [
        { name: '投资机构', value: 48, itemStyle: { color: '#1677ff' } },
        { name: '出资人', value: 29, itemStyle: { color: '#13c2c2' } },
        { name: '投资人', value: 23, itemStyle: { color: '#faad14' } },
      ],
      label: { formatter: '{b}\\n{d}%', fontWeight: 700 },
    },
  ],
};

const customerFollowOption = {
  grid: { top: 24, right: 14, bottom: 28, left: 34 },
  tooltip: {},
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [28, 36, 44, 33, 56, 42], itemStyle: { color: '#69a8ff' }, barWidth: 22 }],
};

const riskTrendOption = {
  grid: { top: 28, right: 18, bottom: 34, left: 42 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '高风险', type: 'line', smooth: true, data: [3, 4, 5, 4, 6, 7, 5], itemStyle: { color: '#ff4d4f' } },
    { name: '中风险', type: 'bar', data: [9, 11, 13, 12, 15, 14, 16], itemStyle: { color: '#faad14' }, barWidth: 22 },
  ],
};

const documentArchiveOption = {
  tooltip: {},
  series: [
    {
      type: 'pie',
      radius: ['46%', '72%'],
      data: [
        { name: '立项文件', value: 86, itemStyle: { color: '#1677ff' } },
        { name: '尽调报告', value: 68, itemStyle: { color: '#13c2c2' } },
        { name: '合同文件', value: 142, itemStyle: { color: '#faad14' } },
        { name: '退出复盘', value: 31, itemStyle: { color: '#9254de' } },
      ],
      label: { fontWeight: 700 },
    },
  ],
};

const todoItems = [
  { title: '芯愿景软件尽调材料补充', date: '2026-07-08', type: '尽调' },
  { title: '电子连接器合同条款复核', date: '2026-07-08', type: '合同' },
  { title: '客户回访：厦门海峡投资有限公司', date: '2026-07-09', type: '客户' },
  { title: '高端装备退出方案审批', date: '2026-07-10', type: '退出' },
];

export default function BusinessManagementPage({
  moduleKey = 'project',
}: {
  moduleKey?: ManagementKey;
}) {
  const activeModule = modules[moduleKey] ?? modules.project;

  return (
    <main className="management-page">
      <section className="management-workspace">
        <header className="management-hero">
          <div>
            <span className="management-eyebrow">股权投资业务管理系统</span>
            <h1>{activeModule.navName}</h1>
            <p>{activeModule.description}</p>
          </div>
          <HeaderActions moduleKey={activeModule.key} />
        </header>

        <ModuleFocus module={activeModule} />
        <ModuleMetrics metrics={activeModule.metrics} />
        <BusinessFlow activeKey={activeModule.key} />
        {renderModuleContent(activeModule.key)}
      </section>
    </main>
  );
}

function HeaderActions({ moduleKey }: { moduleKey: ManagementKey }) {
  if (moduleKey === 'project') {
    return (
      <Space>
        <Button icon={<DatabaseOutlined />}>项目看板</Button>
        <Button icon={<ProjectOutlined />} type="primary">
          新建项目
        </Button>
      </Space>
    );
  }

  if (moduleKey === 'customer') {
    return (
      <Space>
        <Button icon={<TeamOutlined />}>客户认证</Button>
        <Button icon={<UploadOutlined />} type="primary">
          导入客户
        </Button>
      </Space>
    );
  }

  if (moduleKey === 'risk') {
    return (
      <Space>
        <Button icon={<RobotOutlined />}>AI研判</Button>
        <Button icon={<WarningOutlined />} type="primary">
          批量分派
        </Button>
      </Space>
    );
  }

  return (
    <Space>
      <Button icon={<FileSearchOutlined />}>缺失检查</Button>
      <Button icon={<UploadOutlined />} type="primary">
        上传文件
      </Button>
    </Space>
  );
}

function ModuleFocus({ module }: { module: ManagementModule }) {
  return (
    <section className="management-focus-panel">
      <div className="management-focus-panel__icon">{module.icon}</div>
      <div>
        <h2>{module.title}</h2>
        <p>{module.description}</p>
      </div>
      <ul>
        {module.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function ModuleMetrics({ metrics }: { metrics: MetricItem[] }) {
  return (
    <section className="management-module-overview">
      {metrics.map((item) => (
        <article key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}

function BusinessFlow({ activeKey }: { activeKey: ManagementKey }) {
  return (
    <section className="management-flow-panel">
      <div className="management-section-title">
        <h2>
          <ApartmentOutlined />
          业务流转关系
        </h2>
        <Tag color="blue">从新建项目发起，贯穿募、投、管、退</Tag>
      </div>
      <div className="management-flow management-flow--compact">
        {flowSteps.map((item, index) => (
          <div
            className={`management-flow__step ${item.module === activeKey ? 'is-active' : ''}`}
            key={item.title}
          >
            <span>{item.stage}</span>
            <strong>
              {index + 1}. {item.title}
            </strong>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModuleHandoff({ moduleKey }: { moduleKey: ManagementKey }) {
  const handoff = modules[moduleKey].handoff;
  const items = [
    { label: '上游输入', value: handoff.from },
    { label: '当前处理', value: handoff.current },
    { label: '下游输出', value: handoff.to },
  ];

  return (
    <section className="management-handoff">
      {items.map((item) => (
        <article key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}

function renderModuleContent(moduleKey: ManagementKey) {
  switch (moduleKey) {
    case 'customer':
      return <CustomerContent />;
    case 'risk':
      return <RiskContent />;
    case 'document':
      return <DocumentContent />;
    case 'project':
    default:
      return <ProjectContent />;
  }
}

function ProjectContent() {
  const columns: ColumnsType<InvestmentProject> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 280,
      render: (_, row) => (
        <div className="management-company-cell">
          <Link to={`/projects/${row.id}`}>{row.name}</Link>
          <span>{row.company.name}</span>
        </div>
      ),
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      width: 82,
      render: (stage: LifecycleStage) => (
        <Tag color={stageColor(stage)} className="management-stage-tag">
          {stage}
        </Tag>
      ),
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      width: 112,
      render: (status: ProjectStatus) => (
        <Tag color={projectStatusColor(status)} className="management-status-tag">
          {status}
        </Tag>
      ),
    },
    { title: '拟投金额', dataIndex: 'targetAmount', width: 110 },
    { title: '认缴金额', dataIndex: 'committedAmount', width: 110 },
    { title: '实缴金额', dataIndex: 'paidAmount', width: 110 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 150,
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: '风险',
      dataIndex: 'risk',
      width: 82,
      render: (risk: RiskLevel) => <Tag color={riskColor(risk)}>{risk}</Tag>,
    },
    { title: '下一步', dataIndex: 'nextAction', width: 280 },
    { title: 'AI建议', dataIndex: 'aiAdvice', width: 360 },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="project" />
      <section className="management-stage-grid" aria-label="项目全生命周期">
        {stageCards.map((item) => (
          <article className="management-stage-card" key={item.stage}>
            <div>
              <span>{item.stage}</span>
              {item.icon}
            </div>
            <strong>{item.value}</strong>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
      <section className="management-grid management-grid--project">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <FundProjectionScreenOutlined />
              项目列表
            </h2>
            <Button size="small" type="link">
              查看全部
            </Button>
          </div>
          <Table<InvestmentProject>
            columns={columns}
            dataSource={investmentProjects}
            pagination={{ pageSize: 7 }}
            rowKey="id"
            scroll={{ x: 1660 }}
          />
        </article>
        <aside className="management-panel">
          <div className="management-section-title">
            <h2>
              <RobotOutlined />
              AI项目助手
            </h2>
          </div>
          <div className="management-ai-card">
            <strong>87</strong>
            <span>今日项目健康度</span>
          </div>
          <ul className="management-ai-list">
            <li>3 个项目需要补充尽调材料，已生成材料清单。</li>
            <li>2 个合同审核任务待法务确认，集中在付款条件和回购条款。</li>
            <li>1 个退出项目存在价格敏感性风险，建议复核退出测算。</li>
          </ul>
        </aside>
      </section>
    </>
  );
}

function CustomerContent() {
  const columns: ColumnsType<CustomerRecord> = [
    { title: '客户名称', dataIndex: 'name', width: 220 },
    { title: '客户类型', dataIndex: 'kind', width: 110, render: (kind) => <Tag color="blue">{kind}</Tag> },
    { title: '联系人', dataIndex: 'contact', width: 110 },
    { title: '来源', dataIndex: 'source', width: 120 },
    { title: '投资偏好', dataIndex: 'preference', width: 190 },
    { title: '认缴', dataIndex: 'committed', width: 100 },
    { title: '实缴', dataIndex: 'paid', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '待认证' ? 'orange' : 'blue'}>{status}</Tag> },
    { title: '下一步', dataIndex: 'nextAction', width: 280 },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="customer" />
      <section className="management-grid management-grid--middle">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <TeamOutlined />
              投资客户结构
            </h2>
          </div>
          <div className="management-chart-split">
            <ReactECharts option={customerPieOption} style={{ height: 240 }} />
            <ReactECharts option={customerFollowOption} style={{ height: 240 }} />
          </div>
        </article>
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <ClockCircleOutlined />
              募集与回访任务
            </h2>
          </div>
          <div className="management-list">
            {todoItems.map((item) => (
              <button key={item.title}>
                <span>{item.type}</span>
                <strong>{item.title}</strong>
                <em>{item.date}</em>
              </button>
            ))}
          </div>
        </article>
      </section>
      <section className="management-panel">
        <div className="management-section-title">
          <h2>
            <ProfileOutlined />
            投资客户台账
          </h2>
          <Button icon={<UploadOutlined />} size="small">
            导入客户
          </Button>
        </div>
        <Table<CustomerRecord>
          columns={columns}
          dataSource={customerRecords}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1320 }}
        />
      </section>
    </>
  );
}

function RiskContent() {
  const columns: ColumnsType<RiskRecord> = [
    { title: '项目', dataIndex: 'projectName', width: 220 },
    { title: '风险对象', dataIndex: 'object', width: 140 },
    { title: '等级', dataIndex: 'level', width: 90, render: (level: RiskLevel) => <Tag color={riskColor(level)}>{level}</Tag> },
    { title: '类型', dataIndex: 'type', width: 120 },
    { title: '来源', dataIndex: 'source', width: 160 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '已闭环' ? 'green' : 'orange'}>{status}</Tag> },
    { title: '处置动作', dataIndex: 'action', width: 300 },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="risk" />
      <section className="management-grid management-grid--project">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <WarningOutlined />
              风险事件
            </h2>
            <Button size="small">批量分派</Button>
          </div>
          <Table<RiskRecord>
            columns={columns}
            dataSource={riskRecords}
            pagination={false}
            rowKey="id"
            scroll={{ x: 1220 }}
          />
        </article>
        <aside className="management-panel">
          <div className="management-section-title">
            <h2>
              <RobotOutlined />
              AI风险研判
            </h2>
          </div>
          <div className="management-ai-card management-ai-card--risk">
            <strong>5</strong>
            <span>高风险待处理</span>
          </div>
          <ul className="management-ai-list">
            <li>退出价格风险需同步项目负责人、风控和法务。</li>
            <li>合同条款风险会阻断项目交割节点。</li>
            <li>处置结论会写回项目详情和文档档案。</li>
          </ul>
        </aside>
      </section>
      <section className="management-panel">
        <div className="management-section-title">
          <h2>
            <LineChartOutlined />
            风险趋势
          </h2>
        </div>
        <ReactECharts option={riskTrendOption} style={{ height: 300 }} />
      </section>
    </>
  );
}

function DocumentContent() {
  const columns: ColumnsType<DocumentRecord> = [
    { title: '文件名称', dataIndex: 'name', width: 260 },
    { title: '关联项目', dataIndex: 'projectName', width: 240 },
    { title: '类型', dataIndex: 'type', width: 110 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '已归档' ? 'green' : 'orange'}>{status}</Tag> },
    { title: '更新时间', dataIndex: 'updatedAt', width: 120 },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="document" />
      <section className="management-grid management-grid--middle">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <FileProtectOutlined />
              文档归档结构
            </h2>
          </div>
          <ReactECharts option={documentArchiveOption} style={{ height: 280 }} />
        </article>
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <FileDoneOutlined />
              审批与归档链路
            </h2>
          </div>
          <Timeline
            items={[
              { dot: <ProjectOutlined />, children: '新建项目后自动生成立项材料清单' },
              { dot: <AuditOutlined />, children: '尽调报告、估值材料和投委会材料进入审批' },
              { dot: <ClockCircleOutlined />, children: '合同签署后自动生成投后任务和风险规则' },
              { dot: <FileProtectOutlined />, children: '退出完成后归档复盘报告，形成项目全生命周期档案' },
            ]}
          />
        </article>
      </section>
      <section className="management-panel">
        <div className="management-section-title">
          <h2>
            <ProfileOutlined />
            文件台账
          </h2>
          <Button icon={<UploadOutlined />} size="small" type="primary">
            上传文件
          </Button>
        </div>
        <Table<DocumentRecord>
          columns={columns}
          dataSource={documentRecords}
          pagination={false}
          rowKey="id"
          scroll={{ x: 920 }}
        />
      </section>
    </>
  );
}

function stageColor(stage: LifecycleStage) {
  const colors: Record<LifecycleStage, string> = {
    募: 'gold',
    投: 'blue',
    管: 'cyan',
    退: 'purple',
  };
  return colors[stage];
}

function projectStatusColor(status: ProjectStatus) {
  const colors: Record<ProjectStatus, string> = {
    草稿: 'default',
    待立项: 'default',
    募集中: 'gold',
    尽调中: 'geekblue',
    估值中: 'cyan',
    投决中: 'blue',
    合同中: 'purple',
    交割中: 'processing',
    投后管理: 'green',
    退出准备: 'volcano',
    退出中: 'magenta',
    已退出: 'success',
    已终止: 'red',
  };
  return colors[status];
}

function riskColor(level: RiskLevel) {
  const colors: Record<RiskLevel, string> = {
    高: 'red',
    中: 'orange',
    低: 'green',
  };
  return colors[level];
}
