import {
  ArrowRightOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
  FundProjectionScreenOutlined,
  ProjectOutlined,
  RobotOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Progress, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { buildInvestmentStyleProfile, getOpportunityRecommendations } from '../../mock/opportunity';
import {
  agentTasks,
  customerRecords,
  documentRecords,
  investmentProjects,
  riskRecords,
  type InvestmentProject,
  type LifecycleStage,
  type ProjectStatus,
  type RiskLevel,
} from '../../mock/investment';

const stageCounts = ['募', '投', '管', '退'].map((stage) => ({
  stage,
  value: investmentProjects.filter((project) => project.stage === stage).length,
}));

const statusCounts = [
  '草稿',
  '待立项',
  '募集中',
  '尽调中',
  '估值中',
  '投决中',
  '合同中',
  '交割中',
  '投后管理',
  '退出准备',
  '退出中',
  '已退出',
].map((status) => ({
  name: status,
  value: investmentProjects.filter((project) => project.status === status).length,
}));

const projectStageOption = {
  grid: { top: 22, right: 16, bottom: 34, left: 34 },
  tooltip: {},
  xAxis: { type: 'category', data: stageCounts.map((item) => item.stage) },
  yAxis: { type: 'value', minInterval: 1 },
  series: [
    {
      type: 'bar',
      data: stageCounts.map((item, index) => ({
        value: item.value,
        itemStyle: { color: ['#faad14', '#1677ff', '#13c2c2', '#9254de'][index] },
      })),
      barWidth: 34,
    },
  ],
};

const statusOption = {
  tooltip: {},
  series: [
    {
      type: 'pie',
      radius: ['46%', '72%'],
      center: ['50%', '48%'],
      data: statusCounts.filter((item) => item.value > 0),
      label: { fontWeight: 700 },
    },
  ],
};

const riskTrendOption = {
  grid: { top: 30, right: 18, bottom: 34, left: 42 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '新增预警', type: 'bar', data: [12, 15, 11, 18, 16, 20, 18], itemStyle: { color: '#faad14' }, barWidth: 22 },
    { name: '已闭环', type: 'line', smooth: true, data: [8, 12, 10, 13, 15, 18, 16], itemStyle: { color: '#13c2c2' } },
  ],
};

const customerOption = {
  tooltip: {},
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '45%'],
      data: [
        { name: '投资机构', value: customerRecords.filter((item) => item.kind === '投资机构').length, itemStyle: { color: '#1677ff' } },
        { name: '出资人', value: customerRecords.filter((item) => item.kind === '出资人').length, itemStyle: { color: '#13c2c2' } },
        { name: '投资人', value: customerRecords.filter((item) => item.kind === '投资人').length, itemStyle: { color: '#faad14' } },
      ],
      label: { formatter: '{b}\\n{c}', fontWeight: 700 },
    },
  ],
};

const columns: ColumnsType<InvestmentProject> = [
  {
    title: '项目名称',
    dataIndex: 'name',
    width: 260,
    render: (_, row) => (
      <div className="dashboard-project-cell">
        <Link to={`/projects/${row.id}`}>{row.name}</Link>
        <span>{row.company.name}</span>
      </div>
    ),
  },
  {
    title: '阶段',
    dataIndex: 'stage',
    width: 76,
    render: (stage: LifecycleStage) => <Tag color={stageColor(stage)}>{stage}</Tag>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: (status: ProjectStatus) => <Tag>{status}</Tag>,
  },
  { title: '下一步', dataIndex: 'nextAction', width: 280 },
  {
    title: '风险',
    dataIndex: 'risk',
    width: 76,
    render: (risk: RiskLevel) => <Tag color={riskColor(risk)}>{risk}</Tag>,
  },
];

export default function DashboardPage() {
  const activeRiskCount = riskRecords.filter((item) => item.status !== '已闭环').length;
  const pendingDocs = documentRecords.filter((item) => item.status !== '已归档').length;
  const agentPending = agentTasks.filter((item) => item.status !== '已完成').length;
  const opportunityProfile = useMemo(() => buildInvestmentStyleProfile(), []);
  const opportunityRecommendations = useMemo(
    () => getOpportunityRecommendations({ strategy: 'investment-style' }).slice(0, 4),
    [],
  );

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span>股权投资业务管理系统</span>
          <h1>首页</h1>
          <p>汇总我的项目、客户募集、风险预警、文档归档和智能体任务，帮助管理端快速判断今天要推进什么。</p>
        </div>
        <div className="dashboard-hero__actions">
          <Button href="#/project-management" type="primary">
            查看项目管理
          </Button>
        </div>
      </section>

      <section className="dashboard-panel dashboard-opportunity-panel">
        <div className="dashboard-section-title">
          <h2>
            <BulbOutlined />
            推荐商机
          </h2>
          <Space size={14}>
            <span className="dashboard-opportunity-source">
              基于 {opportunityProfile.sampleCount} 家投中/投后样本
            </span>
            <Link to="/opportunity-discovery">
              更多 <ArrowRightOutlined />
            </Link>
          </Space>
        </div>
        {opportunityRecommendations.length ? (
          <div className="dashboard-opportunity-grid">
            {opportunityRecommendations.map((item) => (
              <article className="dashboard-opportunity-card" key={item.company.id}>
                <div className="dashboard-opportunity-card__topline">
                  <Tag color="blue">推荐 {item.score}</Tag>
                  <Tag>{item.recommendationSources[0]}</Tag>
                </div>
                <Link className="dashboard-opportunity-card__name" to={opportunityCompanyPath(item)}>
                  {item.company.name}
                </Link>
                <div className="dashboard-opportunity-card__chains">
                  {item.company.industries.slice(0, 2).map((industry) => <Tag key={industry}>{industry.replace('产业链', '')}</Tag>)}
                </div>
                <p>{item.reason}</p>
                <div className="dashboard-opportunity-card__footer">
                  <span>综合评价 {item.meta.score} 分</span>
                  <Link to={opportunityCompanyPath(item)}>查看画像</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-opportunity-empty">
            暂无推荐结果，请进入发现企业调整产业链、认证或区域条件。
            <Link to="/opportunity-discovery">进入发现企业</Link>
          </div>
        )}
      </section>

      <section className="dashboard-metrics" aria-label="首页指标">
        <MetricCard icon={<ProjectOutlined />} label="我的项目" value={investmentProjects.length} extra="覆盖募、投、管、退全阶段" />
        <MetricCard icon={<WarningOutlined />} label="风险预警" value={activeRiskCount} extra="待处置或处置中的事项" tone="orange" />
        <MetricCard icon={<TeamOutlined />} label="客户管理" value={customerRecords.length} extra="投资人、出资人、投资机构" tone="cyan" />
        <MetricCard icon={<FileProtectOutlined />} label="文档待归档" value={pendingDocs} extra="影响项目流转的资料" tone="purple" />
        <MetricCard icon={<RobotOutlined />} label="智能体任务" value={agentPending} extra="尽调报告和合同审核" tone="blue" />
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel dashboard-panel--wide">
          <div className="dashboard-section-title">
            <h2>
              <FundProjectionScreenOutlined />
              我的项目
            </h2>
            <Link to="/project-management">进入项目管理</Link>
          </div>
          <Table<InvestmentProject>
            columns={columns}
            dataSource={investmentProjects.slice(0, 6)}
            pagination={false}
            rowKey="id"
            scroll={{ x: 880 }}
          />
        </article>
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <ProjectOutlined />
              项目阶段分布
            </h2>
          </div>
          <ReactECharts option={projectStageOption} style={{ height: 260 }} />
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--triple">
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <ClockCircleOutlined />
              状态分布
            </h2>
          </div>
          <ReactECharts option={statusOption} style={{ height: 260 }} />
        </article>
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <WarningOutlined />
              风险预警
            </h2>
            <Link to="/risk-management">查看风险</Link>
          </div>
          <ReactECharts option={riskTrendOption} style={{ height: 260 }} />
        </article>
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <TeamOutlined />
              客户结构
            </h2>
            <Link to="/customer-management">查看客户</Link>
          </div>
          <ReactECharts option={customerOption} style={{ height: 260 }} />
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--bottom">
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <WarningOutlined />
              待处理风险
            </h2>
          </div>
          <div className="dashboard-list">
            {riskRecords.filter((item) => item.status !== '已闭环').map((item) => (
              <Link key={item.id} to="/risk-management">
                <Tag color={riskColor(item.level)}>{item.level}</Tag>
                <strong>{item.projectName}</strong>
                <span>{item.action}</span>
              </Link>
            ))}
          </div>
        </article>
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <RobotOutlined />
              智能体任务
            </h2>
            <Link to="/agents">进入智能体</Link>
          </div>
          <div className="dashboard-agent-list">
            {agentTasks.map((item) => (
              <article key={item.id}>
                <div>
                  <Tag color={item.tool === '尽调报告' ? 'blue' : 'purple'}>{item.tool}</Tag>
                  <strong>{item.projectName}</strong>
                </div>
                <Progress percent={item.score} size="small" />
                <span>{item.finding}</span>
              </article>
            ))}
          </div>
        </article>
        <article className="dashboard-panel">
          <div className="dashboard-section-title">
            <h2>
              <CheckCircleOutlined />
              今日闭环
            </h2>
          </div>
          <div className="dashboard-closure">
            <strong>72%</strong>
            <span>关键待办闭环率</span>
            <Progress percent={72} strokeColor="#13c2c2" />
            <p>项目尽调补件、合同审核确认和风险处置结果会同步回写项目详情与文档台账。</p>
          </div>
        </article>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  extra,
  tone = 'blue',
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  extra: string;
  tone?: 'blue' | 'orange' | 'cyan' | 'purple';
}) {
  return (
    <article className={`dashboard-metric dashboard-metric--${tone}`}>
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{extra}</p>
    </article>
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

function riskColor(level: RiskLevel) {
  const colors: Record<RiskLevel, string> = {
    高: 'red',
    中: 'orange',
    低: 'green',
  };
  return colors[level];
}

function opportunityCompanyPath(item: {
  company: { id: string };
  recommendationSources: string[];
  reason: string;
}) {
  const params = new URLSearchParams({
    recommendationSource: item.recommendationSources.join('、'),
    recommendationReason: item.reason,
  });
  return `/companies/${item.company.id}?${params.toString()}`;
}
