import {
  FileSearchOutlined,
  ProjectOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { companies } from '../../mock/industry';
import {
  customerRecords,
  documentRecords,
  riskRecords,
  type CustomerRecord,
  type DocumentRecord,
  type InvestmentProject,
  type LifecycleStage,
  type ProjectStatus,
  type RiskLevel,
  type RiskRecord,
} from '../../mock/investment';
import { useInvestmentStore } from '../../stores/useInvestmentStore';

type ManagementKey = 'project' | 'customer' | 'risk' | 'document';
type ModalKey = ManagementKey | null;

type ManagementModule = {
  key: ManagementKey;
  navName: string;
  title: string;
  description: string;
  primaryAction: string;
  primaryIcon: ReactNode;
};

type ProjectFormValues = {
  name: string;
  companyId: string;
  targetAmount: number;
  owner: string;
  capitalPlan: string;
  opportunitySource?: string;
  opportunityReason?: string;
};

type CustomerFormValues = {
  name: string;
  kind: CustomerRecord['kind'];
  contact: string;
  preference: string;
  committed: string;
};

type DocumentFormValues = {
  name: string;
  projectName: string;
  type: DocumentRecord['type'];
  owner: string;
};

type RiskAssignFormValues = {
  owner: string;
  remark: string;
};

type RiskProcessFormValues = {
  plan?: string;
  conclusion?: string;
  remark: string;
};

const modules: Record<ManagementKey, ManagementModule> = {
  project: {
    key: 'project',
    navName: '项目管理',
    title: '项目列表',
    description: '项目管理是主流程台账，从新建项目开始串联募、投、管、退各阶段状态和下一步动作。',
    primaryAction: '新建项目',
    primaryIcon: <ProjectOutlined />,
  },
  customer: {
    key: 'customer',
    navName: '客户管理',
    title: '客户列表',
    description: '客户管理维护自然人和机构客户，支撑募集阶段的投资人、出资人、投资机构认证、回访、认缴和实缴。',
    primaryAction: '导入客户',
    primaryIcon: <UploadOutlined />,
  },
  risk: {
    key: 'risk',
    navName: '风险管理',
    title: '风险列表',
    description: '风险管理沉淀项目和被投企业的风险事项，通过来源、等级、责任人和处置状态形成闭环。',
    primaryAction: '批量分派',
    primaryIcon: <WarningOutlined />,
  },
  document: {
    key: 'document',
    navName: '文档管理',
    title: '文档列表',
    description: '文档管理统一存储尽调报告、合同、审批文件、投后报告和退出复盘，保障资料完整与可追溯。',
    primaryAction: '上传文件',
    primaryIcon: <UploadOutlined />,
  },
};

const lifecycleStages: LifecycleStage[] = ['募', '投', '管', '退'];

const projectStatusFlow: ProjectStatus[] = [
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
];

const stageByStatus: Record<ProjectStatus, LifecycleStage> = {
  草稿: '募',
  待立项: '募',
  募集中: '募',
  尽调中: '投',
  估值中: '投',
  投决中: '投',
  合同中: '投',
  交割中: '投',
  投后管理: '管',
  退出准备: '退',
  退出中: '退',
  已退出: '退',
  已终止: '退',
};

export default function BusinessManagementPage({
  moduleKey = 'project',
}: {
  moduleKey?: ManagementKey;
}) {
  const activeModule = modules[moduleKey] ?? modules.project;
  const location = useLocation();
  const hideRiskHeaderActions = location.pathname === '/risk-management';
  const projects = useInvestmentStore((state) => state.projects);
  const addProjectToStore = useInvestmentStore((state) => state.addProject);
  const updateProject = useInvestmentStore((state) => state.updateProject);
  const [customers, setCustomers] = useState<CustomerRecord[]>(customerRecords);
  const [risks, setRisks] = useState<RiskRecord[]>(riskRecords);
  const [documents, setDocuments] = useState<DocumentRecord[]>(documentRecords);
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentRecord | null>(null);
  const [activeRiskAction, setActiveRiskAction] = useState<{ risk: RiskRecord; operation: RiskRecord['operation'] } | null>(null);
  const [projectForm] = Form.useForm<ProjectFormValues>();
  const [customerForm] = Form.useForm<CustomerFormValues>();
  const [documentForm] = Form.useForm<DocumentFormValues>();
  const [riskAssignForm] = Form.useForm<RiskAssignFormValues>();
  const [riskProcessForm] = Form.useForm<RiskProcessFormValues>();

  useEffect(() => {
    if (moduleKey !== 'project' || !location.search) return;
    const params = new URLSearchParams(location.search);
    const companyId = params.get('companyId');
    const company = companies.find((item) => item.id === companyId);
    if (!company) return;
    projectForm.setFieldsValue({
      name: `${company.shortName}投资项目`,
      companyId: company.id,
      targetAmount: 2000,
      capitalPlan: params.get('recommendationSource') ? `${params.get('recommendationSource')}专项资金计划` : '产业投资专项资金计划',
      owner: '张小令',
      opportunitySource: params.get('recommendationSource') ?? '企业画像推荐',
      opportunityReason: params.get('recommendationReason') ?? '基于企业画像进入项目储备。',
    });
    setActiveModal('project');
  }, [location.search, moduleKey, projectForm]);

  const openPrimaryAction = () => {
    setActiveModal(activeModule.key);
  };

  const openRiskAction = (risk: RiskRecord) => {
    setActiveRiskAction({ risk, operation: risk.operation });
    if (risk.operation === 'assign') {
      riskAssignForm.resetFields();
      riskAssignForm.setFieldsValue({ owner: risk.owner === '未分派' ? undefined : risk.owner });
      return;
    }
    riskProcessForm.resetFields();
  };

  const closeRiskAction = () => {
    setActiveRiskAction(null);
    riskAssignForm.resetFields();
    riskProcessForm.resetFields();
  };

  const assignRisk = (values: RiskAssignFormValues) => {
    if (!activeRiskAction) return;
    const { risk } = activeRiskAction;
    setRisks((rows) =>
      rows.map((row) =>
        row.id === risk.id
          ? {
              ...row,
              owner: values.owner,
              status: '处置中',
              operation: 'handle',
              action: `已指派给${values.owner}，等待提交处置结论。备注：${values.remark}`,
            }
          : row,
      ),
    );
    closeRiskAction();
    message.success('风险已指派，状态已变更为处置中');
  };

  const processRisk = (values: RiskProcessFormValues) => {
    if (!activeRiskAction) return;
    const { risk } = activeRiskAction;
    const isInitialSubmission = risk.status === '待处置';
    const detail = isInitialSubmission ? values.plan : values.conclusion;
    if (!detail) return;
    setRisks((rows) =>
      rows.map((row) =>
        row.id === risk.id
          ? {
              ...row,
              status: isInitialSubmission ? '处置中' : '已闭环',
              operation: 'handle',
              action: `${isInitialSubmission ? '已提交处置方案' : '已完成风险处理'}：${detail}。备注：${values.remark}`,
            }
          : row,
      ),
    );
    closeRiskAction();
    message.success(isInitialSubmission ? '处置方案已提交，状态已变更为处置中' : '风险处理已提交，状态已变更为已闭环');
  };

  const advanceProject = (projectId: string) => {
    const currentProject = projects.find((row) => row.id === projectId);
    if (!currentProject) return;
    const currentIndex = projectStatusFlow.indexOf(currentProject.status);
    if (currentIndex < 0 || currentIndex === projectStatusFlow.length - 1 || currentProject.status === '已终止') {
      message.info('当前项目已到终态，无法继续推进');
      return;
    }
    const nextStatus = projectStatusFlow[currentIndex + 1]!;
    updateProject(projectId, (row) => ({
      ...row,
      status: nextStatus,
      stage: stageByStatus[nextStatus],
      progress: Math.min(100, row.progress + 8),
      nextAction: nextActionByStatus(nextStatus),
    }));
    message.success(`${currentProject.name} 已推进至 ${nextStatus}`);
  };

  const addProject = (values: ProjectFormValues) => {
    const company = companies.find((item) => item.id === values.companyId) ?? companies[0]!;
    const project: InvestmentProject = {
      id: `project-${Date.now()}`,
      name: values.name,
      company,
      stage: '募',
      status: '草稿',
      capitalPlan: values.capitalPlan,
      targetAmount: `${Number(values.targetAmount || 0).toLocaleString()}万`,
      committedAmount: '0万',
      paidAmount: '0万',
      investorCount: 0,
      owner: values.owner,
      manager: values.owner,
      startDate: '2026-07-08',
      expectedExit: '待确认',
      progress: 8,
      risk: '低',
      nextAction: '完善项目信息并提交立项审批',
      aiAdvice: '建议先补充商业计划书、股东结构和拟投金额依据。',
      valuation: '待估值',
      participants: [],
      risks: [],
      documents: [],
      agentOutputs: [],
      opportunitySource: values.opportunitySource,
      opportunityReason: values.opportunityReason,
    };
    addProjectToStore(project);
    projectForm.resetFields();
    setActiveModal(null);
    message.success('新建项目成功');
  };

  const addCustomer = (values: CustomerFormValues) => {
    const customer: CustomerRecord = {
      id: `customer-${Date.now()}`,
      name: values.name,
      kind: values.kind,
      contact: values.contact,
      source: '手工导入',
      status: '待认证',
      preference: values.preference,
      committed: values.committed,
      paid: '0万',
      nextAction: '完成客户认证和适当性审核',
    };
    setCustomers((rows) => [customer, ...rows]);
    customerForm.resetFields();
    setActiveModal(null);
    message.success('客户已导入');
  };

  const addDocument = (values: DocumentFormValues) => {
    const document: DocumentRecord = {
      id: `doc-${Date.now()}`,
      name: values.name,
      projectName: values.projectName,
      type: values.type,
      owner: values.owner,
      status: '待归档',
      updatedAt: '2026-07-08',
    };
    setDocuments((rows) => [document, ...rows]);
    documentForm.resetFields();
    setActiveModal(null);
    message.success('文档已上传');
  };

  return (
    <main className="management-page">
      <section className="management-workspace">
        <header className="management-hero management-hero--compact">
          <div>
            <span className="management-eyebrow">股权投资业务管理系统</span>
            <h1>{activeModule.navName}</h1>
            <p>{activeModule.description}</p>
          </div>
          {!hideRiskHeaderActions && (
            <Space>
              <Button icon={<FileSearchOutlined />}>高级筛选</Button>
              <Button icon={activeModule.primaryIcon} onClick={openPrimaryAction} type="primary">
                {activeModule.primaryAction}
              </Button>
            </Space>
          )}
        </header>

        <TableModule
          customers={customers}
          documents={documents}
          module={activeModule}
          onAdvanceProject={advanceProject}
          onRiskAction={openRiskAction}
          onConnectCustomer={(customerId) => {
            const related = relatedProject(customerId, projects);
            setCustomers((rows) =>
              rows.map((row) =>
                row.id === customerId
                  ? { ...row, nextAction: `已关联项目：${related.name}` }
                  : row,
              ),
            );
            message.success('客户已关联项目');
          }}
          onPreviewDocument={setPreviewDocument}
          onReviewCustomer={(customerId) => {
            setCustomers((rows) =>
              rows.map((row) =>
                row.id === customerId
                  ? { ...row, status: '回访中', nextAction: '已生成回访任务，等待客户确认出资节奏' }
                  : row,
              ),
            );
            message.success('已生成客户回访任务');
          }}
          onArchiveDocument={(documentId) => {
            setDocuments((rows) =>
              rows.map((row) =>
                row.id === documentId ? { ...row, status: '已归档', updatedAt: '2026-07-08' } : row,
              ),
            );
            message.success('文档已归档');
          }}
          projects={projects}
          risks={risks}
        />
      </section>

      <Modal
        destroyOnHidden
        onCancel={() => setActiveModal(null)}
        onOk={() => projectForm.submit()}
        open={activeModal === 'project'}
        title="新建项目"
      >
        <Form<ProjectFormValues>
          form={projectForm}
          layout="vertical"
          onFinish={addProject}
          requiredMark={false}
        >
          <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item label="被投企业" name="companyId" rules={[{ required: true, message: '请选择被投企业' }]}>
            <Select
              placeholder="请选择被投企业"
              options={companies.map((item) => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          <Form.Item label="拟投金额（万元）" name="targetAmount" rules={[{ required: true, message: '请输入拟投金额' }]}>
            <InputNumber min={0} placeholder="请输入拟投金额" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="资金计划" name="capitalPlan" rules={[{ required: true, message: '请输入资金计划' }]}>
            <Input placeholder="例如：电子信息一期资金计划" />
          </Form.Item>
          <Form.Item label="机会来源" name="opportunitySource">
            <Input placeholder="例如：投资风格相似、产业链补链" />
          </Form.Item>
          <Form.Item label="推荐依据" name="opportunityReason">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="请输入推荐企业进入项目的依据" />
          </Form.Item>
          <Form.Item label="负责人" name="owner" rules={[{ required: true, message: '请输入负责人' }]}>
            <Input placeholder="请输入负责人" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnHidden
        onCancel={() => setActiveModal(null)}
        onOk={() => customerForm.submit()}
        open={activeModal === 'customer'}
        title="导入客户"
      >
        <Form<CustomerFormValues>
          form={customerForm}
          layout="vertical"
          onFinish={addCustomer}
          requiredMark={false}
        >
          <Form.Item label="客户名称" name="name" rules={[{ required: true, message: '请输入客户名称' }]}>
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item label="客户类型" name="kind" rules={[{ required: true, message: '请选择客户类型' }]}>
            <Select
              options={['投资人', '出资人', '投资机构'].map((item) => ({ label: item, value: item }))}
              placeholder="请选择客户类型"
            />
          </Form.Item>
          <Form.Item label="联系人" name="contact" rules={[{ required: true, message: '请输入联系人' }]}>
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item label="投资偏好" name="preference" rules={[{ required: true, message: '请输入投资偏好' }]}>
            <Input placeholder="例如：电子信息、高端装备" />
          </Form.Item>
          <Form.Item label="认缴金额" name="committed" rules={[{ required: true, message: '请输入认缴金额' }]}>
            <Input placeholder="例如：1,000万" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnHidden
        onCancel={() => setActiveModal(null)}
        onOk={() => documentForm.submit()}
        open={activeModal === 'document'}
        title="上传文件"
      >
        <Form<DocumentFormValues>
          form={documentForm}
          layout="vertical"
          onFinish={addDocument}
          requiredMark={false}
        >
          <Form.Item label="文档名称" name="name" rules={[{ required: true, message: '请输入文档名称' }]}>
            <Input placeholder="请输入文档名称" />
          </Form.Item>
          <Form.Item label="关联项目" name="projectName" rules={[{ required: true, message: '请选择关联项目' }]}>
            <Select
              placeholder="请选择关联项目"
              options={projects.map((item) => ({ label: item.name, value: item.name }))}
            />
          </Form.Item>
          <Form.Item label="文档类型" name="type" rules={[{ required: true, message: '请选择文档类型' }]}>
            <Select
              options={['立项文件', '尽调报告', '估值材料', '投决文件', '合同文件', '投后报告', '退出复盘'].map((item) => ({
                label: item,
                value: item,
              }))}
              placeholder="请选择文档类型"
            />
          </Form.Item>
          <Form.Item label="责任人" name="owner" rules={[{ required: true, message: '请输入责任人' }]}>
            <Input placeholder="请输入责任人" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        onClose={() => setPreviewDocument(null)}
        open={Boolean(previewDocument)}
        title="文档预览"
        width={520}
      >
        {previewDocument && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="文档名称">{previewDocument.name}</Descriptions.Item>
            <Descriptions.Item label="关联项目">{previewDocument.projectName}</Descriptions.Item>
            <Descriptions.Item label="文档类型">{previewDocument.type}</Descriptions.Item>
            <Descriptions.Item label="归档状态">{previewDocument.status}</Descriptions.Item>
            <Descriptions.Item label="责任人">{previewDocument.owner}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{previewDocument.updatedAt}</Descriptions.Item>
            <Descriptions.Item label="智能摘要">
              文档已完成结构化识别，可用于项目节点推进、风险处置留痕和归档完整性检查。
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        destroyOnHidden
        onCancel={closeRiskAction}
        onOk={() => (activeRiskAction?.operation === 'assign' ? riskAssignForm.submit() : riskProcessForm.submit())}
        open={Boolean(activeRiskAction)}
        title={activeRiskAction?.operation === 'assign' ? '指派风险责任人' : '处理风险事项'}
      >
        {activeRiskAction?.operation === 'assign' ? (
          <Form<RiskAssignFormValues>
            form={riskAssignForm}
            layout="vertical"
            onFinish={assignRisk}
            requiredMark={false}
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="风险事项">{activeRiskAction.risk.object}</Descriptions.Item>
              <Descriptions.Item label="关联项目">{activeRiskAction.risk.projectName}</Descriptions.Item>
            </Descriptions>
            <Form.Item label="指定负责人" name="owner" rules={[{ required: true, message: '请选择负责人' }]}>
              <Select
                placeholder="请选择风险负责人"
                options={['张小令', '王敏', '赵然', '周宁', '李华'].map((owner) => ({ label: owner, value: owner }))}
              />
            </Form.Item>
            <Form.Item label="指派备注" name="remark" rules={[{ required: true, message: '请填写指派备注' }]}>
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="说明指派原因、处理时限或需要关注的材料" />
            </Form.Item>
          </Form>
        ) : activeRiskAction ? (
          <Form<RiskProcessFormValues>
            form={riskProcessForm}
            layout="vertical"
            onFinish={processRisk}
            requiredMark={false}
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="风险事项">{activeRiskAction.risk.object}</Descriptions.Item>
              <Descriptions.Item label="当前状态">{activeRiskAction.risk.status}</Descriptions.Item>
              <Descriptions.Item label="责任人">{activeRiskAction.risk.owner}</Descriptions.Item>
            </Descriptions>
            {activeRiskAction.risk.status === '待处置' ? (
              <Form.Item label="处置方案" name="plan" rules={[{ required: true, message: '请填写处置方案' }]}>
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="请填写拟采取的核验、补件或整改方案" />
              </Form.Item>
            ) : (
              <Form.Item label="处理结论" name="conclusion" rules={[{ required: true, message: '请填写处理结论' }]}>
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="请填写风险是否解除、核验结果和后续要求" />
              </Form.Item>
            )}
            <Form.Item label="处理备注" name="remark" rules={[{ required: true, message: '请填写处理备注' }]}>
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="补充处理依据、附件说明或需要持续关注的事项" />
            </Form.Item>
          </Form>
        ) : null}
      </Modal>
    </main>
  );
}

function TableModule({
  module,
  projects,
  customers,
  risks,
  documents,
  onAdvanceProject,
  onReviewCustomer,
  onConnectCustomer,
  onRiskAction,
  onPreviewDocument,
  onArchiveDocument,
}: {
  module: ManagementModule;
  projects: InvestmentProject[];
  customers: CustomerRecord[];
  risks: RiskRecord[];
  documents: DocumentRecord[];
  onAdvanceProject: (projectId: string) => void;
  onReviewCustomer: (customerId: string) => void;
  onConnectCustomer: (customerId: string) => void;
  onRiskAction: (risk: RiskRecord) => void;
  onPreviewDocument: (document: DocumentRecord) => void;
  onArchiveDocument: (documentId: string) => void;
}) {
  return (
    <section className="management-table-card">
      <div className="management-table-card__header">
        <div>
          <h2>{module.title}</h2>
          <p>{tableHint(module.key)}</p>
        </div>
        <TableFilters moduleKey={module.key} />
      </div>
      {renderModuleTable({
        customers,
        documents,
        moduleKey: module.key,
        onAdvanceProject,
        onArchiveDocument,
        onRiskAction,
        onConnectCustomer,
        onPreviewDocument,
        onReviewCustomer,
        projects,
        risks,
      })}
    </section>
  );
}

function TableFilters({ moduleKey }: { moduleKey: ManagementKey }) {
  return (
    <div className="management-table-filters">
      <Input.Search
        allowClear
        placeholder={moduleKey === 'project' ? '搜索项目/被投企业' : '搜索名称/关联项目'}
      />
      <Select
        allowClear
        placeholder="所属阶段"
        options={lifecycleStages.map((stage) => ({ label: stage, value: stage }))}
      />
      <Select
        allowClear
        placeholder="状态"
        options={statusOptions(moduleKey)}
      />
    </div>
  );
}

function renderModuleTable({
  moduleKey,
  projects,
  customers,
  risks,
  documents,
  onAdvanceProject,
  onReviewCustomer,
  onConnectCustomer,
  onRiskAction,
  onPreviewDocument,
  onArchiveDocument,
}: {
  moduleKey: ManagementKey;
  projects: InvestmentProject[];
  customers: CustomerRecord[];
  risks: RiskRecord[];
  documents: DocumentRecord[];
  onAdvanceProject: (projectId: string) => void;
  onReviewCustomer: (customerId: string) => void;
  onConnectCustomer: (customerId: string) => void;
  onRiskAction: (risk: RiskRecord) => void;
  onPreviewDocument: (document: DocumentRecord) => void;
  onArchiveDocument: (documentId: string) => void;
}) {
  switch (moduleKey) {
    case 'customer':
      return (
        <CustomerTable
          customers={customers}
          onConnectCustomer={onConnectCustomer}
          onReviewCustomer={onReviewCustomer}
          projects={projects}
        />
      );
    case 'risk':
      return (
        <RiskTable
          onRiskAction={onRiskAction}
          projects={projects}
          risks={risks}
        />
      );
    case 'document':
      return (
        <DocumentTable
          documents={documents}
          onArchiveDocument={onArchiveDocument}
          onPreviewDocument={onPreviewDocument}
        />
      );
    case 'project':
    default:
      return <ProjectTable onAdvanceProject={onAdvanceProject} projects={projects} />;
  }
}

function ProjectTable({
  projects,
  onAdvanceProject,
}: {
  projects: InvestmentProject[];
  onAdvanceProject: (projectId: string) => void;
}) {
  const columns: ColumnsType<InvestmentProject> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 260,
      fixed: 'left',
      render: (_, row) => (
        <div className="management-company-cell">
          <Link to={`/projects/${row.id}`}>{row.name}</Link>
          <span>{row.company.name}</span>
        </div>
      ),
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      width: 82,
      render: (stage: LifecycleStage) => <Tag color={stageColor(stage)}>{stage}</Tag>,
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      width: 112,
      render: (status: ProjectStatus) => <Tag color={projectStatusColor(status)}>{status}</Tag>,
    },
    { title: '拟投金额', dataIndex: 'targetAmount', width: 110 },
    { title: '认缴', dataIndex: 'committedAmount', width: 100 },
    { title: '实缴', dataIndex: 'paidAmount', width: 100 },
    { title: '负责人', dataIndex: 'owner', width: 90 },
    {
      title: '流程进度',
      dataIndex: 'progress',
      width: 150,
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: '风险',
      dataIndex: 'risk',
      width: 78,
      render: (risk: RiskLevel) => <Tag color={riskColor(risk)}>{risk}</Tag>,
    },
    { title: '当前节点', width: 150, render: (_, row) => currentNode(row.status) },
    { title: '下一步动作', dataIndex: 'nextAction', width: 280 },
    { title: 'AI建议', dataIndex: 'aiAdvice', width: 320 },
    {
      title: '操作',
      width: 170,
      fixed: 'right',
      render: (_, row) => (
        <Space className="management-row-actions">
          <Link to={`/projects/${row.id}`}>详情</Link>
          <Button onClick={() => onAdvanceProject(row.id)} size="small" type="link">
            推进
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<InvestmentProject>
      columns={columns}
      dataSource={projects}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1960 }}
    />
  );
}

function CustomerTable({
  customers,
  projects,
  onReviewCustomer,
  onConnectCustomer,
}: {
  customers: CustomerRecord[];
  projects: InvestmentProject[];
  onReviewCustomer: (customerId: string) => void;
  onConnectCustomer: (customerId: string) => void;
}) {
  const columns: ColumnsType<CustomerRecord> = [
    { title: '客户名称', dataIndex: 'name', width: 220, fixed: 'left' },
    { title: '客户类型', dataIndex: 'kind', width: 110, render: (kind) => <Tag color="blue">{kind}</Tag> },
    { title: '联系人', dataIndex: 'contact', width: 100 },
    { title: '认证状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '待认证' ? 'orange' : 'blue'}>{status}</Tag> },
    { title: '投资偏好', dataIndex: 'preference', width: 180 },
    { title: '关联项目', width: 240, render: (_, row) => relatedProject(row.id, projects).name },
    { title: '所属阶段', width: 90, render: () => <Tag color={stageColor('募')}>募</Tag> },
    { title: '认缴', dataIndex: 'committed', width: 100 },
    { title: '实缴', dataIndex: 'paid', width: 100 },
    { title: '当前节点', width: 130, render: (_, row) => row.status === '待认证' ? '客户认证' : '募集跟进' },
    { title: '下一步动作', dataIndex: 'nextAction', width: 280 },
    {
      title: '操作',
      width: 170,
      fixed: 'right',
      render: (_, row) => (
        <Space className="management-row-actions">
          <Button onClick={() => onReviewCustomer(row.id)} size="small" type="link">
            回访
          </Button>
          <Button onClick={() => onConnectCustomer(row.id)} size="small" type="link">
            关联项目
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<CustomerRecord>
      columns={columns}
      dataSource={customers}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1820 }}
    />
  );
}

function RiskTable({
  risks,
  projects,
  onRiskAction,
}: {
  risks: RiskRecord[];
  projects: InvestmentProject[];
  onRiskAction: (risk: RiskRecord) => void;
}) {
  const columns: ColumnsType<RiskRecord> = [
    { title: '风险事项', dataIndex: 'object', width: 180, fixed: 'left' },
    { title: '关联项目', dataIndex: 'projectName', width: 240 },
    {
      title: '所属阶段',
      width: 90,
      render: (_, row) => {
        const stage = projectStage(row.projectName, projects);
        return <Tag color={stageColor(stage)}>{stage}</Tag>;
      },
    },
    { title: '风险等级', dataIndex: 'level', width: 100, render: (level: RiskLevel) => <Tag color={riskColor(level)}>{level}</Tag> },
    { title: '风险类型', dataIndex: 'type', width: 120 },
    { title: '风险来源', dataIndex: 'source', width: 160 },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '处置状态', dataIndex: 'status', width: 110, render: (status) => <Tag color={status === '已闭环' ? 'green' : 'orange'}>{status}</Tag> },
    { title: '处置动作', dataIndex: 'action', width: 320 },
    {
      title: '操作',
      width: 170,
      fixed: 'right',
      render: (_, row) => (
        <Space className="management-row-actions">
          {row.status === '已闭环' ? (
            <Tag>已完成</Tag>
          ) : (
            <Button onClick={() => onRiskAction(row)} size="small" type="link">
              {row.operation === 'assign' ? '指派' : '处理'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table<RiskRecord>
      columns={columns}
      dataSource={risks}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1580 }}
    />
  );
}

function DocumentTable({
  documents,
  onPreviewDocument,
  onArchiveDocument,
}: {
  documents: DocumentRecord[];
  onPreviewDocument: (document: DocumentRecord) => void;
  onArchiveDocument: (documentId: string) => void;
}) {
  const columns: ColumnsType<DocumentRecord> = [
    { title: '文档名称', dataIndex: 'name', width: 260, fixed: 'left' },
    { title: '关联项目', dataIndex: 'projectName', width: 240 },
    {
      title: '所属阶段',
      width: 90,
      render: (_, row) => {
        const stage = documentStage(row.type);
        return <Tag color={stageColor(stage)}>{stage}</Tag>;
      },
    },
    { title: '文档类型', dataIndex: 'type', width: 110 },
    { title: '归档状态', dataIndex: 'status', width: 110, render: (status) => <Tag color={status === '已归档' ? 'green' : 'orange'}>{status}</Tag> },
    { title: '审批状态', width: 110, render: (_, row) => approvalStatus(row.status) },
    { title: '责任人', dataIndex: 'owner', width: 90 },
    { title: '更新时间', dataIndex: 'updatedAt', width: 120 },
    { title: '影响节点', width: 180, render: (_, row) => documentNode(row.type) },
    {
      title: '操作',
      width: 170,
      fixed: 'right',
      render: (_, row) => (
        <Space className="management-row-actions">
          <Button onClick={() => onPreviewDocument(row)} size="small" type="link">
            预览
          </Button>
          <Button onClick={() => onArchiveDocument(row.id)} size="small" type="link">
            归档
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<DocumentRecord>
      columns={columns}
      dataSource={documents}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1480 }}
    />
  );
}

function tableHint(moduleKey: ManagementKey) {
  const hints: Record<ManagementKey, string> = {
    project: '用项目状态承载完整业务闭环，点击项目名称进入详情查看募投管退过程。',
    customer: '客户表格服务募集阶段，认缴、实缴和认证状态会影响项目推进。',
    risk: '风险表格服务投资和投后阶段，处置结果会回写项目状态和文档留痕。',
    document: '文档表格贯穿全流程，缺失文件会阻断对应业务节点。',
  };
  return hints[moduleKey];
}

function statusOptions(moduleKey: ManagementKey) {
  if (moduleKey === 'project') {
    return [
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
      '已终止',
    ].map((item) => ({ label: item, value: item }));
  }

  if (moduleKey === 'customer') {
    return ['已认证', '待认证', '回访中'].map((item) => ({ label: item, value: item }));
  }

  if (moduleKey === 'risk') {
    return ['待处置', '处置中', '已闭环'].map((item) => ({ label: item, value: item }));
  }

  return ['已归档', '审批中', '待补充', '待归档'].map((item) => ({ label: item, value: item }));
}

function relatedProject(customerId: string, projects: InvestmentProject[]) {
  const indexMap: Record<string, number> = {
    'customer-001': 0,
    'customer-002': 4,
    'customer-003': 2,
    'customer-004': 9,
    'customer-005': 11,
  };
  return projects[indexMap[customerId] ?? 0] ?? projects[0]!;
}

function projectStage(projectName: string, projects: InvestmentProject[]): LifecycleStage {
  return projects.find((item) => item.name === projectName)?.stage ?? '管';
}

function documentStage(type: DocumentRecord['type']): LifecycleStage {
  if (['立项文件'].includes(type)) return '募';
  if (['尽调报告', '估值材料', '投决文件', '合同文件'].includes(type)) return '投';
  if (['投后报告'].includes(type)) return '管';
  return '退';
}

function documentNode(type: DocumentRecord['type']) {
  const nodeMap: Record<DocumentRecord['type'], string> = {
    立项文件: '立项准入',
    尽调报告: '尽调完成',
    估值材料: '估值参考',
    投决文件: '投委会审批',
    合同文件: '合同签署',
    投后报告: '投后跟踪',
    退出复盘: '退出复盘',
  };
  return nodeMap[type];
}

function approvalStatus(status: DocumentRecord['status']) {
  if (status === '已归档') return <Tag color="green">已通过</Tag>;
  if (status === '审批中') return <Tag color="blue">审批中</Tag>;
  return <Tag color="orange">待处理</Tag>;
}

function currentNode(status: ProjectStatus) {
  const nodeMap: Record<ProjectStatus, string> = {
    草稿: '信息补全',
    待立项: '立项审批',
    募集中: '募集跟进',
    尽调中: '尽调报告',
    估值中: '估值参考',
    投决中: '投委会',
    合同中: '合同审核',
    交割中: '付款交割',
    投后管理: '投后跟踪',
    退出准备: '退出方案',
    退出中: '退出执行',
    已退出: '复盘归档',
    已终止: '终止归档',
  };
  return nodeMap[status];
}

function nextActionByStatus(status: ProjectStatus) {
  const actionMap: Record<ProjectStatus, string> = {
    草稿: '完善项目信息并提交立项审批',
    待立项: '提交立项审批并确认投资边界',
    募集中: '绑定投资人、出资人和投资机构，确认认缴实缴',
    尽调中: '上传尽调资料并运行尽调智能体',
    估值中: '补充财务预测并确认估值参考',
    投决中: '提交投委会材料并等待投决意见',
    合同中: '上传投资协议并运行合同智能体',
    交割中: '确认付款凭证和工商变更材料',
    投后管理: '上传经营财务报告并持续监控风险',
    退出准备: '编制退出计划和收益测算',
    退出中: '推进退出审批、交易执行和复盘归档',
    已退出: '完成退出复盘并沉淀案例',
    已终止: '完成终止归档',
  };
  return actionMap[status];
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
    草稿: 'default',
    待立项: 'default',
    募集中: 'gold',
    尽调中: 'geekblue',
    估值中: 'cyan',
    投决中: 'blue',
    合同中: 'purple',
    交割中: 'processing',
    投后管理: 'green',
    退出准备: 'volcano',
    退出中: 'magenta',
    已退出: 'success',
    已终止: 'red',
  };
  return colors[status];
}

function riskColor(level: RiskLevel) {
  const colors: Record<RiskLevel, string> = {
    高: 'red',
    中: 'orange',
    低: 'green',
  };
  return colors[level];
}
