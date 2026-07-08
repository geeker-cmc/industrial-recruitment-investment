import {
  BarChartOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  FundOutlined,
  LineChartOutlined,
  RobotOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button, Progress, Select, Space, Table, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { ReactNode } from 'react';
import { companies, type CompanyProfile } from '../../mock/industry';

type ReviewRecord = {
  id: string;
  company: CompanyProfile;
  fund: string;
  investedAmount: string;
  currentValue: string;
  irr: string;
  result: string;
  lesson: string;
};

const pickCompany = (index: number) => companies[index] ?? companies[0]!;

const reviewRows: ReviewRecord[] = [
  {
    id: 'review-001',
    company: pickCompany(3),
    fund: '电子信息产业基金一期',
    investedAmount: '3,000万',
    currentValue: '4,280万',
    irr: '18.6%',
    result: '符合预期',
    lesson: '产业链客户协同带来收入增长。',
  },
  {
    id: 'review-002',
    company: pickCompany(4),
    fund: '智能制造专项基金',
    investedAmount: '5,000万',
    currentValue: '4,650万',
    irr: '-3.4%',
    result: '低于预期',
    lesson: '投前低估了核心客户流失风险。',
  },
  {
    id: 'review-003',
    company: pickCompany(5),
    fund: '数字经济母基金',
    investedAmount: '2,000万',
    currentValue: '3,150万',
    irr: '22.1%',
    result: '超预期',
    lesson: '政策窗口和订单释放节奏判断准确。',
  },
];

const performanceOption = {
  grid: { top: 28, right: 18, bottom: 34, left: 42 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['投前', '投后1年', '投后2年', '当前'] },
  yAxis: { type: 'value', name: '万元' },
  series: [
    {
      name: '投资成本',
      type: 'bar',
      data: [3000, 3000, 3000, 3000],
      itemStyle: { color: '#8fbfff' },
      barWidth: 24,
    },
    {
      name: '公允价值',
      type: 'line',
      data: [3000, 3380, 3820, 4280],
      smooth: true,
      itemStyle: { color: '#1677ff' },
    },
  ],
};

const attributionOption = {
  tooltip: {},
  radar: {
    indicator: [
      { name: '行业判断', max: 100 },
      { name: '估值纪律', max: 100 },
      { name: '尽调充分', max: 100 },
      { name: '投后协同', max: 100 },
      { name: '退出规划', max: 100 },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [88, 72, 81, 76, 64],
          name: '本项目',
          areaStyle: { color: 'rgba(22, 119, 255, 0.18)' },
          lineStyle: { color: '#1677ff' },
        },
      ],
    },
  ],
};

export default function InvestmentReviewPage() {
  const columns: ColumnsType<ReviewRecord> = [
    {
      title: '复盘项目',
      dataIndex: ['company', 'name'],
      render: (_, row) => (
        <div className="ops-company-cell">
          <strong>{row.company.name}</strong>
          <span>{row.fund}</span>
        </div>
      ),
    },
    {
      title: '投资成本',
      dataIndex: 'investedAmount',
      width: 120,
    },
    {
      title: '当前价值',
      dataIndex: 'currentValue',
      width: 120,
    },
    {
      title: 'IRR',
      dataIndex: 'irr',
      width: 100,
      render: (irr) => <strong className="ops-positive-value">{irr}</strong>,
    },
    {
      title: '结果',
      dataIndex: 'result',
      width: 120,
      render: (result) => (
        <Tag color={result === '低于预期' ? 'orange' : 'blue'}>{result}</Tag>
      ),
    },
    {
      title: '复盘结论',
      dataIndex: 'lesson',
      width: 320,
    },
  ];

  return (
    <main className="ops-page">
      <header className="ops-header">
        <div>
          <h1>投资复盘</h1>
          <span>对项目、基金和策略进行收益归因、风险归因和经验沉淀。</span>
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
          <Button icon={<FileSearchOutlined />}>导出复盘报告</Button>
          <Button icon={<RobotOutlined />} type="primary">
            AI生成复盘
          </Button>
        </Space>
      </header>

      <section className="ops-metrics">
        <Metric icon={<FundOutlined />} label="复盘项目" value="38" />
        <Metric icon={<TrophyOutlined />} label="超预期项目" value="11" />
        <Metric icon={<LineChartOutlined />} label="组合IRR" value="16.8%" />
        <Metric icon={<CheckCircleOutlined />} label="已退出项目" value="7" />
      </section>

      <section className="ops-grid ops-grid--wide-left">
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <BarChartOutlined />
              项目复盘清单
            </h2>
            <Space>
              <Button size="small">按行业汇总</Button>
              <Button size="small">按负责人汇总</Button>
            </Space>
          </div>
          <Table<ReviewRecord>
            columns={columns}
            dataSource={reviewRows}
            pagination={false}
            rowKey="id"
          />
        </article>
        <aside className="ops-ai-panel">
          <div className="ops-section-title">
            <h2>
              <RobotOutlined />
              AI复盘摘要
            </h2>
          </div>
          <ul className="ops-mini-list">
            <li>超预期项目多来自电子信息和智能制造方向。</li>
            <li>低于预期项目的共同问题是客户集中和估值偏高。</li>
            <li>下一轮投资建议增加供应链韧性和订单可验证性权重。</li>
          </ul>
          <div className="ops-review-score">
            <span>策略可复用度</span>
            <Progress percent={82} />
          </div>
        </aside>
      </section>

      <section className="ops-grid">
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <LineChartOutlined />
              收益表现
            </h2>
          </div>
          <ReactECharts option={performanceOption} style={{ height: 310 }} />
        </article>
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <BulbOutlined />
              归因雷达
            </h2>
          </div>
          <ReactECharts option={attributionOption} style={{ height: 310 }} />
        </article>
      </section>

      <section className="ops-panel">
        <div className="ops-section-title">
          <h2>
            <BulbOutlined />
            复盘流程
          </h2>
        </div>
        <Timeline
          className="ops-review-timeline"
          items={[
            { color: 'blue', children: '投前假设：产业政策持续加码，核心客户订单释放。' },
            { color: 'blue', children: '投后表现：收入连续两年增长，但毛利率低于投前模型。' },
            { color: 'orange', children: '偏差原因：原材料成本上涨，客户集中度下降速度慢于预期。' },
            { color: 'green', children: '复盘动作：下次同类项目提高客户结构和成本转嫁能力权重。' },
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
