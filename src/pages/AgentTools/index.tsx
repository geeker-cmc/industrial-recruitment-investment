import {
  AuditOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  agentTasks,
  investmentProjects,
  type AgentTask,
} from '../../mock/investment';

type AgentMenuKey = 'due-diligence' | 'contract';

type AgentTaskFormValues = {
  projectName: string;
  input: string;
  files: UploadFile[];
};

type TemplateFormValues = {
  name: string;
  projectName: string;
  reference: string;
  clauseFocus: string[];
};

type TemplateStage = '待确认' | '已确认' | '已应用' | '已归档';

type ContractTemplateDraft = TemplateFormValues & {
  stage: TemplateStage;
  generatedAt: string;
};

const normalizeUploadFileList = (event?: { fileList?: UploadFile[] } | UploadFile[]) =>
  Array.isArray(event) ? event : event?.fileList ?? [];

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character,
  );

const agentMenus = [
  {
    key: 'due-diligence' as const,
    title: '尽调智能体',
    description: '管理尽调资料解析、尽调报告生成、风险点识别和补充资料清单。',
    tool: '尽调报告' as const,
    icon: <AuditOutlined />,
  },
  {
    key: 'contract' as const,
    title: '合同智能体',
    description: '管理合同合规检查、条款监控、合同比对和审核报告生成。',
    tool: '合同审核' as const,
    icon: <SafetyCertificateOutlined />,
  },
];

export default function AgentToolsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<AgentMenuKey>('due-diligence');
  const [tasks, setTasks] = useState<AgentTask[]>(agentTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<AgentTask | null>(null);
  const [form] = Form.useForm<AgentTaskFormValues>();

  useEffect(() => {
    if (searchParams.get('tool') === 'contract') setActiveKey('contract');
    if (searchParams.get('tool') === 'due-diligence') setActiveKey('due-diligence');
  }, [searchParams]);

  const activeAgent = agentMenus.find((item) => item.key === activeKey) ?? agentMenus[0]!;
  const tableRows = useMemo(
    () => tasks.filter((item) => item.tool === activeAgent.tool),
    [activeAgent.tool, tasks],
  );

  const createTask = (values: AgentTaskFormValues) => {
    const fileNames = values.files.map((file) => file.name).filter(Boolean).join('、');
    const task: AgentTask = {
      id: `agent-${Date.now()}`,
      projectName: values.projectName,
      tool: activeAgent.tool,
      input: values.input || fileNames,
      status: '待解析',
      score: 0,
      finding: `${fileNames || '资料'}已提交，等待智能体解析。`,
      updatedAt: '2026-07-08',
    };
    setTasks((rows) => [task, ...rows]);
    form.resetFields();
    setModalOpen(false);
    message.success('解析任务已提交');
  };

  const parseTask = (taskId: string) => {
    setTasks((rows) =>
      rows.map((row) => {
        if (row.id !== taskId) return row;
        return {
          ...row,
          status: '已完成',
          score: 100,
          finding:
            row.tool === '尽调报告'
              ? '已生成尽调摘要、风险点清单和补充资料清单。'
              : '已完成合规检查、条款监控和合同比对。',
          updatedAt: '2026-07-08',
        };
      }),
    );
    message.success('智能体解析已完成');
  };

  const backfillTask = (taskId: string) => {
    setTasks((rows) =>
      rows.map((row) =>
        row.id === taskId
          ? { ...row, status: '已回写', finding: `${row.finding} 结果已回写到项目、风险和文档模块。` }
          : row,
      ),
    );
    message.success('解析结果已回写业务模块');
  };

  const applyTemplateToProject = (taskId: string) => {
    setTasks((rows) =>
      rows.map((row) =>
        row.id === taskId
          ? {
              ...row,
              status: '已回写',
              finding: '专属协议模板已确认并应用到项目文档，等待法务用印与交割。',
              updatedAt: '2026-07-20',
            }
          : row,
      ),
    );
    message.success('专属模板已应用到项目文档');
  };

  return (
    <main className="agent-page">
      <header className="agent-hero">
        <div>
          <span className="management-eyebrow">AI 工具模块</span>
          <h1>智能体</h1>
          <p>智能体是资料解析任务台账。用户提交尽调资料或合同文件后，在列表中查看解析状态，解析完成后查看结果并回写业务模块。</p>
        </div>
        <Space>
          <Button icon={<FileSearchOutlined />}>高级筛选</Button>
          <Button icon={<CloudUploadOutlined />} onClick={() => setModalOpen(true)} type="primary">
            {activeKey === 'contract' ? '上传合同文件' : '上传尽调资料'}
          </Button>
        </Space>
      </header>

      <section className="agent-layout agent-layout--table">
        <aside className="agent-nav-panel">
          {agentMenus.map((item) => (
            <button
              className={activeKey === item.key ? 'is-active' : ''}
              key={item.key}
              onClick={() => setActiveKey(item.key)}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </aside>

        <section className="agent-task-panel agent-task-panel--table">
          <div className="management-table-card__header">
            <div>
              <h2>{activeAgent.title}</h2>
              <p>{activeAgent.description}</p>
            </div>
            <div className="management-table-filters">
              <Input.Search allowClear placeholder="搜索项目/资料名称" />
              <Select
                allowClear
                placeholder="解析状态"
                options={['待解析', '处理中', '已完成', '待确认', '已回写', '解析失败'].map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </div>
          </div>
          <Table<AgentTask>
            columns={agentColumns({
              activeKey,
              onBackfill: backfillTask,
              onParse: parseTask,
              onView: setActiveResult,
            })}
            dataSource={tableRows}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            rowKey="id"
            scroll={{ x: activeKey === 'due-diligence' ? 1420 : 1520 }}
          />
        </section>
      </section>

      <Modal
        destroyOnHidden
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        open={modalOpen}
        title={activeKey === 'contract' ? '上传合同文件并提交解析' : '上传尽调资料并提交解析'}
      >
        <Form<AgentTaskFormValues>
          form={form}
          layout="vertical"
          onFinish={createTask}
          requiredMark={false}
        >
          <Form.Item label="关联项目" name="projectName" rules={[{ required: true, message: '请选择关联项目' }]}>
            <Select
              placeholder="请选择关联项目"
              options={investmentProjects.map((item) => ({ label: item.name, value: item.name }))}
            />
          </Form.Item>
          <Form.Item
            getValueFromEvent={normalizeUploadFileList}
            label={activeKey === 'due-diligence' ? '上传尽调资料' : '上传合同文件'}
            name="files"
            rules={[{ required: true, message: activeKey === 'due-diligence' ? '请上传尽调资料' : '请上传合同文件' }]}
            valuePropName="fileList"
          >
            <Upload.Dragger
              accept={activeKey === 'due-diligence' ? '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip' : '.pdf,.doc,.docx'}
              beforeUpload={() => false}
              maxCount={activeKey === 'due-diligence' ? 8 : 5}
              multiple
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                {activeKey === 'due-diligence' ? '点击或拖拽上传尽调资料' : '点击或拖拽上传合同文件'}
              </p>
              <p className="ant-upload-hint">
                {activeKey === 'due-diligence'
                  ? '支持商业计划书、财报、工商材料、访谈纪要等，提交后进入尽调智能体解析队列。'
                  : '支持投资协议、补充协议、付款计划等合同文件，提交后进入合同合规检查、条款监控和合同比对。'}
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            label={activeKey === 'due-diligence' ? '资料说明' : '合同说明'}
            name="input"
          >
            <Input.TextArea
              placeholder={activeKey === 'due-diligence' ? '例如：商业计划书、财报、工商、专利、访谈纪要' : '例如：投资协议、补充协议、付款计划'}
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        onClose={() => setActiveResult(null)}
        open={Boolean(activeResult)}
        title="智能体解析内容"
        width={620}
      >
        {activeResult && (
          <AgentResultContent
            navigateToProject={(projectName) => {
              const project = investmentProjects.find((item) => item.name === projectName);
              if (project) navigate(`/projects/${project.id}`);
            }}
            onTemplateApplied={applyTemplateToProject}
            task={activeResult}
          />
        )}
      </Drawer>
    </main>
  );
}

function agentColumns({
  activeKey,
  onParse,
  onView,
  onBackfill,
}: {
  activeKey: AgentMenuKey;
  onParse: (taskId: string) => void;
  onView: (task: AgentTask) => void;
  onBackfill: (taskId: string) => void;
}): ColumnsType<AgentTask> {
  const baseColumns: ColumnsType<AgentTask> = [
    { title: '任务编号', dataIndex: 'id', width: 150, fixed: 'left' },
    { title: '关联项目', dataIndex: 'projectName', width: 260 },
    {
      title: activeKey === 'due-diligence' ? '资料类型' : '合同名称',
      dataIndex: 'input',
      width: 260,
      render: (input) => <span className="agent-input-summary">{input}</span>,
    },
    { title: '文件数量', width: 90, render: () => activeKey === 'due-diligence' ? '6份' : '3份' },
    { title: '提交人', width: 90, render: () => '张小令' },
    { title: '提交时间', dataIndex: 'updatedAt', width: 120 },
    {
      title: '解析状态',
      dataIndex: 'status',
      width: 110,
      render: (status: AgentTask['status']) => <Tag color={agentStatusColor(status)}>{status}</Tag>,
    },
    {
      title: '解析进度',
      dataIndex: 'score',
      width: 150,
      render: (score) => <Progress percent={score} size="small" />,
    },
  ];

  const dueColumns: ColumnsType<AgentTask> = [
    { title: '风险点数量', width: 100, render: (_, row) => row.score >= 100 ? '5项' : '--' },
    { title: '报告状态', width: 110, render: (_, row) => row.score >= 100 ? <Tag color="green">已生成</Tag> : <Tag>未生成</Tag> },
  ];

  const contractColumns: ColumnsType<AgentTask> = [
    { title: '高风险条款', width: 110, render: (_, row) => row.score >= 100 ? '3条' : '--' },
    { title: '合规结果', width: 110, render: (_, row) => row.score >= 100 ? <Tag color="orange">待确认</Tag> : <Tag>未完成</Tag> },
    { title: '比对结果', width: 110, render: (_, row) => row.score >= 100 ? '2处差异' : '--' },
  ];

  return [
    ...baseColumns,
    ...(activeKey === 'due-diligence' ? dueColumns : contractColumns),
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      render: (_, row) => {
        const canView = ['已完成', '待确认', '已回写'].includes(row.status);
        return (
          <Space className="management-row-actions">
            <Button disabled={canView} onClick={() => onParse(row.id)} size="small" type="link">
              {row.status === '待解析' ? '开始解析' : '重新解析'}
            </Button>
            <Button disabled={!canView} onClick={() => onView(row)} size="small" type="link">
              查看内容
            </Button>
            <Button disabled={!canView || row.status === '已回写'} onClick={() => onBackfill(row.id)} size="small" type="link">
              回写
            </Button>
          </Space>
        );
      },
    },
  ];
}

function AgentResultContent({
  task,
  onTemplateApplied,
  navigateToProject,
}: {
  task: AgentTask;
  onTemplateApplied: (taskId: string) => void;
  navigateToProject: (projectName: string) => void;
}) {
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateDraft, setTemplateDraft] = useState<ContractTemplateDraft | null>(null);
  const [templatePreviewOpen, setTemplatePreviewOpen] = useState(false);
  const [templateForm] = Form.useForm<TemplateFormValues>();

  const templateStep = templateDraft
    ? templateDraft.stage === '待确认'
      ? 1
      : templateDraft.stage === '已确认'
        ? 2
        : 3
    : 0;

  const generateTemplate = (values: TemplateFormValues) => {
    setTemplateDraft({
      ...values,
      stage: '待确认',
      generatedAt: '2026-07-20 14:30',
    });
    setTemplateModalOpen(false);
    templateForm.resetFields();
    message.success('专属模板草案已生成，请完成法务确认');
  };

  const confirmTemplate = () => {
    setTemplateDraft((draft) => (draft ? { ...draft, stage: '已确认' } : draft));
    message.success('模板已完成法务确认');
  };

  const applyTemplate = () => {
    if (!templateDraft || templateDraft.stage !== '已确认') return;
    setTemplateDraft({ ...templateDraft, stage: '已应用' });
    onTemplateApplied(task.id);
  };

  const archiveTemplate = () => {
    if (!templateDraft || templateDraft.stage !== '已应用') return;
    setTemplateDraft({ ...templateDraft, stage: '已归档' });
    message.success('专属模板已归档到项目文档');
  };

  const exportTemplate = () => {
    if (!templateDraft) return;
    const clauses = templateDraft.clauseFocus
      .map((clause, index) => `<li><strong>${index + 1}. ${escapeHtml(clause)}</strong>：纳入南通产控专属条款，统一触发条件、材料和审批责任。</li>`)
      .join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(templateDraft.name)}</title></head><body><h1>${escapeHtml(templateDraft.name)}</h1><p>关联项目：${escapeHtml(templateDraft.projectName)}</p><p>参考范围：${escapeHtml(templateDraft.reference)}</p><p>模板状态：${escapeHtml(templateDraft.stage)}</p><p>生成时间：${escapeHtml(templateDraft.generatedAt)}</p><h2>专属条款</h2><ol>${clauses}</ol></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateDraft.name}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('专属模板已导出');
  };

  if (task.tool === '尽调报告') {
    return (
      <div className="agent-result-content">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="关联项目">{task.projectName}</Descriptions.Item>
          <Descriptions.Item label="尽调摘要">企业业务模式清晰，收入增长较快，但核心客户集中度和应收账款周期需要重点核验。</Descriptions.Item>
          <Descriptions.Item label="材料完整性">已解析商业计划书、财报、工商、专利、访谈纪要；缺少前三大客户合同。</Descriptions.Item>
          <Descriptions.Item label="商业分析">客户集中度偏高，建议补充替代客户和在手订单证明。</Descriptions.Item>
          <Descriptions.Item label="财务分析">毛利率高于同业均值，需复核成本归集口径。</Descriptions.Item>
          <Descriptions.Item label="法务分析">历史股权变更正常，未发现重大诉讼。</Descriptions.Item>
          <Descriptions.Item label="风险点清单">客户集中度、回款周期、财务预测偏乐观、专利权属确认、核心团队稳定性。</Descriptions.Item>
          <Descriptions.Item label="AI结论">建议进入估值参考环节，但需先补充客户合同与回款证明。</Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  return (
    <div className="agent-result-content">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="关联项目">{task.projectName}</Descriptions.Item>
        <Descriptions.Item label="合同摘要">投资协议主体、投资金额、交割条件、回购条款和信息权条款已完成结构化抽取。</Descriptions.Item>
        <Descriptions.Item label="合规检查">主体信息和签署权限完整，付款前置条件需要补充附件清单。</Descriptions.Item>
        <Descriptions.Item label="条款监控">发现回购触发、反稀释、信息披露频率 3 类重点条款。</Descriptions.Item>
        <Descriptions.Item label="合同比对">与标准模板相比，信息权披露频率降低，违约补救条款缺失。</Descriptions.Item>
        <Descriptions.Item label="高风险条款">付款前置条件、回购触发、交割延期补救机制。</Descriptions.Item>
        <Descriptions.Item label="修改建议">补充付款材料清单，明确回购触发口径，增加交割延期违约责任。</Descriptions.Item>
        <Descriptions.Item label="AI结论">建议法务确认高风险条款后再进入用印和交割。</Descriptions.Item>
      </Descriptions>
      <section className="agent-result-section">
        <h3>
          <SafetyCertificateOutlined />
          法规与格式条款梳理
        </h3>
        <Table
          columns={[
            { title: '条款类型', dataIndex: 'clause', width: 130 },
            { title: '法规/制度依据', dataIndex: 'basis' },
            {
              title: '风险等级',
              dataIndex: 'level',
              width: 100,
              render: (level) => <Tag color={level === '高' ? 'red' : level === '中' ? 'orange' : 'green'}>{level}</Tag>,
            },
            { title: 'AI建议', dataIndex: 'advice' },
          ]}
          dataSource={[
            {
              id: 'clause-1',
              clause: '分期出资',
              basis: '公司章程、投委会决议、集团投资管理办法',
              level: '中',
              advice: '补充付款前置材料清单和每期触发条件。',
            },
            {
              id: 'clause-2',
              clause: '信息权',
              basis: '股东知情权、投后管理制度、历史投资协议模板',
              level: '高',
              advice: '披露频率由半年调整为季度，并增加重大事项即时告知。',
            },
            {
              id: 'clause-3',
              clause: '回购触发',
              basis: '公司法相关规则、合同编一般规则、集团风控口径',
              level: '中',
              advice: '明确触发口径、宽限期和董事会确认流程。',
            },
          ]}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </section>
      <section className="agent-result-section">
        <div className="agent-template-header">
          <h3>
            <FileProtectOutlined />
            南通产控专属协议模板
          </h3>
          <Button
            disabled={Boolean(templateDraft && templateDraft.stage !== '已归档')}
            onClick={() => {
              templateForm.setFieldsValue({
                projectName: task.projectName,
                name: `${task.projectName}-南通产控专属投资协议模板`,
                reference: '当前投资协议 + 集团历史协议 + 投资管理制度',
                clauseFocus: ['分期出资', '信息权', '回购触发', '反稀释', '交割延期'],
              });
              setTemplateModalOpen(true);
            }}
            type="primary"
          >
            {templateDraft ? '重新生成模板' : '配置并生成模板'}
          </Button>
        </div>
        {templateDraft ? (
          <div className="agent-template-workflow">
            <Steps
              current={templateStep}
              items={[
                { title: '生成草案', description: 'AI提取条款' },
                { title: '法务确认', description: '确认差异与风险' },
                { title: '应用项目', description: '进入合同文档' },
                { title: '归档留痕', description: '沉淀模板资产' },
              ]}
              size="small"
              status={templateDraft.stage === '已归档' ? 'finish' : 'process'}
            />
            <div className="agent-template-result">
              <div>
                <span>模板名称</span>
                <strong>{templateDraft.name}</strong>
                <small>关联项目：{templateDraft.projectName}</small>
              </div>
              <div>
                <span>参考范围</span>
                <strong>多源融合</strong>
                <small>{templateDraft.reference}</small>
              </div>
              <div>
                <span>当前状态</span>
                <strong>{templateDraft.stage}</strong>
                <small>生成时间：{templateDraft.generatedAt}</small>
              </div>
            </div>
            <Divider orientation="left">模板差异与专属条款</Divider>
            <Table
              columns={[
                { title: '条款模块', dataIndex: 'clause', width: 120 },
                { title: '处理方式', dataIndex: 'action', width: 110, render: (value) => <Tag color="blue">{value}</Tag> },
                { title: '模板处理建议', dataIndex: 'advice' },
                { title: '确认状态', dataIndex: 'status', width: 100, render: () => <Tag color={templateDraft.stage === '待确认' ? 'orange' : 'green'}>{templateDraft.stage === '待确认' ? '待确认' : '已确认'}</Tag> },
              ]}
              dataSource={templateDraft.clauseFocus.map((clause, index) => ({
                key: clause,
                clause,
                action: index < 2 ? '重点新增' : '口径优化',
                advice: clause === '信息权' ? '提高重大事项披露频率，并保留季度经营信息获取权。' : `${clause}纳入南通产控专属条款，统一触发条件、材料和审批责任。`,
                status: templateDraft.stage,
              }))}
              pagination={false}
              rowKey="key"
              size="small"
            />
            <div className="agent-template-actions">
              <Space wrap>
                <Button icon={<EyeOutlined />} onClick={() => setTemplatePreviewOpen(true)}>
                  预览模板
                </Button>
                <Button icon={<DownloadOutlined />} onClick={exportTemplate}>
                  导出模板
                </Button>
                <Button disabled={templateDraft.stage !== '待确认'} onClick={confirmTemplate} type="primary">
                  <CheckCircleOutlined /> 法务确认模板
                </Button>
                <Button disabled={templateDraft.stage !== '已确认'} onClick={applyTemplate}>
                  应用到项目文档
                </Button>
                <Button disabled={templateDraft.stage !== '已应用'} onClick={archiveTemplate}>
                  归档模板
                </Button>
                <Button onClick={() => navigateToProject(task.projectName)} type="link">
                  查看项目详情
                </Button>
              </Space>
              <span className="agent-template-action-hint">
                {templateDraft.stage === '待确认'
                  ? '请先确认条款差异，确认后才可应用到项目。'
                  : templateDraft.stage === '已确认'
                    ? '模板已确认，可以应用到项目合同文档。'
                    : templateDraft.stage === '已应用'
                      ? '模板已进入项目文档，归档后形成可复用资产。'
                      : '模板已完成归档，可作为后续项目的历史参考。'}
              </span>
            </div>
          </div>
        ) : (
          <p className="agent-template-empty">
            先配置模板名称、关联项目、参考范围和重点条款，系统会基于当前合同、集团历史协议和投资管理制度生成模板草案；完成法务确认后，才能应用到项目文档并归档。
          </p>
        )}
      </section>

      <Modal
        destroyOnHidden
        onCancel={() => setTemplateModalOpen(false)}
        onOk={() => templateForm.submit()}
        open={templateModalOpen}
        title="配置南通产控专属协议模板"
        width={680}
      >
        <Form<TemplateFormValues>
          form={templateForm}
          layout="vertical"
          onFinish={generateTemplate}
          requiredMark={false}
        >
          <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入专属模板名称" />
          </Form.Item>
          <Form.Item label="关联项目" name="projectName" rules={[{ required: true, message: '请选择关联项目' }]}>
            <Select options={investmentProjects.map((item) => ({ label: item.name, value: item.name }))} />
          </Form.Item>
          <Form.Item label="参考范围" name="reference" rules={[{ required: true, message: '请输入参考范围' }]}>
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} placeholder="例如：当前投资协议、集团历史协议、投资管理制度" />
          </Form.Item>
          <Form.Item label="重点条款配置" name="clauseFocus" rules={[{ required: true, message: '请选择至少一个重点条款' }]}>
            <Checkbox.Group
              options={['分期出资', '信息权', '回购触发', '反稀释', '交割延期', '投后管理权', '重大事项披露']}
            />
          </Form.Item>
          <div className="agent-template-config-note">
            AI 将根据当前合同的条款结构提取差异，结合集团历史协议和配置的重点条款形成模板草案；生成后仍需法务确认。
          </div>
        </Form>
      </Modal>
      <Modal
        footer={
          <Space>
            <Button onClick={() => setTemplatePreviewOpen(false)}>关闭</Button>
            <Button icon={<DownloadOutlined />} onClick={exportTemplate} type="primary">
              导出模板
            </Button>
          </Space>
        }
        onCancel={() => setTemplatePreviewOpen(false)}
        open={templatePreviewOpen}
        title="模板预览"
        width={760}
      >
        {templateDraft ? (
          <div className="agent-template-preview">
            <h1>{templateDraft.name}</h1>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="关联项目">{templateDraft.projectName}</Descriptions.Item>
              <Descriptions.Item label="参考范围">{templateDraft.reference}</Descriptions.Item>
              <Descriptions.Item label="模板状态">
                <Tag color={templateDraft.stage === '待确认' ? 'orange' : 'green'}>{templateDraft.stage}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="生成时间">{templateDraft.generatedAt}</Descriptions.Item>
            </Descriptions>
            <h2>专属条款</h2>
            <ol>
              {templateDraft.clauseFocus.map((clause) => (
                <li key={clause}>
                  <strong>{clause}</strong>
                  <span>纳入南通产控专属条款，统一触发条件、材料和审批责任。</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function agentStatusColor(status: AgentTask['status']) {
  if (status === '已完成' || status === '已回写') return 'green';
  if (status === '解析失败') return 'red';
  if (status === '处理中' || status === '待确认') return 'blue';
  return 'orange';
}
