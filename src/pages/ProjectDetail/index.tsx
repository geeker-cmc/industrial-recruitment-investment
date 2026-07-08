import {
  AuditOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  ProjectOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Empty, Progress, Space, Table, Tabs, Tag, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  investmentProjects,
  type AgentOutput,
  type CapitalParticipant,
  type InvestmentProject,
  type ProjectDocument,
  type ProjectRisk,
  type RiskLevel,
} from '../../mock/investment';

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

const exitItems = [
  { title: '退出计划', value: '拟采用股权回购 + 二级转让组合方案' },
  { title: '退出审批', value: '需完成价格敏感性测算后提交审批' },
  { title: '收益测算', value: '基准情景 IRR 18.6%，悲观情景 IRR 11.2%' },
  { title: '退出复盘', value: '退出完成后自动生成复盘报告和归档任务' },
];

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const project = useMemo(
    () => investmentProjects.find((item) => item.id === projectId) ?? investmentProjects[0]!,
    [projectId],
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
          <Button icon={<RobotOutlined />} type="primary">
            运行智能体
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
