import {
  AuditOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Progress, Segmented, Select, Space, Table, Tag, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ReactNode } from 'react';
import {
  agentTasks,
  investmentProjects,
  type AgentTask,
} from '../../mock/investment';

const toolNav = [
  {
    title: '尽调智能体',
    items: ['尽调报告', '材料完整性', '风险摘要'],
  },
  {
    title: '合同智能体',
    items: ['合同列表', '合规检查', '条款监控', '合同比对'],
  },
];

const dueDiligenceFindings = [
  { label: '商业尽调', value: '客户集中度偏高，需要补充前三大客户合同。', level: '中' },
  { label: '财务尽调', value: '现金流与收入增速匹配，毛利率假设需复核。', level: '低' },
  { label: '法务尽调', value: '历史工商变更频次较高，已生成核验清单。', level: '中' },
  { label: '技术尽调', value: '核心专利覆盖主要产品线，建议补充替代路线说明。', level: '低' },
];

const contractFindings = [
  { label: '合规检查', value: '主体信息、签署权限和附件清单完整。', level: '低' },
  { label: '条款监控', value: '付款前置条件和回购触发条款需法务确认。', level: '高' },
  { label: '合同比对', value: '与标准模板相比，信息权披露频率被降低。', level: '中' },
  { label: '风险提示', value: '违约责任缺少交割延期后的补救机制。', level: '中' },
];

const columns: ColumnsType<AgentTask> = [
  { title: '项目', dataIndex: 'projectName', width: 260 },
  { title: '工具', dataIndex: 'tool', width: 110, render: (tool) => <Tag color={tool === '尽调报告' ? 'blue' : 'purple'}>{tool}</Tag> },
  { title: '输入材料', dataIndex: 'input', width: 280 },
  { title: '状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '已完成' ? 'green' : 'orange'}>{status}</Tag> },
  { title: '处理进度', dataIndex: 'score', width: 180, render: (score) => <Progress percent={score} size="small" /> },
  { title: '结果摘要', dataIndex: 'finding', width: 320 },
];

export default function AgentToolsPage() {
  return (
    <main className="agent-page">
      <header className="agent-hero">
        <div>
          <span className="management-eyebrow">AI 工具模块</span>
          <h1>智能体</h1>
          <p>面向项目流程提供工具化处理能力：上传材料后生成尽调报告、合同审核结果和结构化风险清单，并回写项目、风险和文档模块。</p>
        </div>
        <Space>
          <Button icon={<FileSearchOutlined />}>查看任务</Button>
          <Button icon={<RobotOutlined />} type="primary">
            新建智能体任务
          </Button>
        </Space>
      </header>

      <section className="agent-layout">
        <aside className="agent-nav-panel">
          {toolNav.map((group) => (
            <div key={group.title}>
              <strong>{group.title}</strong>
              {group.items.map((item, index) => (
                <button className={index === 0 ? 'is-active' : ''} key={item}>
                  {item}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <div className="agent-main">
          <section className="agent-tools-grid">
            <ToolCard
              icon={<AuditOutlined />}
              title="尽调报告智能体"
              description="提交商业计划书、财务报表、工商、专利、访谈纪要等材料，自动生成尽调报告初稿、风险摘要和补件清单。"
              modeOptions={['综合尽调', '财务尽调', '法务尽调', '技术尽调']}
              findings={dueDiligenceFindings}
            />
            <ToolCard
              icon={<SafetyCertificateOutlined />}
              title="合同审核智能体"
              description="上传投资协议、补充协议和付款计划，进行合规检查、条款监控、合同比对和风险提示。"
              modeOptions={['合规检查', '条款监控', '合同比对']}
              findings={contractFindings}
            />
          </section>

          <section className="agent-flow">
            <div className="management-section-title">
              <h2>
                <SwapOutlined />
                智能体处理链路
              </h2>
            </div>
            <div className="agent-flow__steps">
              <article>
                <CloudUploadOutlined />
                <strong>提交材料</strong>
                <span>选择项目并上传报告、合同或附件</span>
              </article>
              <article>
                <RobotOutlined />
                <strong>AI解析</strong>
                <span>抽取关键字段、条款和风险信号</span>
              </article>
              <article>
                <WarningOutlined />
                <strong>生成结论</strong>
                <span>输出风险、建议、补件和比对结果</span>
              </article>
              <article>
                <CheckCircleOutlined />
                <strong>回写业务</strong>
                <span>同步到项目详情、风险台账和文档归档</span>
              </article>
            </div>
          </section>

          <section className="agent-task-panel">
            <div className="management-section-title">
              <h2>
                <ProfileOutlined />
                智能体任务列表
              </h2>
              <Button size="small">批量导出结果</Button>
            </div>
            <Table<AgentTask>
              columns={columns}
              dataSource={agentTasks}
              pagination={false}
              rowKey="id"
              scroll={{ x: 1250 }}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  icon,
  title,
  description,
  modeOptions,
  findings,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  modeOptions: string[];
  findings: Array<{ label: string; value: string; level: string }>;
}) {
  return (
    <article className="agent-tool-card">
      <div className="agent-tool-card__header">
        <div>{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="agent-form-grid">
        <label>
          <span>关联项目</span>
          <Select
            defaultValue={investmentProjects[0]?.id}
            options={investmentProjects.slice(0, 6).map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </label>
        <label>
          <span>处理模式</span>
          <Segmented block options={modeOptions} />
        </label>
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button block icon={<CloudUploadOutlined />}>
            上传材料
          </Button>
        </Upload>
      </div>
      <div className="agent-output-list">
        {findings.map((item) => (
          <article key={item.label}>
            <Tag color={item.level === '高' ? 'red' : item.level === '中' ? 'orange' : 'green'}>{item.level}</Tag>
            <strong>{item.label}</strong>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </article>
  );
}
