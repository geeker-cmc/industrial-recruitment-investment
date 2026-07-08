import {
  AlertOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RadarChartOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Progress, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { ReactNode } from 'react';
import { companies, type CompanyProfile } from '../../mock/industry';

type RiskRecord = {
  id: string;
  company: CompanyProfile;
  level: '高' | '中' | '低';
  type: string;
  source: string;
  triggerTime: string;
  status: string;
  owner: string;
  aiAdvice: string;
};

const pickCompany = (index: number) => companies[index] ?? companies[0]!;

const riskRows: RiskRecord[] = [
  {
    id: 'risk-001',
    company: pickCompany(3),
    level: '高',
    type: '合同履约',
    source: '投资协议付款节点',
    triggerTime: '2026-07-08 09:30',
    status: '待处理',
    owner: '王敏',
    aiAdvice: '建议复核交割条件和付款前置材料。',
  },
  {
    id: 'risk-002',
    company: pickCompany(4),
    level: '中',
    type: '财务波动',
    source: '经营月报',
    triggerTime: '2026-07-07 15:20',
    status: '跟进中',
    owner: '李华',
    aiAdvice: '收入下滑集中在单一客户，应补充订单明细。',
  },
  {
    id: 'risk-003',
    company: pickCompany(5),
    level: '中',
    type: '股权变更',
    source: '工商变更',
    triggerTime: '2026-07-06 11:10',
    status: '已确认',
    owner: '周宁',
    aiAdvice: '变更后控制权未变化，保持观察。',
  },
  {
    id: 'risk-004',
    company: pickCompany(6),
    level: '低',
    type: '舆情',
    source: '新闻监测',
    triggerTime: '2026-07-05 18:40',
    status: '已关闭',
    owner: '赵然',
    aiAdvice: '舆情影响有限，无需升级。',
  },
];

const riskTrendOption = {
  grid: { top: 28, right: 18, bottom: 34, left: 42 },
  tooltip: {},
  legend: { top: 0, right: 0 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '高风险',
      type: 'line',
      smooth: true,
      data: [3, 4, 5, 4, 6, 7, 5],
      itemStyle: { color: '#ff4d4f' },
    },
    {
      name: '中风险',
      type: 'bar',
      data: [9, 11, 13, 12, 15, 14, 16],
      itemStyle: { color: '#faad14' },
      barWidth: 22,
    },
  ],
};

const riskPieOption = {
  tooltip: {},
  series: [
    {
      type: 'pie',
      radius: ['48%', '74%'],
      center: ['50%', '52%'],
      data: [
        { name: '司法', value: 18, itemStyle: { color: '#1677ff' } },
        { name: '财务', value: 24, itemStyle: { color: '#faad14' } },
        { name: '合同', value: 14, itemStyle: { color: '#ff4d4f' } },
        { name: '舆情', value: 10, itemStyle: { color: '#13c2c2' } },
      ],
      label: { fontWeight: 700 },
    },
  ],
};

export default function RiskMonitorPage() {
  const columns: ColumnsType<RiskRecord> = [
    {
      title: '企业名称',
      dataIndex: ['company', 'name'],
      render: (_, row) => (
        <div className="ops-company-cell">
          <strong>{row.company.name}</strong>
          <span>{row.source}</span>
        </div>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      width: 90,
      render: (level) => (
        <Tag color={level === '高' ? 'red' : level === '中' ? 'orange' : 'green'}>
          {level}风险
        </Tag>
      ),
    },
    {
      title: '风险类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '触发时间',
      dataIndex: 'triggerTime',
      width: 170,
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      width: 110,
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      width: 100,
    },
    {
      title: 'AI处置建议',
      dataIndex: 'aiAdvice',
      width: 260,
    },
  ];

  return (
    <main className="ops-page">
      <header className="ops-header">
        <div>
          <h1>风险监控</h1>
          <span>持续跟踪企业司法、财务、合同、舆情和工商变更风险。</span>
        </div>
        <Space>
          <Input prefix={<SearchOutlined />} placeholder="搜索企业或风险事件" />
          <Select
            options={[
              { label: '全部风险', value: 'all' },
              { label: '高风险', value: 'high' },
              { label: '中风险', value: 'medium' },
            ]}
            value="all"
          />
          <Button icon={<BellOutlined />} type="primary">
            新建预警规则
          </Button>
        </Space>
      </header>

      <section className="ops-metrics">
        <Metric icon={<AlertOutlined />} label="高风险企业" value="5" />
        <Metric icon={<ExclamationCircleOutlined />} label="新增预警" value="18" />
        <Metric icon={<SafetyCertificateOutlined />} label="已闭环" value="42" />
        <Metric icon={<RadarChartOutlined />} label="规则命中率" value="78%" />
      </section>

      <section className="ops-grid ops-grid--wide-left">
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <AlertOutlined />
              风险事件
            </h2>
            <Space>
              <Button size="small">批量分派</Button>
              <Button size="small">导出</Button>
            </Space>
          </div>
          <Table<RiskRecord>
            columns={columns}
            dataSource={riskRows}
            pagination={false}
            rowKey="id"
          />
        </article>
        <aside className="ops-ai-panel">
          <div className="ops-section-title">
            <h2>
              <RobotOutlined />
              AI风险研判
            </h2>
          </div>
          <div className="ops-ai-score ops-ai-score--risk">
            <strong>高</strong>
            <span>组合风险热度</span>
          </div>
          <ul className="ops-mini-list">
            <li>合同履约风险集中在 2 个交割中项目。</li>
            <li>财务类预警环比上升 21%，主要来自收入确认延迟。</li>
            <li>建议优先处理高风险企业的付款节点复核。</li>
          </ul>
        </aside>
      </section>

      <section className="ops-grid">
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <RadarChartOutlined />
              风险趋势
            </h2>
          </div>
          <ReactECharts option={riskTrendOption} style={{ height: 300 }} />
        </article>
        <article className="ops-panel">
          <div className="ops-section-title">
            <h2>
              <SafetyCertificateOutlined />
              类型分布
            </h2>
          </div>
          <ReactECharts option={riskPieOption} style={{ height: 300 }} />
        </article>
      </section>

      <section className="ops-panel">
        <div className="ops-section-title">
          <h2>
            <CheckCircleOutlined />
            预警规则
          </h2>
        </div>
        <div className="ops-rule-grid">
          {[
            ['财报逾期', '企业未按期提交季度财报', 92],
            ['重大工商变更', '法人、股东、注册资本发生变化', 76],
            ['合同交割延迟', '付款或材料节点超过约定时间', 84],
            ['负面舆情', '新闻和公告出现高敏关键词', 68],
          ].map(([title, desc, rate]) => (
            <article className="ops-rule-card" key={title}>
              <strong>{title}</strong>
              <span>{desc}</span>
              <Progress percent={Number(rate)} size="small" />
            </article>
          ))}
        </div>
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
