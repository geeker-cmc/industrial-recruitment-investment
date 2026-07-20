import {
  AuditOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  ProjectOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Empty, InputNumber, Progress, Space, Table, Tabs, Tag, Timeline, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type AgentOutput,
  type CapitalParticipant,
  type InvestmentProject,
  type ProjectDocument,
  type ProjectRisk,
  type RiskLevel,
} from '../../mock/investment';
import { useInvestmentStore } from '../../stores/useInvestmentStore';

const investMilestones = [
  { title: '立项', status: '已完成', description: '项目来源、投资逻辑、拟投金额和责任人已确认。' },
  { title: '尽调报告', status: '进行中', description: 'AI尽调报告已生成初稿，等待财务和法务材料补充。' },
  { title: '估值参考', status: '待确认', description: '可比公司法与收益法区间需要投委会确认。' },
  { title: '投委会', status: '未开始', description: '投委会材料待尽调和估值完成后提交。' },
  { title: '合同审核', status: '进行中', description: '合同智能体已识别付款条件、回购触发和信息权条款。' },
  { title: '交割', status: '未开始', description: '完成合同签署后进入付款和工商变更确认。' },
];

const manageItems = [
  { title: '经营报告', value: '二季度经营报告待上传', status: '待处理' },
  { title: '财务报告', value: '2026 年半年度财报缺少现金流附注', status: '待补充' },
  { title: '重大事项', value: '新增核心客户合同，需复核回款周期', status: '跟进中' },
  { title: '投后任务', value: '3 项任务未完成，最晚 2026-07-12 截止', status: '进行中' },
];

const monitorQuarters = ['25Q2', '25Q3', '25Q4', '26Q1', '26Q2'];

const postRiskItems = [
  {
    key: 'finance',
    title: '财务指标变化',
    level: '关注',
    description: '应收账款周转天数环比增加 9 天，需补充前五大客户回款计划。',
  },
  {
    key: 'opinion',
    title: '舆情指标变化',
    level: '低',
    description: '负面舆情占比 3.2%，较上期下降 1.1 个百分点。',
  },
  {
    key: 'legal',
    title: '司法指标变化',
    level: '低',
    description: '未发现新增被执行、行政处罚和重大诉讼。',
  },
];

const exitItems = [
  { title: '退出计划', value: '拟采用股权回购 + 二级转让组合方案' },
  { title: '退出审批', value: '需完成价格敏感性测算后提交审批' },
  { title: '收益测算', value: '基准情景 IRR 18.6%，悲观情景 IRR 11.2%' },
  { title: '退出复盘', value: '退出完成后自动生成复盘报告和归档任务' },
];

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const projects = useInvestmentStore((state) => state.projects);
  const project = useMemo(
    () => projects.find((item) => item.id === projectId) ?? projects[0]!,
    [projectId, projects],
  );

  return (
    <main className="project-detail-page">
      <header className="project-detail-hero">
        <div>
          <span className="management-eyebrow">项目详情</span>
          <h1>{project.name}</h1>
          <p>{project.company.name}</p>
          <Space wrap>
            <Tag color="blue">{project.stage}阶段</Tag>
            <Tag color="geekblue">{project.status}</Tag>
            <Tag color={riskColor(project.risk)}>风险 {project.risk}</Tag>
            <Tag>{project.capitalPlan}</Tag>
          </Space>
        </div>
        <Space>
          <Button onClick={() => navigate('/project-management')}>返回项目列表</Button>
          <Button icon={<RobotOutlined />} onClick={() => navigate('/agents?tool=contract')} type="primary">
            合同审核智能体
          </Button>
        </Space>
      </header>

      <section className="project-detail-progress">
        <StageProgress label="募" title="客户出资" percent={project.stage === '募' ? project.progress : 100} />
        <StageProgress label="投" title="尽调投决" percent={project.stage === '投' ? project.progress : project.stage === '募' ? 12 : 100} />
        <StageProgress label="管" title="投后管理" percent={project.stage === '管' ? project.progress : project.stage === '退' ? 100 : 20} />
        <StageProgress label="退" title="退出复盘" percent={project.stage === '退' ? project.progress : 8} />
      </section>

      <Tabs
        className="project-detail-tabs"
        items={[
          { key: 'basic', label: '基本信息', children: <BasicTab project={project} /> },
          { key: 'raise', label: '募', children: <RaiseTab project={project} /> },
          { key: 'invest', label: '投', children: <InvestTab project={project} /> },
          { key: 'manage', label: '管', children: <ManageTab project={project} /> },
          { key: 'exit', label: '退', children: <ExitTab project={project} /> },
          { key: 'risk', label: '风险', children: <RiskTab risks={project.risks} /> },
          { key: 'document', label: '文档', children: <DocumentTab documents={project.documents} /> },
          { key: 'agent', label: '智能体输出', children: <AgentTab outputs={project.agentOutputs} /> },
          { key: 'report', label: '报告生成', children: <ReportTab project={project} /> },
        ]}
      />
    </main>
  );
}

function StageProgress({ label, title, percent }: { label: string; title: string; percent: number }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{title}</strong>
      <Progress percent={Math.min(percent, 100)} size="small" />
    </article>
  );
}

function BasicTab({ project }: { project: InvestmentProject }) {
  return (
    <section className="project-detail-panel">
      <div className="management-section-title">
        <h2>
          <ProjectOutlined />
          项目基本信息
        </h2>
      </div>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
        <Descriptions.Item label="项目企业">{project.company.name}</Descriptions.Item>
        <Descriptions.Item label="当前阶段">{project.stage}</Descriptions.Item>
        <Descriptions.Item label="项目状态">{project.status}</Descriptions.Item>
        <Descriptions.Item label="拟投金额">{project.targetAmount}</Descriptions.Item>
        <Descriptions.Item label="资金计划">{project.capitalPlan}</Descriptions.Item>
        <Descriptions.Item label="项目负责人">{project.owner}</Descriptions.Item>
        <Descriptions.Item label="投后负责人">{project.manager}</Descriptions.Item>
        <Descriptions.Item label="发起日期">{project.startDate}</Descriptions.Item>
        <Descriptions.Item label="预期退出">{project.expectedExit}</Descriptions.Item>
        <Descriptions.Item label="机会来源">{project.opportunitySource ?? '项目管理发起'}</Descriptions.Item>
        <Descriptions.Item label="推荐依据" span={2}>{project.opportunityReason ?? '通过项目管理流程录入，暂无额外推荐依据。'}</Descriptions.Item>
        <Descriptions.Item label="估值参考" span={2}>{project.valuation}</Descriptions.Item>
        <Descriptions.Item label="下一步" span={2}>{project.nextAction}</Descriptions.Item>
        <Descriptions.Item label="AI建议" span={2}>{project.aiAdvice}</Descriptions.Item>
      </Descriptions>
    </section>
  );
}

function RaiseTab({ project }: { project: InvestmentProject }) {
  const columns: ColumnsType<CapitalParticipant> = [
    { title: '名称', dataIndex: 'name', width: 220 },
    { title: '角色', dataIndex: 'role', width: 100, render: (role) => <Tag color="blue">{role}</Tag> },
    { title: '认缴', dataIndex: 'committed', width: 110 },
    { title: '实缴', dataIndex: 'paid', width: 110 },
    { title: '实缴进度', dataIndex: 'paidRate', width: 180, render: (rate) => <Progress percent={rate} size="small" /> },
    { title: '状态', dataIndex: 'status', width: 110, render: (status) => <Tag color={status === '已实缴' ? 'green' : 'orange'}>{status}</Tag> },
  ];

  return (
    <section className="project-detail-panel">
      <div className="project-detail-summary-grid">
        <SummaryCard icon={<TeamOutlined />} label="投资人/机构" value={`${project.investorCount} 位`} />
        <SummaryCard icon={<ProjectOutlined />} label="认缴金额" value={project.committedAmount} />
        <SummaryCard icon={<CheckCircleOutlined />} label="实缴金额" value={project.paidAmount} />
      </div>
      <Table<CapitalParticipant>
        columns={columns}
        dataSource={project.participants}
        locale={{ emptyText: <Empty description="暂无投资人或出资人" /> }}
        pagination={false}
        rowKey="id"
      />
    </section>
  );
}

function InvestTab({ project }: { project: InvestmentProject }) {
  return (
    <section className="project-detail-panel">
      <div className="project-invest-grid">
        {investMilestones.map((item) => (
          <article key={item.title}>
            <Tag color={item.status === '已完成' ? 'green' : item.status === '进行中' ? 'blue' : 'orange'}>{item.status}</Tag>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <div className="project-detail-note">
        <LineChartOutlined />
        <span>{project.valuation}</span>
      </div>
    </section>
  );
}

function ManageTab({ project }: { project: InvestmentProject }) {
  const [reportUploaded, setReportUploaded] = useState(false);
  const [valuationGenerated, setValuationGenerated] = useState(false);
  const [closedRisks, setClosedRisks] = useState<string[]>([]);
  const monitorOption = useMemo(
    () => ({
      grid: { top: 28, right: 20, bottom: 32, left: 44 },
      tooltip: {},
      legend: { top: 0, right: 0 },
      xAxis: { type: 'category', data: monitorQuarters },
      yAxis: { type: 'value' },
      series: [
        { name: '营业收入', type: 'bar', data: [5200, 6100, 6900, 7600, 8400], itemStyle: { color: '#1677ff' }, barWidth: 24 },
        { name: '负面舆情', type: 'line', data: [8, 7, 5, 4, 3], smooth: true, itemStyle: { color: '#faad14' } },
        { name: '风险事项', type: 'line', data: [4, 3, 3, 2, 1], smooth: true, itemStyle: { color: '#ff4d4f' } },
      ],
    }),
    [],
  );

  return (
    <section className="project-detail-panel">
      <div className="project-invest-grid">
        {manageItems.map((item) => (
          <article key={item.title}>
            <Tag color="blue">{item.status}</Tag>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
      <div className="project-detail-note">
        <SafetyCertificateOutlined />
        <span>{project.risk === '高' ? '存在高风险事项，投后动作需先完成风险处置。' : '投后任务与风险预警会同步进入风险管理和文档管理。'}</span>
      </div>
      <div className="post-monitor-layout">
        <article className="post-monitor-card post-monitor-card--wide">
          <div className="management-section-title">
            <h2>
              <LineChartOutlined />
              企业画像指标变化
            </h2>
          </div>
          <ReactECharts option={monitorOption} style={{ height: 300 }} />
        </article>
        <article className="post-monitor-card">
          <div className="management-section-title">
            <h2>
              <CheckCircleOutlined />
              新一轮融资估值建议
            </h2>
          </div>
          {valuationGenerated ? (
            <div className="valuation-suggestion">
              <strong>8.9 亿 - 9.6 亿</strong>
              <span>较上轮估值提升约 18%</span>
              <p>依据：收入增速 23%、同业 PS 倍数 4.2x、技术壁垒溢价与南通产业链协同价值。</p>
              <Tag color="green">建议进入追加投资论证</Tag>
            </div>
          ) : (
            <div className="valuation-suggestion valuation-suggestion--empty">
              <p>{reportUploaded ? '二季度经营财务报告已上传，可生成新一轮融资估值建议。' : '上传二季度经营财务报告后，可自动生成新一轮融资估值建议。'}</p>
              <Space wrap>
                <Button
                  onClick={() => {
                    setReportUploaded(true);
                    message.success('二季度经营财务报告已上传');
                  }}
                >
                  上传经营财报
                </Button>
                <Button
                  disabled={!reportUploaded}
                  onClick={() => {
                    setValuationGenerated(true);
                    message.success('已生成新一轮融资估值建议');
                  }}
                  type="primary"
                >
                  生成估值建议
                </Button>
              </Space>
            </div>
          )}
        </article>
      </div>
      <div className="post-risk-grid">
        {postRiskItems.map((item) => {
          const closed = closedRisks.includes(item.key);
          return (
            <article className="post-risk-card" key={item.key}>
              <Tag color={closed ? 'green' : item.level === '关注' ? 'orange' : 'blue'}>
                {closed ? '已闭环' : item.level}
              </Tag>
              <h3>{item.title}</h3>
              <p>{closed ? '责任人已处理，处置结论已回写风险管理与项目文档。' : item.description}</p>
              <Button
                disabled={closed}
                onClick={() => {
                  setClosedRisks((rows) => [...rows, item.key]);
                  message.success(`${item.title} 已形成管理闭环`);
                }}
                size="small"
                type="link"
              >
                {closed ? '已处理' : '生成管理动作'}
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ExitTab({ project }: { project: InvestmentProject }) {
  return (
    <section className="project-detail-panel">
      <div className="project-invest-grid">
        {exitItems.map((item) => (
          <article key={item.title}>
            <Tag color="purple">{project.stage === '退' ? '进行中' : '待启动'}</Tag>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RiskTab({ risks }: { risks: ProjectRisk[] }) {
  const columns: ColumnsType<ProjectRisk> = [
    { title: '风险事项', dataIndex: 'title', width: 240 },
    { title: '等级', dataIndex: 'level', width: 90, render: (level: RiskLevel) => <Tag color={riskColor(level)}>{level}</Tag> },
    { title: '来源', dataIndex: 'source', width: 160 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '已闭环' ? 'green' : 'orange'}>{status}</Tag> },
    { title: '处置动作', dataIndex: 'action', width: 300 },
  ];

  return (
    <section className="project-detail-panel">
      <Table<ProjectRisk>
        columns={columns}
        dataSource={risks}
        locale={{ emptyText: <Empty description="暂无风险事项" /> }}
        pagination={false}
        rowKey="id"
        scroll={{ x: 980 }}
      />
    </section>
  );
}

function DocumentTab({ documents }: { documents: ProjectDocument[] }) {
  const columns: ColumnsType<ProjectDocument> = [
    { title: '文件名称', dataIndex: 'name', width: 260 },
    { title: '类型', dataIndex: 'type', width: 110 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '已归档' ? 'green' : 'orange'}>{status}</Tag> },
    { title: '更新时间', dataIndex: 'updatedAt', width: 120 },
  ];

  return (
    <section className="project-detail-panel">
      <div className="management-section-title">
        <h2>
          <FileProtectOutlined />
          项目文档
        </h2>
        <Button icon={<FileSearchOutlined />}>完整性检查</Button>
      </div>
      <Table<ProjectDocument>
        columns={columns}
        dataSource={documents}
        locale={{ emptyText: <Empty description="暂无文档" /> }}
        pagination={false}
        rowKey="id"
      />
    </section>
  );
}

function AgentTab({ outputs }: { outputs: AgentOutput[] }) {
  if (!outputs.length) {
    return (
      <section className="project-detail-panel">
        <Empty description="暂无智能体输出" />
      </section>
    );
  }

  return (
    <section className="project-detail-panel">
      <Timeline
        items={outputs.map((item) => ({
          dot: item.tool === '尽调报告' ? <AuditOutlined /> : <RobotOutlined />,
          children: (
            <div className="project-agent-output">
              <Tag color={item.tool === '尽调报告' ? 'blue' : 'purple'}>{item.tool}</Tag>
              <strong>{item.name}</strong>
              <p>{item.result}</p>
              <span>{item.updatedAt} / 风险点 {item.riskCount} 项 / {item.status}</span>
            </div>
          ),
        }))}
      />
    </section>
  );
}

function ReportTab({ project }: { project: InvestmentProject }) {
  const [reportType, setReportType] = useState<'ability' | 'due'>('ability');
  const [generated, setGenerated] = useState(false);
  const [revenue, setRevenue] = useState(8400);
  const [version, setVersion] = useState(1);
  const title = reportType === 'ability' ? '投资能力画像报告' : '企业尽调报告';
  const conclusion =
    reportType === 'ability'
      ? `南通产控在${project.company.industries[0]}方向已形成产业理解、项目储备、投后监测和退出复盘能力，本项目可作为补链型投资样板。`
      : `${project.company.name}业务增长较快，最近季度收入约 ${revenue.toLocaleString()} 万元，技术与产业链协同价值较高，建议补充客户回款材料后进入投委会。`;

  return (
    <section className="project-detail-panel">
      <div className="report-generator">
        <aside>
          <button
            className={reportType === 'ability' ? 'is-active' : ''}
            onClick={() => {
              setReportType('ability');
              setGenerated(false);
            }}
            type="button"
          >
            投资能力画像报告
          </button>
          <button
            className={reportType === 'due' ? 'is-active' : ''}
            onClick={() => {
              setReportType('due');
              setGenerated(false);
            }}
            type="button"
          >
            企业尽调报告
          </button>
        </aside>
        <section className="report-generator__workspace">
          <div className="management-section-title">
            <h2>
              <FileProtectOutlined />
              {title}
            </h2>
            <Space>
              <Button
                icon={<RobotOutlined />}
                onClick={() => {
                  setGenerated(true);
                  message.success(`${title}已生成`);
                }}
                type="primary"
              >
                生成报告
              </Button>
              <Button
                disabled={!generated}
                icon={<CloudDownloadOutlined />}
                onClick={() => message.success(`${title}已导出 Word`)}
              >
                导出 Word
              </Button>
            </Space>
          </div>
          {generated ? (
            <div className="report-preview">
              <div className="report-refresh-row">
                <span>补充最新季度收入：</span>
                <InputNumber min={0} onChange={(value) => setRevenue(Number(value ?? revenue))} value={revenue} />
                <Button
                  onClick={() => {
                    setVersion((value) => value + 1);
                    message.success('报告已基于补充数据重新生成');
                  }}
                >
                  重新生成
                </Button>
                <Tag color="blue">版本 V{version}</Tag>
              </div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="报告对象">{project.company.name}</Descriptions.Item>
                <Descriptions.Item label="报告大纲">
                  产业判断、企业画像、投前尽调、合同审核、投后监测、估值建议、风险与管理动作。
                </Descriptions.Item>
                <Descriptions.Item label="AI核心结论">{conclusion}</Descriptions.Item>
                <Descriptions.Item label="待补资料">
                  前三大客户合同、最新审计报告、核心技术权属证明、二季度经营财务报告。
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : (
            <div className="report-empty">
              <RobotOutlined />
              <p>选择报告类型后点击生成，系统会汇总项目、企业画像、智能体输出、风险和文档数据形成报告预览。</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function riskColor(level: RiskLevel) {
  const colors: Record<RiskLevel, string> = {
    高: 'red',
    中: 'orange',
    低: 'green',
  };
  return colors[level];
}
