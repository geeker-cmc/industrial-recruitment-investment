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
  LineChartOutlined,
  PieChartOutlined,
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
import { companies, type CompanyProfile } from '../../mock/industry';

type LifecycleStage = '募' | '投' | '管' | '退';
type ManagementKey = 'project' | 'customer' | 'fund' | 'risk' | 'data' | 'document';
type ProjectStatus = '待立项' | '尽调中' | '投决中' | '合同中' | '投后管理' | '退出中' | '已退出';

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

type ProjectRecord = {
  id: string;
  company: CompanyProfile;
  stage: LifecycleStage;
  status: ProjectStatus;
  fund: string;
  amount: string;
  owner: string;
  progress: number;
  risk: '高' | '中' | '低';
  nextAction: string;
  aiAdvice: string;
};

type CustomerRecord = {
  id: string;
  name: string;
  type: string;
  contact: string;
  source: string;
  status: string;
  nextAction: string;
};

type FundRecord = {
  id: string;
  name: string;
  manager: string;
  scale: string;
  invested: string;
  available: string;
  status: string;
};

type RiskRecord = {
  id: string;
  company: string;
  level: '高' | '中' | '低';
  type: string;
  source: string;
  owner: string;
  action: string;
};

type ReportRecord = {
  id: string;
  name: string;
  topic: string;
  owner: string;
  status: string;
  output: string;
};

type DocumentRecord = {
  id: string;
  name: string;
  project: string;
  type: string;
  owner: string;
  status: string;
};

const pickCompany = (index: number) => companies[index] ?? companies[0]!;

const modules: Record<ManagementKey, ManagementModule> = {
  project: {
    key: 'project',
    navName: '项目管理',
    title: '项目全生命周期管理',
    description: '以募、投、管、退为核心，覆盖项目立项、尽调估值、投决合同、投后跟踪与退出复盘。',
    icon: <ProjectOutlined />,
    metrics: [
      { label: '正在募集', value: '18', description: '从产业洞察转入的储备项目' },
      { label: '正在决策', value: '26', description: '尽调、估值和投委会项目' },
      { label: '正在管理', value: '132', description: '进入投后跟踪的项目' },
      { label: '已退出', value: '32', description: '完成退出与复盘归档' },
    ],
    highlights: ['产业洞察线索进入项目池', 'AI辅助尽调、估值和合同审查', '投后任务、风险规则和文档自动生成'],
    handoff: {
      from: '产业洞察 / 客户建档 / 基金可投额度',
      current: '项目立项、尽调估值、投决合同、投后跟踪',
      to: '风险管理、数据统计、文档归档、退出复盘',
    },
  },
  customer: {
    key: 'customer',
    navName: '客户管理',
    title: '客户管理',
    description: '管理自然人与机构客户，维护投资人、合作机构、被投企业联系人和回访认证记录。',
    icon: <TeamOutlined />,
    metrics: [
      { label: '机构客户', value: '214', description: '基金管理人、合作机构与投资人' },
      { label: '自然人客户', value: '238', description: '投资人、专家和企业联系人' },
      { label: '待认证', value: '16', description: '待完成认证审核的客户' },
      { label: '本月回访', value: '42', description: '已生成客户跟进记录' },
    ],
    highlights: ['客户档案与项目企业打通', '客户认证决定项目准入', '回访结果沉淀到投后与风控'],
    handoff: {
      from: '产业洞察筛选企业、合作机构推荐、基金募集线索',
      current: '客户录入、认证审核、回访记录、投资偏好维护',
      to: '项目立项、基金募集、投后沟通和风险处置责任人',
    },
  },
  fund: {
    key: 'fund',
    navName: '基金管理',
    title: '基金管理',
    description: '管理基金募集、出资、财务、组合、运营与退出收益，为项目投资提供资金和约束条件。',
    icon: <BankOutlined />,
    metrics: [
      { label: '在管基金', value: '12', description: '覆盖产业基金、母基金和专项基金' },
      { label: '募集规模', value: '38.6亿', description: '已认缴与拟募集资金规模' },
      { label: '已投项目', value: '92', description: '基金组合内投资项目' },
      { label: '退出收益', value: '12.5亿', description: '历史退出形成的收益' },
    ],
    highlights: ['基金额度约束投资决策', '基金管理人和客户档案关联', '收益、退出与复盘回流到数据统计'],
    handoff: {
      from: '客户出资、基金募集计划、产业投资策略',
      current: '基金财务、投资组合、运营监控、退出分配',
      to: '项目额度匹配、投资决策、收益统计和退出复盘',
    },
  },
  risk: {
    key: 'risk',
    navName: '风险管理',
    title: '风险管理与监控',
    description: '接入财报、工商、舆情、合同和人工线索，持续识别项目、企业与基金层面的风险。',
    icon: <WarningOutlined />,
    metrics: [
      { label: '高风险企业', value: '5', description: '需要优先处置的风险对象' },
      { label: '新增预警', value: '18', description: '近 7 日规则命中事件' },
      { label: '已闭环', value: '42', description: '完成确认和处置的风险事项' },
      { label: '规则命中率', value: '78%', description: '有效预警规则覆盖率' },
    ],
    highlights: ['项目立项前做准入风险识别', '投后经营报告触发风险预警', '风险结论反写到项目与复盘'],
    handoff: {
      from: '项目资料、财报经营报告、合同条款、第三方数据',
      current: '风险识别、分级预警、责任分派、处置闭环',
      to: '项目暂停/继续、投后整改、退出策略和文档留痕',
    },
  },
  data: {
    key: 'data',
    navName: '数据统计',
    title: '数据统计与决策支持',
    description: '汇聚项目、客户、基金、风险与文档数据，形成驾驶舱、报表和投研决策支持。',
    icon: <BarChartOutlined />,
    metrics: [
      { label: '数据主题', value: '18', description: '项目、基金、客户和风险主题' },
      { label: '统计报表', value: '36', description: '支持经营分析和投决汇报' },
      { label: '大屏指标', value: '128', description: '可视化驾驶舱指标' },
      { label: '决策报告', value: '9', description: 'AI辅助生成的投研分析报告' },
    ],
    highlights: ['打通各模块数据形成数据大屏', 'AI生成投决和复盘摘要', '统计结论反馈项目策略和基金配置'],
    handoff: {
      from: '项目、客户、基金、风险和文档的结构化数据',
      current: '指标建模、报表统计、投研分析、经营驾驶舱',
      to: '投资决策、资源配置、基金复盘和管理层汇报',
    },
  },
  document: {
    key: 'document',
    navName: '文档管理',
    title: '文档管理',
    description: '统一管理尽调报告、合同、审批文件、经营报告和复盘材料，保证资料完整与可追溯。',
    icon: <FileProtectOutlined />,
    metrics: [
      { label: '尽调报告', value: '68', description: '已结构化归档的尽调材料' },
      { label: '合同文件', value: '142', description: '投资协议、补充协议与附件' },
      { label: '审批文件', value: '96', description: '立项、投委会和退出审批资料' },
      { label: '待归档', value: '11', description: '需要补齐或确认的业务文档' },
    ],
    highlights: ['业务动作自动生成归档任务', '审批文件和合同全流程留痕', '文档完整性反向约束项目流转'],
    handoff: {
      from: '立项审批、尽调估值、合同签署、投后报告、退出复盘',
      current: '文件归集、版本管理、审批留痕、缺失提醒',
      to: '项目可追溯档案、审计检查、数据统计和知识沉淀',
    },
  },
};

const flowSteps: Array<{ key: ManagementKey | 'industry'; title: string; description: string }> = [
  { key: 'industry', title: '产业洞察', description: '发现产业链机会和目标企业' },
  { key: 'customer', title: '客户建档', description: '录入客户、机构和企业联系人' },
  { key: 'project', title: '项目立项', description: '完成准入、尽调、估值和合同' },
  { key: 'fund', title: '基金匹配', description: '匹配基金额度和投资策略' },
  { key: 'risk', title: '风险处置', description: '预警、分派、处置和闭环' },
  { key: 'data', title: '数据决策', description: '形成报表、驾驶舱和AI摘要' },
  { key: 'document', title: '文档归档', description: '沉淀合同、报告和审批材料' },
];

const stageCards = [
  { stage: '募', title: '募集与立项', value: '18', description: '基金募集、项目立项、产业洞察线索转项目', icon: <ProjectOutlined /> },
  { stage: '投', title: '投资决策', value: '26', description: '尽调、估值、投委会、合同签署', icon: <AuditOutlined /> },
  { stage: '管', title: '投后管理', value: '132', description: '经营跟踪、风险预警、投后任务', icon: <SafetyCertificateOutlined /> },
  { stage: '退', title: '退出管理', value: '32', description: '退出计划、收益测算、退出复盘', icon: <CheckCircleOutlined /> },
];

const projectRows: ProjectRecord[] = [
  {
    id: 'project-001',
    company: pickCompany(3),
    stage: '投',
    status: '尽调中',
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
    status: '投后管理',
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
    status: '待立项',
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
    status: '退出中',
    fund: '高端装备并购基金',
    amount: '4,200万',
    owner: '周宁',
    progress: 91,
    risk: '高',
    nextAction: '复核退出价格和回购触发条款',
    aiAdvice: '近期工商与舆情存在波动，退出方案需增加风险折价敏感性测算。',
  },
  {
    id: 'project-005',
    company: pickCompany(7),
    stage: '投',
    status: '投决中',
    fund: '智能制造专项基金',
    amount: '4,800万',
    owner: '王敏',
    progress: 74,
    risk: '中',
    nextAction: '提交投委会材料并确认投资额度',
    aiAdvice: '估值模型与可比公司偏差较小，建议补充核心技术专利清单。',
  },
  {
    id: 'project-006',
    company: pickCompany(8),
    stage: '投',
    status: '合同中',
    fund: '电子信息产业基金一期',
    amount: '1,600万',
    owner: '赵然',
    progress: 58,
    risk: '低',
    nextAction: '完成投资协议条款审阅和用印申请',
    aiAdvice: '合同付款节点已与交割条件匹配，需确认反稀释条款口径。',
  },
  {
    id: 'project-007',
    company: pickCompany(9),
    stage: '退',
    status: '已退出',
    fund: '高端装备并购基金',
    amount: '2,800万',
    owner: '周宁',
    progress: 100,
    risk: '低',
    nextAction: '归档退出复盘报告并回写收益统计',
    aiAdvice: '退出收益率高于组合均值，可沉淀为同类项目退出案例。',
  },
];

const customerRows: CustomerRecord[] = [
  { id: 'customer-001', name: '厦门海峡投资有限公司', type: '机构客户', contact: '李中华', source: '基金募集', status: '已认证', nextAction: '确认电子信息基金出资计划' },
  { id: 'customer-002', name: '未来黑科技项目团队', type: '被投企业', contact: '陈清泉', source: '产业洞察', status: '回访中', nextAction: '补充股东结构和核心客户清单' },
  { id: 'customer-003', name: '中关村科创园区', type: '合作机构', contact: '王璐', source: '渠道推荐', status: '待认证', nextAction: '完成机构资质审核' },
  { id: 'customer-004', name: '张小令', type: '自然人客户', contact: '项目负责人', source: '内部建档', status: '已认证', nextAction: '维护项目拜访纪要' },
];

const fundRows: FundRecord[] = [
  { id: 'fund-001', name: '电子信息产业基金一期', manager: '中电金信资本', scale: '12.0亿', invested: '7.8亿', available: '2.4亿', status: '投资期' },
  { id: 'fund-002', name: '智能制造专项基金', manager: '产业引导基金', scale: '8.6亿', invested: '6.1亿', available: '1.1亿', status: '管理期' },
  { id: 'fund-003', name: '数字经济母基金', manager: '区域产投集团', scale: '15.0亿', invested: '5.2亿', available: '7.3亿', status: '募集期' },
  { id: 'fund-004', name: '高端装备并购基金', manager: '中电金信资本', scale: '3.0亿', invested: '2.7亿', available: '0.2亿', status: '退出期' },
];

const riskRows: RiskRecord[] = [
  { id: 'risk-001', company: '未来黑科技项目团队', level: '高', type: '合同履约', source: '投资协议付款节点', owner: '王敏', action: '复核交割条件和付款前置材料' },
  { id: 'risk-002', company: '厦门海峡投资有限公司', level: '中', type: '出资计划', source: '基金募集进度', owner: '陈璇', action: '确认本期认缴付款安排' },
  { id: 'risk-003', company: '华芯科技有限责任公司', level: '中', type: '股权变更', source: '工商变更', owner: '周宁', action: '核验控制权是否变化' },
  { id: 'risk-004', company: '云丹网络科技有限公司', level: '低', type: '舆情', source: '新闻监测', owner: '赵然', action: '保持观察并归档结论' },
];

const reportRows: ReportRecord[] = [
  { id: 'report-001', name: '项目储备与转化看板', topic: '项目管理', owner: '数据组', status: '已发布', output: '管理层驾驶舱' },
  { id: 'report-002', name: '基金可投额度与组合收益', topic: '基金管理', owner: '财务组', status: '更新中', output: '投委会材料' },
  { id: 'report-003', name: '风险预警处置闭环统计', topic: '风险管理', owner: '风控组', status: '已发布', output: '周报' },
  { id: 'report-004', name: '退出项目收益归因复盘', topic: '退出复盘', owner: '投后组', status: '草稿', output: 'AI复盘摘要' },
];

const documentRows: DocumentRecord[] = [
  { id: 'doc-001', name: '未来黑科技尽调报告.pdf', project: '未来黑科技项目', type: '尽调报告', owner: '张小令', status: '审批中' },
  { id: 'doc-002', name: '电子信息基金投资协议.docx', project: '芯片制造服务项目', type: '合同文件', owner: '陈璇', status: '已归档' },
  { id: 'doc-003', name: '投委会决议扫描件.pdf', project: '智能制造升级项目', type: '审批文件', owner: '周宁', status: '待补章' },
  { id: 'doc-004', name: '云丹网络退出复盘报告.pptx', project: '云丹网络退出项目', type: '复盘材料', owner: '赵然', status: '待归档' },
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
  series: [{ type: 'bar', data: [34, 41, 46, 25, 55, 33], itemStyle: { color: '#69a8ff' }, barWidth: 22 }],
};

const fundTrendOption = {
  grid: { top: 34, right: 20, bottom: 30, left: 44 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025', '2026E'] },
  yAxis: { type: 'value', name: '亿元' },
  series: [
    { name: '总投资成本', type: 'bar', data: [238, 426, 528, 485, 516], itemStyle: { color: '#1677ff' }, barWidth: 26 },
    { name: '总退出收益', type: 'line', smooth: true, data: [53, 102, 135, 98, 125], itemStyle: { color: '#fa8c16' } },
  ],
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

const dataDashboardOption = {
  grid: { top: 34, right: 20, bottom: 30, left: 44 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['项目', '客户', '基金', '风险', '文档'] },
  yAxis: { type: 'value' },
  series: [
    { name: '本月新增', type: 'bar', data: [18, 42, 3, 18, 96], itemStyle: { color: '#1677ff' }, barWidth: 28 },
    { name: 'AI处理', type: 'line', smooth: true, data: [12, 24, 2, 14, 81], itemStyle: { color: '#13c2c2' } },
  ],
};

const documentArchiveOption = {
  tooltip: {},
  series: [
    {
      type: 'pie',
      radius: ['46%', '72%'],
      data: [
        { name: '尽调报告', value: 68, itemStyle: { color: '#1677ff' } },
        { name: '合同文件', value: 142, itemStyle: { color: '#13c2c2' } },
        { name: '审批文件', value: 96, itemStyle: { color: '#faad14' } },
        { name: '复盘材料', value: 31, itemStyle: { color: '#9254de' } },
      ],
      label: { fontWeight: 700 },
    },
  ],
};

const todoItems = [
  { title: '未来黑科技项目立项申请', date: '2026-07-08', type: '项目审批' },
  { title: '松鼠传媒项目尽调合同签署', date: '2026-07-08', type: '合同' },
  { title: '客户回访：厦门海峡投资有限公司', date: '2026-07-09', type: '客户' },
  { title: '云丹网络项目退出意见', date: '2026-07-10', type: '退出' },
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
          <Space>
            <Button icon={<DatabaseOutlined />}>数据大屏</Button>
            <Button icon={<ProjectOutlined />} type="primary">
              新建项目
            </Button>
          </Space>
        </header>

        <ModuleFocus module={activeModule} />
        <ModuleMetrics metrics={activeModule.metrics} />
        <BusinessFlow activeKey={activeModule.key} />
        {renderModuleContent(activeModule.key)}
      </section>
    </main>
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
        <Tag color="blue">产业洞察驱动，管理模块协同闭环</Tag>
      </div>
      <div className="management-flow">
        {flowSteps.map((item, index) => (
          <div
            className={`management-flow__step ${item.key === activeKey ? 'is-active' : ''}`}
            key={item.title}
          >
            <span>{index + 1}</span>
            <strong>{item.title}</strong>
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
    case 'fund':
      return <FundContent />;
    case 'risk':
      return <RiskContent />;
    case 'data':
      return <DataContent />;
    case 'document':
      return <DocumentContent />;
    case 'project':
    default:
      return <ProjectContent />;
  }
}

function ProjectContent() {
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
      title: '项目状态',
      dataIndex: 'status',
      width: 112,
      render: (status: ProjectStatus) => (
        <Tag color={projectStatusColor(status)} className="management-status-tag">
          {status}
        </Tag>
      ),
    },
    { title: '拟投金额', dataIndex: 'amount', width: 110 },
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
      render: (risk: ProjectRecord['risk']) => (
        <Tag color={risk === '高' ? 'red' : risk === '中' ? 'orange' : 'green'}>{risk}</Tag>
      ),
    },
    { title: '下一步', dataIndex: 'nextAction', width: 260 },
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
              AI项目助手
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
    </>
  );
}

function CustomerContent() {
  const columns: ColumnsType<CustomerRecord> = [
    { title: '客户名称', dataIndex: 'name', width: 220 },
    { title: '客户类型', dataIndex: 'type', width: 110 },
    { title: '联系人', dataIndex: 'contact', width: 110 },
    { title: '来源', dataIndex: 'source', width: 120 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '待认证' ? 'orange' : 'blue'}>{status}</Tag> },
    { title: '下一步', dataIndex: 'nextAction', width: 300 },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="customer" />
      <section className="management-grid management-grid--middle">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <TeamOutlined />
              客户结构
            </h2>
          </div>
          <div className="management-chart-split">
            <ReactECharts option={customerPieOption} style={{ height: 240 }} />
            <ReactECharts option={newCustomerOption} style={{ height: 240 }} />
          </div>
        </article>
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <CalendarOutlined />
              回访与认证任务
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
            客户台账
          </h2>
          <Button icon={<UploadOutlined />} size="small">
            导入客户
          </Button>
        </div>
        <Table<CustomerRecord> columns={columns} dataSource={customerRows} pagination={false} rowKey="id" />
      </section>
    </>
  );
}

function FundContent() {
  const columns: ColumnsType<FundRecord> = [
    { title: '基金名称', dataIndex: 'name', width: 220 },
    { title: '管理人', dataIndex: 'manager', width: 150 },
    { title: '基金规模', dataIndex: 'scale', width: 110 },
    { title: '已投金额', dataIndex: 'invested', width: 110 },
    { title: '可用额度', dataIndex: 'available', width: 110 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '退出期' ? 'purple' : 'blue'}>{status}</Tag> },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="fund" />
      <section className="management-grid management-grid--middle">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <PieChartOutlined />
              基金成本与退出收益
            </h2>
          </div>
          <ReactECharts option={fundTrendOption} style={{ height: 280 }} />
        </article>
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <BankOutlined />
              资金流转节点
            </h2>
          </div>
          <Timeline
            items={[
              { dot: <BankOutlined />, children: '客户出资确认后进入基金募集账户' },
              { dot: <ProjectOutlined />, children: '项目立项时自动匹配基金可投额度' },
              { dot: <AuditOutlined />, children: '投委会通过后锁定投资额度并生成付款计划' },
              { dot: <LineChartOutlined />, children: '退出收益回流基金收益统计和投资复盘' },
            ]}
          />
        </article>
      </section>
      <section className="management-panel">
        <div className="management-section-title">
          <h2>
            <FundProjectionScreenOutlined />
            基金台账
          </h2>
          <Button size="small" type="primary">
            新建基金
          </Button>
        </div>
        <Table<FundRecord> columns={columns} dataSource={fundRows} pagination={false} rowKey="id" />
      </section>
    </>
  );
}

function RiskContent() {
  const columns: ColumnsType<RiskRecord> = [
    { title: '对象', dataIndex: 'company', width: 220 },
    { title: '等级', dataIndex: 'level', width: 90, render: (level: RiskRecord['level']) => <Tag color={level === '高' ? 'red' : level === '中' ? 'orange' : 'green'}>{level}</Tag> },
    { title: '类型', dataIndex: 'type', width: 120 },
    { title: '来源', dataIndex: 'source', width: 160 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '处置动作', dataIndex: 'action', width: 280 },
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
          <Table<RiskRecord> columns={columns} dataSource={riskRows} pagination={false} rowKey="id" />
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
            <li>合同履约风险需同步项目负责人和法务。</li>
            <li>出资计划延迟将影响基金可投额度预测。</li>
            <li>处置结论会写回项目台账和文档档案。</li>
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

function DataContent() {
  const columns: ColumnsType<ReportRecord> = [
    { title: '报表名称', dataIndex: 'name', width: 220 },
    { title: '主题', dataIndex: 'topic', width: 120 },
    { title: '负责人', dataIndex: 'owner', width: 100 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '草稿' ? 'orange' : 'blue'}>{status}</Tag> },
    { title: '输出场景', dataIndex: 'output', width: 180 },
  ];

  return (
    <>
      <ModuleHandoff moduleKey="data" />
      <section className="management-grid management-grid--middle">
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <DatabaseOutlined />
              经营驾驶舱
            </h2>
          </div>
          <ReactECharts option={dataDashboardOption} style={{ height: 300 }} />
        </article>
        <article className="management-panel">
          <div className="management-section-title">
            <h2>
              <RobotOutlined />
              AI决策摘要
            </h2>
          </div>
          <ul className="management-ai-list">
            <li>电子信息方向项目转化率高于平均值 12%。</li>
            <li>基金可用额度集中在数字经济母基金，建议优先匹配早期项目。</li>
            <li>风险闭环周期从 9.4 天降至 6.8 天，合同类风险仍需重点关注。</li>
          </ul>
        </article>
      </section>
      <section className="management-panel">
        <div className="management-section-title">
          <h2>
            <BarChartOutlined />
            决策报表
          </h2>
          <Button size="small">生成报告</Button>
        </div>
        <Table<ReportRecord> columns={columns} dataSource={reportRows} pagination={false} rowKey="id" />
      </section>
    </>
  );
}

function DocumentContent() {
  const columns: ColumnsType<DocumentRecord> = [
    { title: '文件名称', dataIndex: 'name', width: 240 },
    { title: '关联项目', dataIndex: 'project', width: 180 },
    { title: '类型', dataIndex: 'type', width: 110 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '已归档' ? 'green' : 'orange'}>{status}</Tag> },
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
              { dot: <FileSearchOutlined />, children: '产业洞察报告关联到项目立项材料' },
              { dot: <AuditOutlined />, children: '尽调报告、估值模型和投委会材料进入审批' },
              { dot: <ClockCircleOutlined />, children: '合同签署后自动生成投后任务和风险管理规则' },
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
        <Table<DocumentRecord> columns={columns} dataSource={documentRows} pagination={false} rowKey="id" />
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
    待立项: 'default',
    尽调中: 'geekblue',
    投决中: 'blue',
    合同中: 'cyan',
    投后管理: 'green',
    退出中: 'purple',
    已退出: 'success',
  };
  return colors[status];
}
