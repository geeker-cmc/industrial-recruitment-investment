import {
  ApartmentOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FundProjectionScreenOutlined,
  PieChartOutlined,
  ProfileOutlined,
  ProjectOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Progress, Space, Table, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { ReactNode } from 'react';
import { companies, type CompanyProfile } from '../../mock/industry';

type LifecycleStage = '募' | '投' | '管' | '退';
type ManagementKey = 'project' | 'customer' | 'fund' | 'risk' | 'data' | 'document';

type ProjectRecord = {
  id: string;
  company: CompanyProfile;
  stage: LifecycleStage;
  fund: string;
  amount: string;
  owner: string;
  progress: number;
  risk: '高' | '中' | '低';
  nextAction: string;
  aiAdvice: string;
};

type ManagementModule = {
  key: ManagementKey;
  title: string;
  description: string;
  icon: ReactNode;
};

const pickCompany = (index: number) => companies[index] ?? companies[0]!;

const stageCards = [
  {
    stage: '募',
    title: '募集与立项',
    value: '18',
    description: '基金募集、项目立项、产业洞察线索转项目',
    icon: <ProjectOutlined />,
  },
  {
    stage: '投',
    title: '投资决策',
    value: '26',
    description: '尽调、估值、投委会、合同签署',
    icon: <AuditOutlined />,
  },
  {
    stage: '管',
    title: '投后管理',
    value: '132',
    description: '经营跟踪、风险预警、投后任务',
    icon: <SafetyCertificateOutlined />,
  },
  {
    stage: '退',
    title: '退出管理',
    value: '32',
    description: '退出计划、收益测算、退出复盘',
    icon: <CheckCircleOutlined />,
  },
];

const modules: ManagementModule[] = [
  {
    key: 'project',
    title: '项目全生命周期管理',
    description: '以募、投、管、退为核心，覆盖立项、合同、投后跟踪与退出。',
    icon: <ProjectOutlined />,
  },
  {
    key: 'customer',
    title: '客户管理',
    description: '管理自然人与机构客户，支持录入、评估、回访与认证审核。',
    icon: <TeamOutlined />,
  },
  {
    key: 'fund',
    title: '基金管理',
    description: '管理基金募集、基金财务、运营跟踪、基金退出与基金管理人。',
    icon: <BankOutlined />,
  },
  {
    key: 'risk',
    title: '风险管理与监控',
    description: '接入财报、第三方数据和人工录入，识别企业与项目潜在风险。',
    icon: <WarningOutlined />,
  },
  {
    key: 'data',
    title: '数据统计与决策支持',
    description: '提供数据大屏和多维统计，为投资决策与资源配置提供依据。',
    icon: <BarChartOutlined />,
  },
  {
    key: 'document',
    title: '文档管理',
    description: '统一存储尽调报告、合同、审批文件，保证资料完整可追溯。',
    icon: <FileProtectOutlined />,
  },
];

const moduleHighlights: Record<ManagementKey, string[]> = {
  project: ['从产业洞察线索一键生成项目', '统一跟踪立项、尽调、合同、投后和退出节点', 'AI自动提示材料缺口和下一步动作'],
  customer: ['维护自然人与机构客户档案', '支持客户回访、认证审核和投资偏好记录', '沉淀客户与项目、基金之间的关联关系'],
  fund: ['管理基金募集、出资、财务和运营状态', '关联基金管理人、项目组合和退出收益', '为项目立项提供基金匹配建议'],
  risk: ['接入财报、工商、舆情和人工风险线索', '按企业、项目、基金多维度识别风险', '自动生成预警任务和处置建议'],
  data: ['提供项目、客户、基金、收益和风险统计', '支持数据大屏和经营驾驶舱', '辅助投资决策和资源配置'],
  document: ['统一归档尽调报告、合同和审批文件', '记录文件版本、审批流和责任人', '形成项目全生命周期可追溯档案'],
};

const moduleNames: Record<ManagementKey, string> = {
  project: '项目管理',
  customer: '客户管理',
  fund: '基金管理',
  risk: '风险管理',
  data: '数据统计',
  document: '文档管理',
};

const moduleMetrics: Record<
  ManagementKey,
  Array<{ label: string; value: string; description: string }>
> = {
  project: [
    { label: '正在募集', value: '18', description: '从产业洞察转入的储备项目' },
    { label: '正在决策', value: '26', description: '尽调、估值和投委会项目' },
    { label: '正在管理', value: '132', description: '进入投后跟踪的项目' },
    { label: '已退出', value: '32', description: '完成退出与复盘归档' },
  ],
  customer: [
    { label: '机构客户', value: '214', description: '基金管理人、合作机构与投资人' },
    { label: '自然人客户', value: '238', description: '投资人、专家和企业联系人' },
    { label: '待认证', value: '16', description: '待完成认证审核的客户' },
    { label: '本月回访', value: '42', description: '已生成客户跟进记录' },
  ],
  fund: [
    { label: '在管基金', value: '12', description: '覆盖产业基金、母基金和专项基金' },
    { label: '募集规模', value: '38.6亿', description: '已认缴与拟募集资金规模' },
    { label: '已投项目', value: '92', description: '基金组合内投资项目' },
    { label: '退出收益', value: '12.5亿', description: '历史退出形成的收益' },
  ],
  risk: [
    { label: '高风险企业', value: '5', description: '需要优先处置的风险对象' },
    { label: '新增预警', value: '18', description: '近 7 日规则命中事件' },
    { label: '已闭环', value: '42', description: '完成确认和处置的风险事项' },
    { label: '规则命中率', value: '78%', description: '有效预警规则覆盖率' },
  ],
  data: [
    { label: '数据主题', value: '18', description: '项目、基金、客户和风险主题' },
    { label: '统计报表', value: '36', description: '支持经营分析和投决汇报' },
    { label: '大屏指标', value: '128', description: '可视化驾驶舱指标' },
    { label: '决策报告', value: '9', description: 'AI辅助生成的投研分析报告' },
  ],
  document: [
    { label: '尽调报告', value: '68', description: '已结构化归档的尽调材料' },
    { label: '合同文件', value: '142', description: '投资协议、补充协议与附件' },
    { label: '审批文件', value: '96', description: '立项、投委会和退出审批资料' },
    { label: '待归档', value: '11', description: '需要补齐或确认的业务文档' },
  ],
};

const projectRows: ProjectRecord[] = [
  {
    id: 'project-001',
    company: pickCompany(3),
    stage: '投',
    fund: '电子信息产业基金一期',
    amount: '3,000万',
    owner: '张小令',
    progress: 68,
    risk: '中',
    nextAction: '补充三年审计报告并进入估值复核',
    aiAdvice: '产业图谱显示其位于关键补链节点，建议重点核验核心客户稳定性。',
  },
  {
    id: 'project-002',
    company: pickCompany(4),
    stage: '管',
    fund: '智能制造专项基金',
    amount: '5,000万',
    owner: '陈璇',
    progress: 82,
    risk: '低',
    nextAction: '跟进二季度经营报告和订单回款',
    aiAdvice: '经营指标优于投后计划，建议同步准备追加投资论证。',
  },
  {
    id: 'project-003',
    company: pickCompany(5),
    stage: '募',
    fund: '数字经济母基金',
    amount: '2,000万',
    owner: '李华',
    progress: 36,
    risk: '中',
    nextAction: '完成客户认证审核并发起项目立项',
    aiAdvice: '与区域重点产业匹配度高，可从产业洞察模块补充市场空间材料。',
  },
  {
    id: 'project-004',
    company: pickCompany(6),
    stage: '退',
    fund: '高端装备并购基金',
    amount: '4,200万',
    owner: '周宁',
    progress: 91,
    risk: '高',
    nextAction: '复核退出价格和回购触发条款',
    aiAdvice: '近期工商与舆情存在波动，退出方案需增加风险折价敏感性测算。',
  },
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
        { name: '机构客户', value: 47.37, itemStyle: { color: '#1677ff' } },
        { name: '自然人', value: 52.63, itemStyle: { color: '#13c2c2' } },
      ],
      label: { formatter: '{b}\\n{d}%', fontWeight: 700 },
    },
  ],
};

const newCustomerOption = {
  grid: { top: 24, right: 14, bottom: 28, left: 34 },
  tooltip: {},
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: [34, 41, 46, 25, 55, 33],
      itemStyle: { color: '#69a8ff' },
      barWidth: 22,
    },
  ],
};

const fundTrendOption = {
  grid: { top: 34, right: 20, bottom: 30, left: 44 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025', '2026E'] },
  yAxis: { type: 'value', name: '亿元' },
  series: [
    {
      name: '总投资成本',
      type: 'bar',
      data: [238, 426, 528, 485, 516],
      itemStyle: { color: '#1677ff' },
      barWidth: 26,
    },
    {
      name: '总退出收益',
      type: 'line',
      smooth: true,
      data: [53, 102, 135, 98, 125],
      itemStyle: { color: '#fa8c16' },
    },
  ],
};

const todoItems = [
  { title: '未来黑科技项目立项申请', date: '2026-07-08', type: '项目审批' },
  { title: '松鼠传媒项目尽调合同签署', date: '2026-07-08', type: '合同' },
  { title: '客户回访：厦门海峡投资有限公司', date: '2026-07-09', type: '客户' },
  { title: '云丹网络项目退出意见', date: '2026-07-10', type: '退出' },
];

const notices = [
  '五一放假通知',
  '关于未来黑科技项目立项审批通知',
  '松鼠传媒项目尽调报告归档提醒',
  '云丹网络项目退出意见',
];

const riskAlerts = [
  { company: '中央乡川电子科技有限公司', risk: '司法冻结', level: '4级', status: '待处置' },
  { company: '南方物流科技集团股份有限公司', risk: '流动比率下滑', level: '3级', status: '跟进中' },
  { company: '华芯科技有限责任公司', risk: '重要股东变更', level: '3级', status: '已确认' },
];

const flowSteps = [
  { title: '产业洞察', description: '从产业链、区域重点产业和企业分布中发现机会' },
  { title: '客户建档', description: '录入自然人、机构客户和目标企业基础资料' },
  { title: '项目立项', description: '匹配基金、确定投资主体并进入项目池' },
  { title: '尽调估值', description: 'AI辅助材料核验、风险识别和估值区间测算' },
  { title: '投决合同', description: '形成投委会材料并完成合同审批和签署' },
  { title: '投后监控', description: '跟踪财务、经营、风险预警和投后任务' },
  { title: '退出复盘', description: '执行退出计划，沉淀收益归因和复盘结论' },
  { title: '文档归档', description: '沉淀合同、报告和审批文件，形成可追溯资产库' },
];

const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1);
const calendarMarks = new Map([
  [6, '客户'],
  [9, '投委会'],
  [21, '复核'],
  [23, '合同'],
]);

export default function BusinessManagementPage({
  moduleKey = 'project',
}: {
  moduleKey?: ManagementKey;
}) {
  const activeModule = modules.find((item) => item.key === moduleKey) ?? modules[0]!;
  const activeHighlights = moduleHighlights[activeModule.key] ?? [];

  const columns: ColumnsType<ProjectRecord> = [
    {
      title: '项目企业',
      dataIndex: ['company', 'name'],
      width: 260,
      render: (_, row) => (
        <div className="management-company-cell">
          <strong>{row.company.name}</strong>
          <span>{row.fund}</span>
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
      title: '拟投金额',
      dataIndex: 'amount',
      width: 110,
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      width: 90,
    },
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
      render: (risk: ProjectRecord['risk']) => (
        <Tag color={risk === '高' ? 'red' : risk === '中' ? 'orange' : 'green'}>
          {risk}
        </Tag>
      ),
    },
    {
      title: '下一步',
      dataIndex: 'nextAction',
      width: 260,
    },
    {
      title: 'AI建议',
      dataIndex: 'aiAdvice',
      width: 360,
    },
  ];

  return (
    <main className="management-page">
      <section className="management-workspace">
        <header className="management-hero">
          <div>
            <span className="management-eyebrow">股权投资业务管理系统</span>
            <h1>{moduleNames[activeModule.key]}</h1>
            <p>
              以“募、投、管、退”为核心，串联产业洞察、客户建档、基金匹配、项目立项、
              尽调估值、合同审批、投后监控、退出复盘与文档归档。
            </p>
          </div>
          <Space>
            <Button icon={<DatabaseOutlined />}>数据大屏</Button>
            <Button icon={<ProjectOutlined />} type="primary">
              新建项目
            </Button>
          </Space>
        </header>

        <section className="management-focus-panel">
          <div className="management-focus-panel__icon">
            {activeModule.icon}
          </div>
          <div>
            <h2>{activeModule.title}</h2>
            <p>{activeModule.description}</p>
          </div>
          <ul>
            {activeHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="management-module-overview">
          {moduleMetrics[activeModule.key].map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

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

        <section className="management-flow-panel">
          <div className="management-section-title">
            <h2>
              <ApartmentOutlined />
              完整业务闭环
            </h2>
            <Tag color="blue">产业洞察驱动项目生成</Tag>
          </div>
          <div className="management-flow">
            {flowSteps.map((item, index) => (
              <div className="management-flow__step" key={item.title}>
                <span>{index + 1}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="management-grid management-grid--project">
          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <FundProjectionScreenOutlined />
                我的项目
              </h2>
              <Button size="small" type="link">
                查看全部
              </Button>
            </div>
            <Table<ProjectRecord>
              columns={columns}
              dataSource={projectRows}
              pagination={false}
              rowKey="id"
              scroll={{ x: 1400 }}
            />
          </article>

          <aside className="management-panel">
            <div className="management-section-title">
              <h2>
                <RobotOutlined />
                AI投研助手
              </h2>
            </div>
            <div className="management-ai-card">
              <strong>87</strong>
              <span>今日项目健康度</span>
            </div>
            <ul className="management-ai-list">
              <li>3 个项目需要补充尽调材料，已生成材料清单。</li>
              <li>1 个退出项目存在价格敏感性风险，建议复核回购条款。</li>
              <li>产业洞察模块新增 6 条可转项目线索。</li>
            </ul>
          </aside>
        </section>

        <section className="management-grid management-grid--middle">
          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <TeamOutlined />
                我的客户
              </h2>
            </div>
            <div className="management-chart-split">
              <ReactECharts option={customerPieOption} style={{ height: 220 }} />
              <ReactECharts option={newCustomerOption} style={{ height: 220 }} />
            </div>
          </article>

          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <PieChartOutlined />
                基金与收益
              </h2>
            </div>
            <ReactECharts option={fundTrendOption} style={{ height: 250 }} />
          </article>
        </section>

        <section className="management-grid management-grid--side">
          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <BellOutlined />
                待办事项
              </h2>
              <Button size="small" type="link">
                添加
              </Button>
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

          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <ProfileOutlined />
                通知公告
              </h2>
              <Button size="small" type="link">
                更多
              </Button>
            </div>
            <div className="management-notices">
              {notices.map((item, index) => (
                <button key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                  <em>2026-07-{String(index + 6).padStart(2, '0')}</em>
                </button>
              ))}
            </div>
          </article>

          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <CalendarOutlined />
                我的日程
              </h2>
            </div>
            <div className="management-calendar">
              {calendarDays.map((day) => (
                <span key={day} className={calendarMarks.has(day) ? 'has-event' : ''}>
                  {day}
                  {calendarMarks.has(day) && <small>{calendarMarks.get(day)}</small>}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="management-grid management-grid--bottom">
          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <WarningOutlined />
                风险预警
              </h2>
              <Button size="small" type="link">
                更多
              </Button>
            </div>
            <div className="management-risk-table">
              {riskAlerts.map((item) => (
                <div key={item.company}>
                  <strong>{item.company}</strong>
                  <span>{item.risk}</span>
                  <Tag color={item.level === '4级' ? 'red' : 'orange'}>{item.level}</Tag>
                  <em>{item.status}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="management-panel">
            <div className="management-section-title">
              <h2>
                <FileDoneOutlined />
                文档与审批流
              </h2>
            </div>
            <Timeline
              items={[
                {
                  dot: <FileSearchOutlined />,
                  children: '产业洞察报告已关联到未来黑科技项目',
                },
                {
                  dot: <AuditOutlined />,
                  children: '尽调报告、估值模型和投委会材料进入审批',
                },
                {
                  dot: <ClockCircleOutlined />,
                  children: '合同签署后自动生成投后任务和风险管理规则',
                },
                {
                  dot: <FileProtectOutlined />,
                  children: '退出完成后归档复盘报告，形成项目全生命周期档案',
                },
              ]}
            />
          </article>
        </section>
      </section>
    </main>
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
