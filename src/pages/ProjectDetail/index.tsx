import {
  AuditOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  PlusOutlined,
  ProjectOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
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

type ProjectReportRecord = {
  id: string;
  name: string;
  type: '投资能力画像' | '企业尽调' | '投后风控';
  node: string;
  status: '已完成' | '分析中' | '待补充材料';
  updatedAt: string;
  version: string;
  summary: string;
  content: string;
  missingMaterials: string[];
  source: string;
};

type NewReportFormValues = {
  reportType: ProjectReportRecord['type'];
  files?: UploadFile[];
  documentIds?: string[];
  description?: string;
};

function buildProjectReports(project: InvestmentProject): ProjectReportRecord[] {
  return [
    {
      id: `${project.id}-ability`,
      name: '投资能力画像报告',
      type: '投资能力画像',
      node: '投资复盘',
      status: '已完成',
      updatedAt: '2026-07-08',
      version: 'V1.0',
      summary: '围绕产业理解、项目储备、投后监测与退出复盘形成投资能力判断。',
      content: `南通产控在${project.company.industries[0]}方向已形成产业理解、项目储备、投后监测和退出复盘能力，本项目可作为补链型投资样板。`,
      missingMaterials: [],
      source: '项目资料、客户画像、投后管理记录',
    },
    {
      id: `${project.id}-due`,
      name: '企业尽调报告',
      type: '企业尽调',
      node: '尽调完成',
      status: '待补充材料',
      updatedAt: '2026-07-08',
      version: 'V2.0',
      summary: '汇总企业画像、工商司法、财务、技术人才与产业链信息，输出投决前风险判断。',
      content: `${project.company.name}业务增长较快，技术与产业链协同价值较高，建议补充客户回款材料后进入投委会。`,
      missingMaterials: ['前三大客户合同', '最新审计报告', '核心技术权属证明', '二季度经营财务报告'],
      source: '芯片服务项目尽调报告.pdf、可比公司估值测算.xlsx',
    },
    {
      id: `${project.id}-post-risk`,
      name: '投后风控决策报告',
      type: '投后风控',
      node: '投后跟踪',
      status: '分析中',
      updatedAt: '2026-07-07',
      version: 'V1.0',
      summary: '基于经营、财务、舆情和司法指标变化，形成投后风险与管理动作建议。',
      content: `当前项目风险等级为${project.risk}，建议持续跟踪经营回款、核心客户集中度及合同履约情况，并按季度更新风险结论。`,
      missingMaterials: [],
      source: '经营报告、财务报告、风险监测数据',
    },
  ];
}

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
      <Progress percent={Math.min(percent, 100)} size="small" showInfo />
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
  const [reports, setReports] = useState(() => buildProjectReports(project));
  const [activeReport, setActiveReport] = useState<ProjectReportRecord | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [newReportOpen, setNewReportOpen] = useState(false);
  const [form] = Form.useForm<NewReportFormValues>();

  const createReport = (values: NewReportFormValues) => {
    const uploadedNames = (values.files ?? []).map((file) => file.name);
    const linkedNames = (values.documentIds ?? [])
      .map((id) => project.documents.find((document) => document.id === id)?.name)
      .filter((name): name is string => Boolean(name));
    const sourceNames = [...uploadedNames, ...linkedNames];

    if (!sourceNames.length) {
      message.warning('请上传至少一个文档，或关联至少一个项目文档');
      return;
    }

    const source = [
      uploadedNames.length ? `上传：${uploadedNames.join('、')}` : '',
      linkedNames.length ? `关联：${linkedNames.join('、')}` : '',
    ]
      .filter(Boolean)
      .join('；');

    const report: ProjectReportRecord = {
      id: `${project.id}-report-${Date.now()}`,
      name: `${values.reportType}报告`,
      type: values.reportType,
      node: 'AI分析任务',
      status: '分析中',
      updatedAt: '刚刚',
      version: 'V1.0',
      summary: values.description || 'AI正在解析资料并整理报告结论。',
      content: 'AI正在解析资料，系统会从完整性、关键事实和风险点三个层面进行分析。',
      missingMaterials: [],
      source,
    };

    setReports((current) => [report, ...current]);
    setNewReportOpen(false);
    form.resetFields();
    message.success('报告已提交，AI分析已开始');

    window.setTimeout(() => {
      const needsMaterials = report.type === '企业尽调' && sourceNames.length < 2;
      const completedReport: ProjectReportRecord = {
        ...report,
        node: needsMaterials ? '材料补充' : 'AI分析完成',
        status: needsMaterials ? '待补充材料' : '已完成',
        updatedAt: '2026-07-22 14:32',
        content: needsMaterials
          ? `${project.company.name}的基础资料已完成初步解析，但关键财务和客户材料不足，暂不能形成完整尽调结论。`
          : `${report.type}已完成分析，系统已结合项目资料、企业画像和风险信息形成可供业务人员复核的报告结论。`,
        missingMaterials: needsMaterials ? ['最新审计报告', '前三大客户合同'] : [],
      };
      setReports((current) => current.map((item) => (item.id === report.id ? completedReport : item)));
      setActiveReport((current) => (current?.id === report.id ? completedReport : current));
      message.info(needsMaterials ? 'AI分析完成，报告待补充材料' : 'AI分析完成，报告已生成');
    }, 1800);
  };

  const regenerate = (report: ProjectReportRecord) => {
    setGeneratingId(report.id);
    const processingReport = {
      ...report,
      node: 'AI分析任务',
      status: '分析中' as const,
      updatedAt: '刚刚',
    };
    setReports((current) => current.map((item) => (item.id === report.id ? processingReport : item)));
    setActiveReport((current) => (current?.id === report.id ? processingReport : current));
    window.setTimeout(() => {
      const needsMaterials = report.missingMaterials.length > 0;
      const updatedReport: ProjectReportRecord = {
        ...processingReport,
        node: needsMaterials ? '材料补充' : 'AI分析完成',
        status: needsMaterials ? '待补充材料' : '已完成',
        version: `V${Number.parseFloat(report.version.replace('V', '')) + 1}.0`,
        updatedAt: '2026-07-22 14:32',
      };
      setReports((current) =>
        current.map((item) =>
          item.id === report.id ? updatedReport : item,
        ),
      );
      setActiveReport((current) => (current?.id === report.id ? updatedReport : current));
      setGeneratingId(null);
      message.success(`${report.name}已重新生成`);
    }, 500);
  };

  const exportReport = (report: ProjectReportRecord) => {
    const missingMaterials = report.missingMaterials.length
      ? report.missingMaterials.join('、')
      : '暂无';
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${report.name}</title></head><body><h1>${report.name}</h1><p>项目：${project.name}</p><p>企业：${project.company.name}</p><p>版本：${report.version}</p><p>生成时间：${report.updatedAt}</p><h2>AI核心结论</h2><p>${report.content}</p><h2>待补资料</h2><p>${missingMaterials}</p></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.company.name}-${report.name}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('报告已导出');
  };

  const columns: ColumnsType<ProjectReportRecord> = [
    {
      title: '报告名称',
      dataIndex: 'name',
      width: 230,
      render: (name: string, report) => (
        <div className="management-company-cell">
          <strong>{name}</strong>
          <span>{report.summary}</span>
        </div>
      ),
    },
    {
      title: '报告类型',
      dataIndex: 'type',
      width: 130,
      render: (type: ProjectReportRecord['type']) => <Tag color="blue">{type}</Tag>,
    },
    { title: '关联节点', dataIndex: 'node', width: 120 },
    { title: '版本', dataIndex: 'version', width: 90 },
    {
      title: '生成状态',
      dataIndex: 'status',
      width: 110,
      render: (status: ProjectReportRecord['status']) => (
        <Tag color={status === '已完成' ? 'green' : status === '分析中' ? 'blue' : 'orange'}>{status}</Tag>
      ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 120 },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_value, report) => (
        <Space className="management-row-actions">
          <Button onClick={() => setActiveReport(report)} size="small" type="link">
            查看详情
          </Button>
          <Button
            loading={generatingId === report.id}
            onClick={() => regenerate(report)}
            size="small"
            type="link"
          >
            重新生成
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="project-detail-panel">
      <div className="management-section-title">
        <h2>
          <FileProtectOutlined />
          报告列表
        </h2>
        <Button icon={<PlusOutlined />} onClick={() => setNewReportOpen(true)} type="primary">
          新增报告
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={reports}
        pagination={false}
        rowKey="id"
        scroll={{ x: 1000 }}
      />
      <Drawer
        extra={
          activeReport ? (
            <Button icon={<DownloadOutlined />} onClick={() => exportReport(activeReport)} type="primary">
              导出报告
            </Button>
          ) : null
        }
        onClose={() => setActiveReport(null)}
        open={Boolean(activeReport)}
        title={activeReport?.name}
        width={620}
      >
        {activeReport ? (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="报告对象">{project.company.name}</Descriptions.Item>
              <Descriptions.Item label="报告类型">{activeReport.type}</Descriptions.Item>
              <Descriptions.Item label="关联节点">{activeReport.node}</Descriptions.Item>
              <Descriptions.Item label="资料来源">{activeReport.source}</Descriptions.Item>
              <Descriptions.Item label="版本">{activeReport.version}</Descriptions.Item>
              <Descriptions.Item label="生成状态">
                <Tag color={activeReport.status === '已完成' ? 'green' : activeReport.status === '分析中' ? 'blue' : 'orange'}>
                  {activeReport.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">{activeReport.updatedAt}</Descriptions.Item>
            </Descriptions>
            <div className="report-detail-copy">
              <h3>AI核心结论</h3>
              <p>{activeReport.content}</p>
              <h3>待补资料</h3>
              <p>{activeReport.missingMaterials.length ? activeReport.missingMaterials.join('、') : '暂无'}</p>
            </div>
          </>
        ) : null}
      </Drawer>
      <Modal
        destroyOnHidden
        onCancel={() => {
          setNewReportOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="AI分析"
        open={newReportOpen}
        title="新增报告"
      >
        <Form<NewReportFormValues>
          form={form}
          initialValues={{ reportType: '企业尽调' }}
          layout="vertical"
          onFinish={createReport}
          requiredMark={false}
        >
          <Form.Item label="报告类型" name="reportType" rules={[{ required: true, message: '请选择报告类型' }]}>
            <Select
              options={[
                { label: '投资能力画像报告', value: '投资能力画像' },
                { label: '企业尽调报告', value: '企业尽调' },
                { label: '投后风控决策报告', value: '投后风控' },
              ]}
            />
          </Form.Item>
          <Form.Item
            getValueFromEvent={(event: { fileList: UploadFile[] }) => event.fileList}
            label="上传新文档（可多选）"
            name="files"
          >
            <Upload beforeUpload={() => false} multiple showUploadList>
              <Button>选择文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="关联项目文档（可多选）" name="documentIds">
            <Select
              mode="multiple"
              options={project.documents.map((document) => ({ label: document.name, value: document.id }))}
              placeholder="请选择项目文档"
            />
          </Form.Item>
          <Form.Item label="分析说明" name="description">
            <Input.TextArea placeholder="补充本次报告的分析目标或重点关注事项" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
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
