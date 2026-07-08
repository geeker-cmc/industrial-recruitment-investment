import {
  AuditOutlined,
  CloudUploadOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  agentTasks,
  investmentProjects,
  type AgentTask,
} from '../../mock/investment';

type AgentMenuKey = 'due-diligence' | 'contract';

type AgentTaskFormValues = {
  projectName: string;
  input: string;
};

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
  const [activeKey, setActiveKey] = useState<AgentMenuKey>('due-diligence');
  const [tasks, setTasks] = useState<AgentTask[]>(agentTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<AgentTask | null>(null);
  const [form] = Form.useForm<AgentTaskFormValues>();

  const activeAgent = agentMenus.find((item) => item.key === activeKey) ?? agentMenus[0]!;
  const tableRows = useMemo(
    () => tasks.filter((item) => item.tool === activeAgent.tool),
    [activeAgent.tool, tasks],
  );

  const createTask = (values: AgentTaskFormValues) => {
    const task: AgentTask = {
      id: `agent-${Date.now()}`,
      projectName: values.projectName,
      tool: activeAgent.tool,
      input: values.input,
      status: '待解析',
      score: 0,
      finding: '资料已提交，等待智能体解析。',
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
          <Button icon={<RobotOutlined />} onClick={() => setModalOpen(true)} type="primary">
            新建解析任务
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
        title={`新建${activeAgent.title}任务`}
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
            label={activeKey === 'due-diligence' ? '提交资料' : '合同文件'}
            name="input"
            rules={[{ required: true, message: '请输入资料说明' }]}
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
          <AgentResultContent task={activeResult} />
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

function AgentResultContent({ task }: { task: AgentTask }) {
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
    </div>
  );
}

function agentStatusColor(status: AgentTask['status']) {
  if (status === '已完成' || status === '已回写') return 'green';
  if (status === '解析失败') return 'red';
  if (status === '处理中' || status === '待确认') return 'blue';
  return 'orange';
}
