export type ReportFactoryView = 'conversation' | 'skills';

export type ReportFactoryAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
};

export type ReportFactoryMessageRole = 'user' | 'assistant';

export type ReportFactoryMessageBlock = {
  title: string;
  items: string[];
};

export type ReportFactoryMessage = {
  id: string;
  role: ReportFactoryMessageRole;
  content: string;
  createdAt: string;
  attachments?: ReportFactoryAttachment[];
  blocks?: ReportFactoryMessageBlock[];
};

export type ReportFactoryConversation = {
  id: string;
  title: string;
  summary: string;
  skillId: string;
  messages: ReportFactoryMessage[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
};

export type ReportFactorySkill = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  inputTypes: string[];
  outputFormats: string[];
  contextTypes: string[];
  enabled: boolean;
  builtin: boolean;
  accent: string;
};

export const reportFactorySkills: ReportFactorySkill[] = [
  {
    id: 'due-diligence',
    name: '尽调 Skill',
    description: '梳理企业资料，提炼经营、财务、法务、技术和人才风险。',
    prompt: '你是一名投资尽调分析师，请基于用户提供的资料给出结构化、可核验的尽调分析。',
    inputTypes: ['企业名称', '项目名称', '上传资料', '自然语言问题'],
    outputFormats: ['尽调摘要', '风险清单', '补充资料清单'],
    contextTypes: ['企业画像', '产业洞察', '用户上传资料'],
    enabled: true,
    builtin: true,
    accent: '#1677ff',
  },
  {
    id: 'contract-review',
    name: '合同审核 Skill',
    description: '识别投资协议中的法律法规、格式条款和高风险约定。',
    prompt: '你是一名投资协议审核顾问，请逐条梳理合同风险并给出清晰的审阅意见。',
    inputTypes: ['合同名称', '上传合同', '自然语言问题'],
    outputFormats: ['条款摘要', '风险条款', '审核建议'],
    contextTypes: ['用户上传合同', '历史协议样本', '用户输入'],
    enabled: true,
    builtin: true,
    accent: '#9254de',
  },
  {
    id: 'post-investment',
    name: '投后服务 Skill',
    description: '围绕企业经营指标、融资进展和管理事项提供投后分析。',
    prompt: '你是一名投后管理顾问，请从经营、融资、治理和服务事项分析企业下一步动作。',
    inputTypes: ['企业名称', '经营数据', '用户问题'],
    outputFormats: ['经营摘要', '监测重点', '服务建议'],
    contextTypes: ['企业画像', '产业数据', '用户输入'],
    enabled: true,
    builtin: true,
    accent: '#13c2c2',
  },
  {
    id: 'fund-project-fit',
    name: '基金项目适配 Skill',
    description: '分析项目与基金方向、投资阶段和资金计划的匹配程度。',
    prompt: '你是一名基金项目匹配顾问，请结合项目特征判断资金计划适配度。',
    inputTypes: ['项目名称', '产业方向', '拟投金额', '用户问题'],
    outputFormats: ['适配结论', '匹配依据', '待确认问题'],
    contextTypes: ['项目管理', '产业洞察', '用户输入'],
    enabled: true,
    builtin: true,
    accent: '#fa8c16',
  },
  {
    id: 'asset-allocation',
    name: '资产配置 Skill',
    description: '基于产业方向和风险偏好给出资产配置分析框架。',
    prompt: '你是一名资产配置顾问，请给出有边界、有假设的配置分析，不替代正式投资决策。',
    inputTypes: ['资产方向', '风险偏好', '配置目标', '用户问题'],
    outputFormats: ['配置摘要', '风险提示', '分析框架'],
    contextTypes: ['产业数据', '投资风格', '用户输入'],
    enabled: true,
    builtin: true,
    accent: '#52c41a',
  },
  {
    id: '招商会谈',
    name: '招商会谈 Skill',
    description: '为企业拜访和招商会谈准备提纲、问题清单和沟通策略。',
    prompt: '你是一名产业招商顾问，请围绕企业诉求、区域资源和合作机会设计会谈方案。',
    inputTypes: ['企业名称', '区域信息', '会谈目标', '用户问题'],
    outputFormats: ['会谈提纲', '问题清单', '跟进建议'],
    contextTypes: ['企业画像', '产业洞察', '区域数据'],
    enabled: true,
    builtin: true,
    accent: '#eb2f96',
  },
  {
    id: 'industry-data',
    name: '产业数据 Skill',
    description: '分析产业链、区域产业基础和重点技术方向。',
    prompt: '你是一名产业研究员，请从全国趋势、区域基础和关键技术三个层面分析产业。',
    inputTypes: ['产业名称', '区域名称', '用户问题'],
    outputFormats: ['产业摘要', '关键数据', '研究结论'],
    contextTypes: ['产业洞察', '产业链图谱', '区域数据'],
    enabled: true,
    builtin: true,
    accent: '#2f54eb',
  },
  {
    id: 'enterprise-settlement',
    name: '企业落户 Skill',
    description: '匹配企业落户条件、区域承载能力和招商支持事项。',
    prompt: '你是一名企业落户顾问，请结合企业需求和区域条件整理落户建议。',
    inputTypes: ['企业名称', '区域名称', '企业诉求', '用户问题'],
    outputFormats: ['落户条件', '资源匹配', '办理清单'],
    contextTypes: ['企业画像', '区域数据', '产业洞察'],
    enabled: true,
    builtin: true,
    accent: '#08979c',
  },
  {
    id: 'enterprise-radar',
    name: '企业雷达 Skill',
    description: '从产业链、区域、成长性和投资风格中发现候选企业。',
    prompt: '你是一名企业发现顾问，请根据用户给出的产业和筛选条件，整理候选企业观察方向。',
    inputTypes: ['产业名称', '区域名称', '筛选条件', '用户问题'],
    outputFormats: ['候选摘要', '匹配依据', '关注问题'],
    contextTypes: ['企业库', '产业洞察', '投资风格'],
    enabled: true,
    builtin: true,
    accent: '#722ed1',
  },
];

export const reportFactoryInitialConversations: ReportFactoryConversation[] = [
  {
    id: 'conversation-001',
    title: '电子信息产业链分析',
    summary: '请分析南通电子信息产业链的关键补链方向。',
    skillId: 'industry-data',
    status: 'active',
    createdAt: '2026-07-10T09:20:00+08:00',
    updatedAt: '2026-07-10T09:26:00+08:00',
    messages: [
      {
        id: 'message-001',
        role: 'user',
        content: '请分析南通电子信息产业链的关键补链方向。',
        createdAt: '2026-07-10T09:20:00+08:00',
      },
      {
        id: 'message-002',
        role: 'assistant',
        content: '已从产业基础、链上环节和技术方向三个层面整理分析框架。',
        createdAt: '2026-07-10T09:26:00+08:00',
        blocks: [
          { title: '分析摘要', items: ['重点关注电子元器件、设备与仪器和通信设备等补链方向。'] },
          { title: '下一步问题', items: ['是否需要继续筛选南通本地的目标企业？'] },
        ],
      },
    ],
  },
  {
    id: 'conversation-002',
    title: '芯愿景软件尽调初筛',
    summary: '梳理芯愿景软件的尽调关注事项。',
    skillId: 'due-diligence',
    status: 'active',
    createdAt: '2026-07-09T14:10:00+08:00',
    updatedAt: '2026-07-09T14:28:00+08:00',
    messages: [
      {
        id: 'message-003',
        role: 'user',
        content: '梳理芯愿景软件的尽调关注事项。',
        createdAt: '2026-07-09T14:10:00+08:00',
      },
      {
        id: 'message-004',
        role: 'assistant',
        content: '建议重点核验客户集中度、回款周期和核心团队稳定性。',
        createdAt: '2026-07-09T14:28:00+08:00',
        blocks: [
          { title: '重点关注', items: ['补充前三大客户合同和回款证明。', '核验核心专利权属及技术团队稳定性。'] },
        ],
      },
    ],
  },
];

const skillTopicMap: Record<string, { summary: string; focus: string; next: string }> = {
  'due-diligence': {
    summary: '已围绕企业资料完成初步结构化梳理。',
    focus: '建议关注经营真实性、财务质量、核心技术权属和团队稳定性。',
    next: '可以继续上传审计报告、客户合同或访谈纪要进行补充分析。',
  },
  'contract-review': {
    summary: '已识别合同主体、付款条件和重点保护条款。',
    focus: '建议重点复核回购触发、信息权、交割条件和违约责任。',
    next: '可以继续上传补充协议或指定具体条款进行逐条审阅。',
  },
  'post-investment': {
    summary: '已从经营表现、融资进度和治理事项整理投后观察框架。',
    focus: '建议关注收入增长、现金流、重大事项和融资计划变化。',
    next: '可以补充最新经营数据，继续生成本期投后观察摘要。',
  },
  'fund-project-fit': {
    summary: '已根据项目方向、阶段和资金用途形成初步适配判断。',
    focus: '建议核对基金投资边界、项目成熟度和资金计划节奏。',
    next: '可以补充拟投金额、投资期限和项目阶段进行更细化匹配。',
  },
  'asset-allocation': {
    summary: '已建立基于产业方向和风险偏好的配置分析框架。',
    focus: '建议平衡产业集中度、流动性需求和潜在风险敞口。',
    next: '可以补充配置目标和风险偏好，继续完善分析假设。',
  },
  招商会谈: {
    summary: '已围绕企业诉求和区域资源整理会谈准备框架。',
    focus: '建议优先确认企业落地诉求、合作边界和决策人关注点。',
    next: '可以补充会谈对象和时间安排，继续生成问题清单。',
  },
  'industry-data': {
    summary: '已从产业趋势、区域基础和关键技术三个层面整理分析。',
    focus: '建议重点核验产业链缺口、技术成熟度和区域承载能力。',
    next: '可以指定城市或产业链节点，继续细化分析范围。',
  },
  'enterprise-settlement': {
    summary: '已整理企业需求与区域承载条件的初步匹配结果。',
    focus: '建议确认空间载体、政策支持、人才配套和落户时间表。',
    next: '可以补充企业投资规模和人员计划，继续生成办理清单。',
  },
  'enterprise-radar': {
    summary: '已根据产业链、区域和成长性建立候选企业观察方向。',
    focus: '建议优先核验企业主营业务、产业链位置和融资阶段。',
    next: '可以补充区域、规模或技术标签，继续收敛候选范围。',
  },
};

export function buildReportFactoryReply(
  skill: ReportFactorySkill,
  input: string,
  attachments: ReportFactoryAttachment[],
): Omit<ReportFactoryMessage, 'id' | 'createdAt' | 'role'> {
  const topic = skillTopicMap[skill.id] ?? {
    summary: '已根据当前技能完成初步分析。',
    focus: '建议结合更多业务背景和原始资料核验分析结论。',
    next: '可以继续补充问题或资料，我会在当前对话中继续分析。',
  };
  const attachmentHint = attachments.length ? `本次已带入 ${attachments.length} 个文件上下文。` : '本次基于用户输入进行分析。';

  return {
    content: `${topic.summary}${attachmentHint}`,
    blocks: [
      { title: '用户问题', items: [input.trim()] },
      { title: '关注重点', items: [topic.focus] },
      { title: '下一步建议', items: [topic.next] },
    ],
  };
}
