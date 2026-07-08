import {
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DiffOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FundProjectionScreenOutlined,
  LineChartOutlined,
  RobotOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Progress, Select, Space, Table, Tabs, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { ReactNode } from 'react';
import { companies, type CompanyProfile } from '../../mock/industry';

type InvestmentProject = {
  id: string;
  company: CompanyProfile;
  stage: string;
  fund: string;
  amount: string;
  valuation: string;
  owner: string;
  aiScore: number;
  nextAction: string;
};

const pickCompany = (index: number) => companies[index] ?? companies[0]!;

const projects: InvestmentProject[] = [
  {
    id: 'ip-001',
    company: pickCompany(3),
    stage: '尽调中',
    fund: '电子信息产业基金一期',
    amount: '3,000万',
    valuation: '2.6亿',
    owner: '陈璇',
    aiScore: 86,
    nextAction: '补充三年收入明细',
  },
  {
    id: 'ip-002',
    company: pickCompany(4),
    stage: '合同中',
    fund: '智能制造专项基金',
    amount: '5,000万',
    valuation: '8.2亿',
    owner: '李华',
    aiScore: 78,
    nextAction: '复核回购触发条款',
  },
  {
    id: 'ip-003',
    company: pickCompany(5),
    stage: '估值复核',
    fund: '数字经济母基金',
    amount: '2,000万',
    valuation: '4.1亿',
    owner: '周宁',
    aiScore: 91,
    nextAction: '提交投委会摘要',
  },
];

const valuationOption = {
  grid: { top: 28, right: 18, bottom: 34, left: 44 },
  tooltip: {},
  xAxis: { type: 'category', data: ['2022', '2023', '2024', '2025E', '2026E'] },
  yAxis: { type: 'value', name: '亿元' },
  series: [
    {
      name: '收入',
      type: 'bar',
      data: [1.2, 1.7, 2.4, 3.3, 4.5],
      itemStyle: { color: '#1677ff' },
      barWidth: 28,
    },
    {
      name: '估值',
      type: 'line',
      data: [1.8, 2.2, 2.6, 3.4, 4.6],
      smooth: true,
      itemStyle: { color: '#13c2c2' },
    },
  ],
};

export default function InvestmentManagementPage() {
  const columns: ColumnsType<InvestmentProject> = [
    {
      title: '项目公司',
      dataIndex: ['company', 'name'],
      render: (_, row) => (
        <div className="ops-company-cell">
          <strong>{row.company.name}</strong>
          <span>{row.fund}</span>
        </div>
      ),
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      width: 110,
      render: (stage) => <Tag color="blue">{stage}</Tag>,
    },
    {
      title: '拟投金额',
      dataIndex: 'amount',
      width: 120,
    },
    {
      title: '当前估值',
      dataIndex: 'valuation',
      width: 120,
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 100,
    },
    {
      title: 'AI完整度',
      dataIndex: 'aiScore',
      width: 170,
      render: (score) => <Progress percent={score} size="small" />,
    },
    {
      title: '下一步',
      dataIndex: 'nextAction',
      width: 210,
    },
  ];

  return (
    <main className="ops-page">
      <header className="ops-header">
        <div>
          <h1>投管</h1>
          <span>围绕目标企业完成尽调、合同、估值和投决准备。</span>
        </div>
        <Space>
          <Select
            options={[
              { label: '全部基金', value: 'all' },
              { label: '电子信息产业基金一期', value: 'electronic' },
              { label: '智能制造专项基金', value: 'manufacturing' },
            ]}
            value="all"
          />
          <Button icon={<UploadOutlined />}>导入材料</Button>
          <Button icon={<RobotOutlined />} type="primary">
            AI生成投决摘要
          </Button>
        </Space>
      </header>

      <section className="ops-metrics">
        <Metric icon={<FileSearchOutlined />} label="尽调中" value="12" />
        <Metric icon={<FileProtectOutlined />} label="合同处理中" value="7" />
        <Metric icon={<LineChartOutlined />} label="估值待复核" value="5" />
        <Metric icon={<CheckCircleOutlined />} label="待投委会" value="3" />
      </section>

      <section className="ops-grid ops-grid--wide-right">
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <FundProjectionScreenOutlined />
              项目池
            </h2>
            <Space>
              <Button size="small">批量分派</Button>
              <Button size="small" type="primary">
                新建项目
              </Button>
            </Space>
          </div>
          <Table<InvestmentProject>
            columns={columns}
            dataSource={projects}
            pagination={false}
            rowKey="id"
          />
        </article>
        <aside className="ops-ai-panel">
          <div className="ops-section-title">
            <h2>
              <RobotOutlined />
              AI工作台
            </h2>
          </div>
          <div className="ops-ai-score">
            <strong>86</strong>
            <span>项目可投性评分</span>
          </div>
          <ul className="ops-mini-list">
            <li>
              <WarningOutlined />
              发现 2 条合同回购条款需复核
            </li>
            <li>
              <FileSearchOutlined />
              尽调材料缺少 2024 年审计报告
            </li>
            <li>
              <LineChartOutlined />
              可比公司估值区间建议 2.4-3.1 亿
            </li>
          </ul>
        </aside>
      </section>

      <section className="ops-panel">
        <Tabs
          className="ops-tabs"
          items={[
            {
              key: 'diligence',
              label: '尽调',
              children: <DiligenceTab />,
            },
            {
              key: 'contract',
              label: '合同',
              children: <ContractTab />,
            },
            {
              key: 'valuation',
              label: '估值',
              children: <ValuationTab />,
            },
          ]}
        />
      </section>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="ops-metric">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function DiligenceTab() {
  return (
    <div className="ops-two-col">
      <div className="ops-stage-board">
        {[
          ['材料收集', '财报、工商、合同、知识产权', 82],
          ['第三方尽调', '法务、财务、业务访谈', 64],
          ['AI摘要', '风险点、亮点、缺失项', 91],
        ].map(([title, desc, percent]) => (
          <article className="ops-task-card" key={title}>
            <strong>{title}</strong>
            <span>{desc}</span>
            <Progress percent={Number(percent)} size="small" />
          </article>
        ))}
      </div>
      <div className="ops-panel-lite">
        <h3>
          <RobotOutlined />
          AI尽调结论
        </h3>
        <ul className="ops-mini-list">
          <li>收入增长稳定，但客户集中度较高，前五大客户占比 62%。</li>
          <li>核心专利 18 项，其中 4 项与主营产品高度相关。</li>
          <li>建议补充供应商框架协议和 2024 年审计底稿。</li>
        </ul>
      </div>
    </div>
  );
}

function ContractTab() {
  return (
    <div className="ops-two-col">
      <div className="ops-clause-grid">
        {[
          ['投资金额', '3,000 万元', '已识别'],
          ['投前估值', '2.6 亿元', '待复核'],
          ['回购条款', '触发条件 4 项', '高关注'],
          ['交割条件', '材料齐备率 86%', '进行中'],
        ].map(([label, value, status]) => (
          <article className="ops-clause-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <Tag color={status === '高关注' ? 'red' : 'blue'}>{status}</Tag>
          </article>
        ))}
      </div>
      <div className="ops-panel-lite">
        <h3>
          <DiffOutlined />
          AI条款审阅
        </h3>
        <Timeline
          items={[
            { color: 'blue', children: '已提取投资协议 28 个关键字段' },
            { color: 'red', children: '回购义务主体与补充协议表述不一致' },
            { color: 'green', children: '付款节点已与投决审批金额匹配' },
          ]}
        />
      </div>
    </div>
  );
}

function ValuationTab() {
  return (
    <div className="ops-two-col ops-two-col--chart">
      <ReactECharts option={valuationOption} style={{ height: 300 }} />
      <div className="ops-panel-lite">
        <h3>
          <AuditOutlined />
          AI估值建议
        </h3>
        <div className="ops-valuation-range">
          <strong>2.4亿 - 3.1亿</strong>
          <span>综合 DCF、可比公司、市销率模型</span>
        </div>
        <ul className="ops-mini-list">
          <li>收入预测对 2026 年新增订单依赖较高。</li>
          <li>建议以 2.6 亿作为投前估值谈判锚点。</li>
          <li>若毛利率低于 28%，估值需下修约 11%。</li>
        </ul>
      </div>
    </div>
  );
}
