import { companies, type CompanyProfile } from './industry';

export type LifecycleStage = '募' | '投' | '管' | '退';

export type ProjectStatus =
  | '草稿'
  | '待立项'
  | '募集中'
  | '尽调中'
  | '估值中'
  | '投决中'
  | '合同中'
  | '交割中'
  | '投后管理'
  | '退出准备'
  | '退出中'
  | '已退出'
  | '已终止';

export type RiskLevel = '高' | '中' | '低';

export type CapitalParticipant = {
  id: string;
  name: string;
  role: '投资人' | '出资人' | '投资机构';
  committed: string;
  paid: string;
  paidRate: number;
  status: '已实缴' | '部分实缴' | '待实缴';
};

export type ProjectDocument = {
  id: string;
  name: string;
  type: '立项文件' | '尽调报告' | '估值材料' | '投决文件' | '合同文件' | '投后报告' | '退出复盘';
  owner: string;
  status: '已归档' | '审批中' | '待补充' | '待归档';
  updatedAt: string;
};

export type ProjectRisk = {
  id: string;
  title: string;
  level: RiskLevel;
  source: string;
  owner: string;
  status: '待处置' | '处置中' | '已闭环';
  action: string;
};

export type AgentOutput = {
  id: string;
  name: string;
  tool: '尽调报告' | '合同审核';
  projectName: string;
  status: '待解析' | '处理中' | '已完成' | '待确认' | '已回写' | '解析失败';
  result: string;
  riskCount: number;
  updatedAt: string;
};

export type InvestmentProject = {
  id: string;
  name: string;
  company: CompanyProfile;
  stage: LifecycleStage;
  status: ProjectStatus;
  capitalPlan: string;
  targetAmount: string;
  committedAmount: string;
  paidAmount: string;
  investorCount: number;
  owner: string;
  manager: string;
  startDate: string;
  expectedExit: string;
  progress: number;
  risk: RiskLevel;
  nextAction: string;
  aiAdvice: string;
  valuation: string;
  participants: CapitalParticipant[];
  risks: ProjectRisk[];
  documents: ProjectDocument[];
  agentOutputs: AgentOutput[];
};

export type CustomerRecord = {
  id: string;
  name: string;
  kind: '投资人' | '出资人' | '投资机构';
  contact: string;
  source: string;
  status: '已认证' | '待认证' | '回访中';
  preference: string;
  committed: string;
  paid: string;
  nextAction: string;
};

export type RiskRecord = {
  id: string;
  projectName: string;
  object: string;
  level: RiskLevel;
  type: string;
  source: string;
  owner: string;
  status: '待处置' | '处置中' | '已闭环';
  action: string;
};

export type DocumentRecord = {
  id: string;
  name: string;
  projectName: string;
  type: ProjectDocument['type'];
  owner: string;
  status: ProjectDocument['status'];
  updatedAt: string;
};

export type AgentTask = {
  id: string;
  projectName: string;
  tool: AgentOutput['tool'];
  input: string;
  status: AgentOutput['status'];
  score: number;
  finding: string;
  updatedAt: string;
};

const pickCompany = (index: number) => companies[index] ?? companies[0]!;

const participantPool: CapitalParticipant[] = [
  {
    id: 'capital-001',
    name: '厦门海峡投资有限公司',
    role: '投资机构',
    committed: '1,200万',
    paid: '800万',
    paidRate: 67,
    status: '部分实缴',
  },
  {
    id: 'capital-002',
    name: '中电科创投资合伙企业',
    role: '出资人',
    committed: '900万',
    paid: '900万',
    paidRate: 100,
    status: '已实缴',
  },
  {
    id: 'capital-003',
    name: '张小令',
    role: '投资人',
    committed: '300万',
    paid: '100万',
    paidRate: 33,
    status: '部分实缴',
  },
  {
    id: 'capital-004',
    name: '未来产业引导资金',
    role: '投资机构',
    committed: '600万',
    paid: '0万',
    paidRate: 0,
    status: '待实缴',
  },
];

const projectDocuments: ProjectDocument[] = [
  {
    id: 'doc-001',
    name: '电子信息项目立项申请.docx',
    type: '立项文件',
    owner: '张小令',
    status: '已归档',
    updatedAt: '2026-07-02',
  },
  {
    id: 'doc-002',
    name: '芯片服务项目尽调报告.pdf',
    type: '尽调报告',
    owner: '王敏',
    status: '审批中',
    updatedAt: '2026-07-06',
  },
  {
    id: 'doc-003',
    name: '可比公司估值测算.xlsx',
    type: '估值材料',
    owner: '陈璇',
    status: '待补充',
    updatedAt: '2026-07-07',
  },
  {
    id: 'doc-004',
    name: '投资协议条款清单.docx',
    type: '合同文件',
    owner: '赵然',
    status: '待归档',
    updatedAt: '2026-07-08',
  },
];

const projectRisks: ProjectRisk[] = [
  {
    id: 'project-risk-001',
    title: '核心客户收入集中度偏高',
    level: '中',
    source: 'AI尽调报告',
    owner: '王敏',
    status: '处置中',
    action: '补充前三大客户合同和回款证明',
  },
  {
    id: 'project-risk-002',
    title: '交割付款前置条件未完全明确',
    level: '高',
    source: '合同审核智能体',
    owner: '赵然',
    status: '待处置',
    action: '要求法务复核付款节点和违约责任',
  },
  {
    id: 'project-risk-003',
    title: '历史工商变更频次较高',
    level: '低',
    source: '第三方工商数据',
    owner: '周宁',
    status: '已闭环',
    action: '已确认变更均为正常增资和人员调整',
  },
];

const agentOutputs: AgentOutput[] = [
  {
    id: 'agent-output-001',
    name: '芯片服务项目尽调报告初稿',
    tool: '尽调报告',
    projectName: '芯愿景软件股权投资项目',
    status: '已完成',
    result: '形成商业、财务、法务、技术四类风险摘要，建议补充客户集中度材料。',
    riskCount: 5,
    updatedAt: '2026-07-07',
  },
  {
    id: 'agent-output-002',
    name: '投资协议合同审核结果',
    tool: '合同审核',
    projectName: '芯愿景软件股权投资项目',
    status: '待确认',
    result: '识别付款条件、回购触发和信息权三处待确认条款。',
    riskCount: 3,
    updatedAt: '2026-07-08',
  },
];

export const investmentProjects: InvestmentProject[] = [
  {
    id: 'project-001',
    name: '芯愿景软件股权投资项目',
    company: pickCompany(1),
    stage: '投',
    status: '尽调中',
    capitalPlan: '电子信息一期资金计划',
    targetAmount: '3,000万',
    committedAmount: '2,400万',
    paidAmount: '1,800万',
    investorCount: 4,
    owner: '张小令',
    manager: '王敏',
    startDate: '2026-06-18',
    expectedExit: '2029-12',
    progress: 68,
    risk: '中',
    nextAction: '补充三年审计报告并进入估值复核',
    aiAdvice: '产业图谱显示其位于关键补链节点，建议重点核验核心客户稳定性。',
    valuation: '投前估值 4.8 亿，参考区间 4.4-5.2 亿',
    participants: participantPool,
    risks: projectRisks,
    documents: projectDocuments,
    agentOutputs,
  },
  {
    id: 'project-002',
    name: '苏试试验智能制造扩产项目',
    company: pickCompany(2),
    stage: '管',
    status: '投后管理',
    capitalPlan: '智能制造专项资金计划',
    targetAmount: '5,000万',
    committedAmount: '5,000万',
    paidAmount: '5,000万',
    investorCount: 3,
    owner: '陈璇',
    manager: '李华',
    startDate: '2025-11-04',
    expectedExit: '2028-09',
    progress: 82,
    risk: '低',
    nextAction: '跟进二季度经营报告和订单回款',
    aiAdvice: '经营指标优于投后计划，建议同步准备追加投资论证。',
    valuation: '最近估值 8.6 亿，较投资时提升 18%',
    participants: participantPool.slice(0, 3),
    risks: projectRisks.slice(1),
    documents: projectDocuments.slice(1),
    agentOutputs: agentOutputs.slice(0, 1),
  },
  {
    id: 'project-003',
    name: '未来黑科技早期投资项目',
    company: pickCompany(4),
    stage: '募',
    status: '待立项',
    capitalPlan: '数字经济种子资金计划',
    targetAmount: '2,000万',
    committedAmount: '1,100万',
    paidAmount: '200万',
    investorCount: 2,
    owner: '李华',
    manager: '张小令',
    startDate: '2026-07-01',
    expectedExit: '2030-06',
    progress: 36,
    risk: '中',
    nextAction: '完成客户认证审核并发起项目立项',
    aiAdvice: '需先确认投资人适当性和认缴节奏，再进入尽调排期。',
    valuation: '待启动估值参考',
    participants: participantPool.slice(2),
    risks: projectRisks.slice(0, 1),
    documents: projectDocuments.slice(0, 1),
    agentOutputs: [],
  },
  {
    id: 'project-004',
    name: '高端装备并购退出项目',
    company: pickCompany(5),
    stage: '退',
    status: '退出中',
    capitalPlan: '高端装备并购资金计划',
    targetAmount: '4,200万',
    committedAmount: '4,200万',
    paidAmount: '4,200万',
    investorCount: 5,
    owner: '周宁',
    manager: '赵然',
    startDate: '2023-03-12',
    expectedExit: '2026-09',
    progress: 91,
    risk: '高',
    nextAction: '复核退出价格和回购触发条款',
    aiAdvice: '近期工商与舆情存在波动，退出方案需增加风险折价敏感性测算。',
    valuation: '退出估值 6.1 亿，需复核回购折价',
    participants: participantPool,
    risks: projectRisks.slice(0, 2),
    documents: projectDocuments,
    agentOutputs: agentOutputs.slice(1),
  },
  {
    id: 'project-005',
    name: '工业机器人产业协同项目',
    company: pickCompany(6),
    stage: '投',
    status: '投决中',
    capitalPlan: '智能制造专项资金计划',
    targetAmount: '4,800万',
    committedAmount: '4,200万',
    paidAmount: '2,600万',
    investorCount: 4,
    owner: '王敏',
    manager: '陈璇',
    startDate: '2026-05-22',
    expectedExit: '2029-10',
    progress: 74,
    risk: '中',
    nextAction: '提交投委会材料并确认投资额度',
    aiAdvice: '估值模型与可比公司偏差较小，建议补充核心技术专利清单。',
    valuation: '投前估值 7.2 亿',
    participants: participantPool.slice(0, 3),
    risks: projectRisks.slice(0, 1),
    documents: projectDocuments.slice(0, 3),
    agentOutputs: agentOutputs.slice(0, 1),
  },
  {
    id: 'project-006',
    name: '电子连接器产业链补链项目',
    company: pickCompany(0),
    stage: '投',
    status: '合同中',
    capitalPlan: '电子信息一期资金计划',
    targetAmount: '1,600万',
    committedAmount: '1,600万',
    paidAmount: '900万',
    investorCount: 3,
    owner: '赵然',
    manager: '周宁',
    startDate: '2026-04-18',
    expectedExit: '2029-03',
    progress: 58,
    risk: '低',
    nextAction: '完成投资协议条款审阅和用印申请',
    aiAdvice: '合同付款节点已与交割条件匹配，需确认反稀释条款口径。',
    valuation: '投前估值 3.5 亿',
    participants: participantPool.slice(0, 2),
    risks: projectRisks.slice(1, 2),
    documents: projectDocuments.slice(1),
    agentOutputs: agentOutputs.slice(1),
  },
  {
    id: 'project-007',
    name: '云丹网络退出复盘项目',
    company: pickCompany(7),
    stage: '退',
    status: '已退出',
    capitalPlan: '数字经济成长期资金计划',
    targetAmount: '2,800万',
    committedAmount: '2,800万',
    paidAmount: '2,800万',
    investorCount: 4,
    owner: '周宁',
    manager: '李华',
    startDate: '2022-05-12',
    expectedExit: '2026-04',
    progress: 100,
    risk: '低',
    nextAction: '归档退出复盘报告并回写收益统计',
    aiAdvice: '退出收益率高于组合均值，可沉淀为同类项目退出案例。',
    valuation: '退出收益 4,900 万，IRR 18.6%',
    participants: participantPool.slice(0, 3),
    risks: projectRisks.slice(2),
    documents: projectDocuments,
    agentOutputs: [],
  },
  {
    id: 'project-008',
    name: '半导体材料交割项目',
    company: pickCompany(8),
    stage: '投',
    status: '交割中',
    capitalPlan: '半导体专项资金计划',
    targetAmount: '3,600万',
    committedAmount: '3,600万',
    paidAmount: '2,100万',
    investorCount: 3,
    owner: '陈璇',
    manager: '赵然',
    startDate: '2026-05-08',
    expectedExit: '2029-08',
    progress: 76,
    risk: '中',
    nextAction: '完成首期付款凭证和工商变更确认',
    aiAdvice: '交割材料缺少股东会决议扫描件，已生成补件任务。',
    valuation: '投前估值 5.6 亿',
    participants: participantPool.slice(1),
    risks: projectRisks.slice(1),
    documents: projectDocuments.slice(0, 3),
    agentOutputs,
  },
  {
    id: 'project-009',
    name: '算力设备估值参考项目',
    company: pickCompany(9),
    stage: '投',
    status: '估值中',
    capitalPlan: '数字经济成长期资金计划',
    targetAmount: '2,400万',
    committedAmount: '1,900万',
    paidAmount: '800万',
    investorCount: 2,
    owner: '王敏',
    manager: '张小令',
    startDate: '2026-06-02',
    expectedExit: '2029-11',
    progress: 49,
    risk: '中',
    nextAction: '复核可比公司样本和收入预测假设',
    aiAdvice: 'AI估值参考提示收入增速假设偏乐观，建议增加保守情景。',
    valuation: '参考区间 2.8-3.4 亿',
    participants: participantPool.slice(0, 2),
    risks: projectRisks.slice(0, 1),
    documents: projectDocuments.slice(1, 3),
    agentOutputs: agentOutputs.slice(0, 1),
  },
  {
    id: 'project-010',
    name: '应用软件储备项目',
    company: pickCompany(10),
    stage: '募',
    status: '募集中',
    capitalPlan: '软件服务专项资金计划',
    targetAmount: '1,800万',
    committedAmount: '900万',
    paidAmount: '200万',
    investorCount: 2,
    owner: '李华',
    manager: '王敏',
    startDate: '2026-07-04',
    expectedExit: '2030-03',
    progress: 28,
    risk: '低',
    nextAction: '补充投资机构适当性材料',
    aiAdvice: '建议先锁定主出资人，降低后续投决资金不确定性。',
    valuation: '待估值',
    participants: participantPool.slice(2),
    risks: [],
    documents: projectDocuments.slice(0, 1),
    agentOutputs: [],
  },
  {
    id: 'project-011',
    name: '智能终端退出准备项目',
    company: pickCompany(11),
    stage: '退',
    status: '退出准备',
    capitalPlan: '智能终端产业资金计划',
    targetAmount: '3,300万',
    committedAmount: '3,300万',
    paidAmount: '3,300万',
    investorCount: 5,
    owner: '周宁',
    manager: '陈璇',
    startDate: '2024-01-15',
    expectedExit: '2026-12',
    progress: 84,
    risk: '中',
    nextAction: '提交退出审批并测算三种收益情景',
    aiAdvice: '退出窗口较好，但需关注下游客户回款周期拉长。',
    valuation: '预计退出估值 7.9 亿',
    participants: participantPool,
    risks: projectRisks.slice(0, 1),
    documents: projectDocuments.slice(2),
    agentOutputs: [],
  },
  {
    id: 'project-012',
    name: '光子器件项目草稿',
    company: pickCompany(12),
    stage: '募',
    status: '草稿',
    capitalPlan: '光子产业储备资金计划',
    targetAmount: '1,200万',
    committedAmount: '0万',
    paidAmount: '0万',
    investorCount: 0,
    owner: '赵然',
    manager: '赵然',
    startDate: '2026-07-08',
    expectedExit: '2030-12',
    progress: 12,
    risk: '低',
    nextAction: '完善项目来源、拟投金额和主出资人信息',
    aiAdvice: '资料不足，建议先上传商业计划书和访谈纪要。',
    valuation: '待估值',
    participants: [],
    risks: [],
    documents: [],
    agentOutputs: [],
  },
];

export const customerRecords: CustomerRecord[] = [
  {
    id: 'customer-001',
    name: '厦门海峡投资有限公司',
    kind: '投资机构',
    contact: '李中华',
    source: '客户拜访',
    status: '已认证',
    preference: '电子信息、高端装备',
    committed: '1,200万',
    paid: '800万',
    nextAction: '确认本期实缴付款安排',
  },
  {
    id: 'customer-002',
    name: '中电科创投资合伙企业',
    kind: '出资人',
    contact: '何华',
    source: '内部建档',
    status: '已认证',
    preference: '智能制造、半导体',
    committed: '900万',
    paid: '900万',
    nextAction: '更新授权代表信息',
  },
  {
    id: 'customer-003',
    name: '未来产业引导资金',
    kind: '投资机构',
    contact: '王璐',
    source: '渠道推荐',
    status: '待认证',
    preference: '早期科技项目',
    committed: '600万',
    paid: '0万',
    nextAction: '完成机构资质审核',
  },
  {
    id: 'customer-004',
    name: '张小令',
    kind: '投资人',
    contact: '本人',
    source: '投资人推荐',
    status: '回访中',
    preference: '软件服务、数字经济',
    committed: '300万',
    paid: '100万',
    nextAction: '确认适当性问卷和风险等级',
  },
  {
    id: 'customer-005',
    name: '海淀科创母体投资平台',
    kind: '投资机构',
    contact: '刘宁',
    source: '路演活动',
    status: '已认证',
    preference: '电子信息、光子器件',
    committed: '2,000万',
    paid: '1,200万',
    nextAction: '安排项目联合评审',
  },
];

export const riskRecords: RiskRecord[] = [
  {
    id: 'risk-001',
    projectName: '高端装备并购退出项目',
    object: '退出价格',
    level: '高',
    type: '退出交易',
    source: '退出测算模型',
    owner: '周宁',
    status: '处置中',
    action: '复核回购触发条款并补充敏感性测算',
  },
  {
    id: 'risk-002',
    projectName: '芯愿景软件股权投资项目',
    object: '核心客户集中度',
    level: '中',
    type: '尽调风险',
    source: 'AI尽调报告',
    owner: '王敏',
    status: '待处置',
    action: '补充客户合同、回款和替代客户清单',
  },
  {
    id: 'risk-003',
    projectName: '电子连接器产业链补链项目',
    object: '付款前置条件',
    level: '中',
    type: '合同条款',
    source: '合同审核智能体',
    owner: '赵然',
    status: '待处置',
    action: '法务复核付款条件与违约责任',
  },
  {
    id: 'risk-004',
    projectName: '苏试试验智能制造扩产项目',
    object: '经营回款',
    level: '低',
    type: '投后经营',
    source: '季度经营报告',
    owner: '李华',
    status: '已闭环',
    action: '已确认订单回款符合投后计划',
  },
];

export const documentRecords: DocumentRecord[] = [
  ...projectDocuments.map((item) => ({
    id: item.id,
    name: item.name,
    projectName: '芯愿景软件股权投资项目',
    type: item.type,
    owner: item.owner,
    status: item.status,
    updatedAt: item.updatedAt,
  })),
  {
    id: 'doc-005',
    name: '退出收益复盘报告.pptx',
    projectName: '云丹网络退出复盘项目',
    type: '退出复盘',
    owner: '周宁',
    status: '待归档',
    updatedAt: '2026-07-08',
  },
  {
    id: 'doc-006',
    name: '二季度经营报告.pdf',
    projectName: '苏试试验智能制造扩产项目',
    type: '投后报告',
    owner: '李华',
    status: '审批中',
    updatedAt: '2026-07-06',
  },
];

export const agentTasks: AgentTask[] = [
  {
    id: 'agent-001',
    projectName: '芯愿景软件股权投资项目',
    tool: '尽调报告',
    input: '商业计划书、财报、工商、专利和访谈纪要',
    status: '已完成',
    score: 86,
    finding: '识别 5 项风险，已生成尽调报告初稿。',
    updatedAt: '2026-07-07',
  },
  {
    id: 'agent-002',
    projectName: '电子连接器产业链补链项目',
    tool: '合同审核',
    input: '投资协议、补充协议、付款计划',
    status: '待确认',
    score: 78,
    finding: '发现 3 条需法务确认条款。',
    updatedAt: '2026-07-08',
  },
  {
    id: 'agent-003',
    projectName: '算力设备估值参考项目',
    tool: '尽调报告',
    input: '财报、客户清单、技术说明',
    status: '处理中',
    score: 42,
    finding: '正在提取财务指标和核心客户集中度。',
    updatedAt: '2026-07-08',
  },
  {
    id: 'agent-004',
    projectName: '半导体材料交割项目',
    tool: '合同审核',
    input: '投资协议、股东会决议、工商变更材料',
    status: '处理中',
    score: 55,
    finding: '正在比对交割条件和补件清单。',
    updatedAt: '2026-07-08',
  },
];
