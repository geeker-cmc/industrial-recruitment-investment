import {
  FileSearchOutlined,
  ProjectOutlined,
  UploadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Input, Progress, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  customerRecords,
  documentRecords,
  investmentProjects,
  riskRecords,
  type CustomerRecord,
  type DocumentRecord,
  type InvestmentProject,
  type LifecycleStage,
  type ProjectStatus,
  type RiskLevel,
  type RiskRecord,
} from '../../mock/investment';

type ManagementKey = 'project' | 'customer' | 'risk' | 'document';

type ManagementModule = {
  key: ManagementKey;
  navName: string;
  title: string;
  description: string;
  primaryAction: string;
  primaryIcon: ReactNode;
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

export default function BusinessManagementPage({
  moduleKey = 'project',
}: {
  moduleKey?: ManagementKey;
}) {
  const activeModule = modules[moduleKey] ?? modules.project;

  return (
    <main className="management-page">
      <section className="management-workspace">
        <header className="management-hero management-hero--compact">
          <div>
            <span className="management-eyebrow">股权投资业务管理系统</span>
            <h1>{activeModule.navName}</h1>
            <p>{activeModule.description}</p>
          </div>
          <Space>
            <Button icon={<FileSearchOutlined />}>高级筛选</Button>
            <Button icon={activeModule.primaryIcon} type="primary">
              {activeModule.primaryAction}
            </Button>
          </Space>
        </header>

        <TableModule module={activeModule} />
      </section>
    </main>
  );
}

function TableModule({ module }: { module: ManagementModule }) {
  return (
    <section className="management-table-card">
      <div className="management-table-card__header">
        <div>
          <h2>{module.title}</h2>
          <p>{tableHint(module.key)}</p>
        </div>
        <TableFilters moduleKey={module.key} />
      </div>
      {renderModuleTable(module.key)}
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

function renderModuleTable(moduleKey: ManagementKey) {
  switch (moduleKey) {
    case 'customer':
      return <CustomerTable />;
    case 'risk':
      return <RiskTable />;
    case 'document':
      return <DocumentTable />;
    case 'project':
    default:
      return <ProjectTable />;
  }
}

function ProjectTable() {
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
          <Button size="small" type="link">推进</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<InvestmentProject>
      columns={columns}
      dataSource={investmentProjects}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1960 }}
    />
  );
}

function CustomerTable() {
  const columns: ColumnsType<CustomerRecord> = [
    { title: '客户名称', dataIndex: 'name', width: 220, fixed: 'left' },
    { title: '客户类型', dataIndex: 'kind', width: 110, render: (kind) => <Tag color="blue">{kind}</Tag> },
    { title: '联系人', dataIndex: 'contact', width: 100 },
    { title: '认证状态', dataIndex: 'status', width: 100, render: (status) => <Tag color={status === '待认证' ? 'orange' : 'blue'}>{status}</Tag> },
    { title: '投资偏好', dataIndex: 'preference', width: 180 },
    { title: '关联项目', width: 240, render: (_, row) => relatedProject(row.id).name },
    { title: '所属阶段', width: 90, render: () => <Tag color={stageColor('募')}>募</Tag> },
    { title: '认缴', dataIndex: 'committed', width: 100 },
    { title: '实缴', dataIndex: 'paid', width: 100 },
    { title: '当前节点', width: 130, render: (_, row) => row.status === '待认证' ? '客户认证' : '募集跟进' },
    { title: '下一步动作', dataIndex: 'nextAction', width: 280 },
    {
      title: '操作',
      width: 170,
      fixed: 'right',
      render: () => (
        <Space className="management-row-actions">
          <Button size="small" type="link">回访</Button>
          <Button size="small" type="link">关联项目</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<CustomerRecord>
      columns={columns}
      dataSource={customerRecords}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1820 }}
    />
  );
}

function RiskTable() {
  const columns: ColumnsType<RiskRecord> = [
    { title: '风险事项', dataIndex: 'object', width: 180, fixed: 'left' },
    { title: '关联项目', dataIndex: 'projectName', width: 240 },
    {
      title: '所属阶段',
      width: 90,
      render: (_, row) => {
        const stage = projectStage(row.projectName);
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
      render: () => (
        <Space className="management-row-actions">
          <Button size="small" type="link">分派</Button>
          <Button size="small" type="link">闭环</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<RiskRecord>
      columns={columns}
      dataSource={riskRecords}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      rowKey="id"
      scroll={{ x: 1580 }}
    />
  );
}

function DocumentTable() {
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
      render: () => (
        <Space className="management-row-actions">
          <Button size="small" type="link">预览</Button>
          <Button size="small" type="link">归档</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<DocumentRecord>
      columns={columns}
      dataSource={documentRecords}
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

function relatedProject(customerId: string) {
  const indexMap: Record<string, number> = {
    'customer-001': 0,
    'customer-002': 4,
    'customer-003': 2,
    'customer-004': 9,
    'customer-005': 11,
  };
  return investmentProjects[indexMap[customerId] ?? 0] ?? investmentProjects[0]!;
}

function projectStage(projectName: string): LifecycleStage {
  return investmentProjects.find((item) => item.name === projectName)?.stage ?? '管';
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
