import { treeToGraphData } from '@antv/g6';
import type { GraphData, TreeData } from '@antv/g6';

export type CompanyScore = {
  label: string;
  grade: string;
  ranking: string;
};

export type CompanyProfile = {
  id: string;
  name: string;
  shortName: string;
  logoText: string;
  status: string;
  stock?: string;
  tags: string[];
  riskSummary: string;
  legalPerson: string;
  establishedDate: string;
  registeredCapital: string;
  contact: string;
  address: string;
  creditCode: string;
  companyType: string;
  website: string;
  email: string;
  postcode: string;
  industries: string[];
  nationalIndustry: string;
  businessScope: string;
  mainBusiness: string[];
  scores: CompanyScore[];
  summaryScores: {
    comprehensive: string;
    innovation: string;
    business: string;
    reach: string;
  };
};

export type ChainNodeStatus = 'strong' | 'middle' | 'weak' | 'empty';
export type ChainSuggestion = '补链建议环节' | '强链建议环节' | 'none';

export type IndustryGraphNode = {
  id: string;
  label: string;
  x?: number;
  y?: number;
  companyIds: string[];
};

export type IndustryMindMapNode = TreeData & {
  label: string;
  companyIds: string[];
  children?: IndustryMindMapNode[];
};

export type StrengthGraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  status: ChainNodeStatus;
  suggestion: ChainSuggestion;
};

export type IndustryDetail = {
  id: string;
  name: string;
  definition: string;
  scope: string;
  coreLinks: string[];
  upstream: string[];
  midstream: string[];
  downstream: string[];
  policyItems: string[];
  newsItems: string[];
  graphTree: IndustryMindMapNode;
  graphNodes: IndustryGraphNode[];
  graphEdges: Array<{ source: string; target: string }>;
  strengthNodes: StrengthGraphNode[];
  strengthEdges: Array<{ source: string; target: string }>;
  trend: {
    enterpriseCount: number[];
    revenue: number[];
    financing: Array<{ round: string; value: number; color: string }>;
  };
};

export const companies: CompanyProfile[] = [
  {
    id: 'tianjie',
    name: '浙江天杰实业股份有限公司',
    shortName: '天杰实业',
    logoText: 'TJ',
    status: '存续',
    stock: '天杰实业 836767.QS（摘牌）',
    tags: [
      '高新技术企业认定',
      '专精特新',
      '科技型中小企业评价',
      '企业技术中心',
      '智能制造',
    ],
    riskSummary: '最近半年重大风险线索 0 条',
    legalPerson: '陈晓霖',
    establishedDate: '1999-03-31',
    registeredCapital: '5,000.00 万人民币',
    contact: '23656016',
    address: '浙江省杭州市临安区玲珑街道吴越街2588号（玲珑工业园）',
    creditCode: '91330100704313080Y',
    companyType: '股份有限公司',
    website: 'http://www.tian-jie.com',
    email: 'LXX@TIANJIE.COM',
    postcode: '311300',
    industries: ['船舶制造产业链', '光纤通信产业链', '光子产业链', '通信产业链', '5G产业链'],
    nationalIndustry: '制造业 > 电气机械和器材制造业 > 电线、电缆、光缆及电工器材制造',
    businessScope:
      '生产：塑钢型材、同轴电缆、塑钢门窗及配件、连接线、同轴电缆配件、电线、电缆、光纤光缆及配件、木盘；货物进出口。',
    mainBusiness: ['电线电缆', '线缆组件', '光纤光缆', '消费电子连接线'],
    scores: [
      { label: '规模', grade: 'B', ranking: '行业 前3% / 地区 前2%' },
      { label: '稳定', grade: 'A', ranking: '行业 前6% / 地区 前3%' },
      { label: '成长', grade: 'C', ranking: '行业 前2% / 地区 前19%' },
      { label: '创新', grade: 'B', ranking: '行业 前1% / 地区 前1%' },
      { label: '财务', grade: 'A', ranking: '行业 前2% / 地区 前2%' },
      { label: '履约', grade: 'A', ranking: '行业 前1% / 地区 前1%' },
    ],
    summaryScores: {
      comprehensive: 'A 卓越 / 470分',
      innovation: 'S 卓越 / 457分',
      business: '近半年 4 项商机',
      reach: '履约信用 A TOP2%',
    },
  },
  {
    id: 'xinrui-software',
    name: '北京芯愿景软件技术股份有限公司',
    shortName: '芯愿景软件',
    logoText: '芯',
    status: '存续',
    tags: ['专精特新', '集成电路服务', '企业技术中心', '研发能力突出'],
    riskSummary: '最近半年重大风险线索 1 条',
    legalPerson: '王研',
    establishedDate: '2002-08-16',
    registeredCapital: '6,128.40 万人民币',
    contact: '010-88990012',
    address: '北京市海淀区中关村集成电路设计园',
    creditCode: '91110108742390001X',
    companyType: '股份有限公司',
    website: 'https://www.ic-service.cn',
    email: 'info@ic-service.cn',
    postcode: '100192',
    industries: ['电子信息产业链', '集成电路产业链', '软件服务产业链'],
    nationalIndustry: '信息传输、软件和信息技术服务业 > 软件和信息技术服务业',
    businessScope:
      '集成电路分析服务、芯片设计技术服务、电子信息技术开发、技术咨询、软件开发及销售。',
    mainBusiness: ['芯片分析服务', 'EDA辅助工具', '知识产权分析', '设计验证服务'],
    scores: [
      { label: '规模', grade: 'B', ranking: '行业 前8% / 地区 前6%' },
      { label: '稳定', grade: 'A', ranking: '行业 前5% / 地区 前4%' },
      { label: '成长', grade: 'A', ranking: '行业 前7% / 地区 前5%' },
      { label: '创新', grade: 'S', ranking: '行业 前1% / 地区 前1%' },
      { label: '财务', grade: 'B', ranking: '行业 前12% / 地区 前8%' },
      { label: '履约', grade: 'A', ranking: '行业 前4% / 地区 前3%' },
    ],
    summaryScores: {
      comprehensive: 'A 优秀 / 455分',
      innovation: 'S 卓越 / 482分',
      business: '近半年 3 项商机',
      reach: '触达价值 A TOP5%',
    },
  },
  {
    id: 'suzhou-sushi',
    name: '苏州苏试试验集团股份有限公司',
    shortName: '苏试试验',
    logoText: '苏',
    status: '存续',
    tags: ['上市企业', '高新技术企业', '检测服务', '智能制造'],
    riskSummary: '最近半年重大风险线索 0 条',
    legalPerson: '钟琼华',
    establishedDate: '2007-12-29',
    registeredCapital: '50,775.80 万人民币',
    contact: '0512-66650000',
    address: '江苏省苏州市工业园区中新大道西',
    creditCode: '91320594670129220U',
    companyType: '股份有限公司',
    website: 'https://www.chinasti.com',
    email: 'ir@chinasti.com',
    postcode: '215000',
    industries: ['电子信息产业链', '高端装备产业链', '检测认证产业链'],
    nationalIndustry: '科学研究和技术服务业 > 专业技术服务业',
    businessScope:
      '环境与可靠性试验设备研发制造，集成电路、电子元器件、航空航天装备检测服务。',
    mainBusiness: ['环境试验设备', '可靠性检测', '集成电路验证', '军工装备测试'],
    scores: [
      { label: '规模', grade: 'A', ranking: '行业 前2% / 地区 前2%' },
      { label: '稳定', grade: 'A', ranking: '行业 前4% / 地区 前4%' },
      { label: '成长', grade: 'B', ranking: '行业 前10% / 地区 前9%' },
      { label: '创新', grade: 'A', ranking: '行业 前3% / 地区 前2%' },
      { label: '财务', grade: 'A', ranking: '行业 前5% / 地区 前4%' },
      { label: '履约', grade: 'A', ranking: '行业 前2% / 地区 前2%' },
    ],
    summaryScores: {
      comprehensive: 'A 优秀 / 466分',
      innovation: 'A 优秀 / 451分',
      business: '近半年 6 项商机',
      reach: '客户触达 A TOP3%',
    },
  },
];

const electronicNodes: IndustryGraphNode[] = [
  { id: 'electronic-information-root', label: '电子信息产业链', x: 80, y: 290, companyIds: [] },
  { id: 'materials-design', label: '原材料、设计、加工', x: 260, y: 120, companyIds: [] },
  { id: 'equipment-components', label: '电子元件、设备零部件', x: 260, y: 280, companyIds: [] },
  { id: 'instrument-terminal', label: '电子设备、仪器', x: 260, y: 420, companyIds: [] },
  { id: 'sales-application', label: '销售渠道、应用服务', x: 260, y: 590, companyIds: [] },
  { id: 'production-equipment', label: '生产设备', x: 450, y: 70, companyIds: [] },
  { id: 'raw-materials', label: '原材料', x: 450, y: 135, companyIds: [] },
  { id: 'chip-manufacturing', label: '芯片制造服务', x: 650, y: 170, companyIds: ['xinrui-software', 'suzhou-sushi'] },
  { id: 'chip-analysis', label: '芯片分析服务', x: 835, y: 195, companyIds: ['xinrui-software', 'suzhou-sushi'] },
  { id: 'semiconductor-materials', label: '半导体材料', x: 450, y: 250, companyIds: [] },
  { id: 'electronic-components', label: '电子元件', x: 450, y: 315, companyIds: ['tianjie'] },
  { id: 'application-devices', label: '应用电子仪器及设备', x: 450, y: 420, companyIds: [] },
  { id: 'electronic-devices', label: '电子设备', x: 450, y: 485, companyIds: ['tianjie', 'suzhou-sushi'] },
  { id: 'technical-service', label: '电子设备技术服务', x: 450, y: 565, companyIds: ['xinrui-software'] },
  { id: 'trade-service', label: '通信设备贸易', x: 450, y: 635, companyIds: ['tianjie'] },
  { id: 'product-trade', label: '电子产品贸易', x: 450, y: 705, companyIds: ['tianjie'] },
];

const electronicEdges = [
  ['electronic-information-root', 'materials-design'],
  ['electronic-information-root', 'equipment-components'],
  ['electronic-information-root', 'instrument-terminal'],
  ['electronic-information-root', 'sales-application'],
  ['materials-design', 'production-equipment'],
  ['materials-design', 'raw-materials'],
  ['raw-materials', 'chip-manufacturing'],
  ['chip-manufacturing', 'chip-analysis'],
  ['equipment-components', 'semiconductor-materials'],
  ['equipment-components', 'electronic-components'],
  ['instrument-terminal', 'application-devices'],
  ['instrument-terminal', 'electronic-devices'],
  ['sales-application', 'technical-service'],
  ['sales-application', 'trade-service'],
  ['sales-application', 'product-trade'],
].map(([source, target]) => ({ source, target }));

const electronicMindMapTree: IndustryMindMapNode = {
  id: 'electronic-information-root',
  label: '电子信息产业链',
  companyIds: [],
  children: [
    {
      id: 'materials-design',
      label: '原材料、设计、加工',
      companyIds: [],
      children: [
        { id: 'production-equipment', label: '生产设备', companyIds: [] },
        {
          id: 'raw-materials',
          label: '原材料',
          companyIds: [],
          children: [
            {
              id: 'chip-manufacturing',
              label: '芯片制造服务',
              companyIds: ['xinrui-software', 'suzhou-sushi'],
              children: [
                {
                  id: 'chip-analysis',
                  label: '芯片分析服务',
                  companyIds: ['xinrui-software', 'suzhou-sushi'],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'equipment-components',
      label: '电子元件、设备零部件',
      companyIds: [],
      children: [
        { id: 'semiconductor-materials', label: '半导体材料', companyIds: [] },
        { id: 'electronic-components', label: '电子元件', companyIds: ['tianjie'] },
      ],
    },
    {
      id: 'instrument-terminal',
      label: '电子设备、仪器',
      companyIds: [],
      children: [
        { id: 'application-devices', label: '应用电子仪器及设备', companyIds: [] },
        {
          id: 'electronic-devices',
          label: '电子设备',
          companyIds: ['tianjie', 'suzhou-sushi'],
        },
      ],
    },
    {
      id: 'sales-application',
      label: '销售渠道、应用服务',
      companyIds: [],
      children: [
        { id: 'technical-service', label: '电子设备技术服务', companyIds: ['xinrui-software'] },
        { id: 'trade-service', label: '通信设备贸易', companyIds: ['tianjie'] },
        { id: 'product-trade', label: '电子产品贸易', companyIds: ['tianjie'] },
      ],
    },
  ],
};

const strengthNodes: StrengthGraphNode[] = [
  { id: 'root', label: '智能产业链', x: 80, y: 360, status: 'empty', suggestion: 'none' },
  { id: 'base', label: '基础层', x: 220, y: 250, status: 'middle', suggestion: 'none' },
  { id: 'app', label: '应用层', x: 220, y: 460, status: 'middle', suggestion: 'none' },
  { id: 'ai-chip', label: 'AI芯片', x: 370, y: 150, status: 'empty', suggestion: '补链建议环节' },
  { id: 'sensor', label: '传感器', x: 370, y: 230, status: 'middle', suggestion: '强链建议环节' },
  { id: 'cloud', label: '云计算服务', x: 370, y: 310, status: 'middle', suggestion: '强链建议环节' },
  { id: 'robot', label: '智能机器人', x: 560, y: 260, status: 'strong', suggestion: '强链建议环节' },
  { id: 'drone', label: '无人机', x: 560, y: 360, status: 'middle', suggestion: '强链建议环节' },
  { id: 'solution', label: '行业解决方案', x: 370, y: 510, status: 'middle', suggestion: '强链建议环节' },
  { id: 'smart-home', label: '智慧家居', x: 560, y: 470, status: 'middle', suggestion: 'none' },
  { id: 'smart-city', label: '智慧城市', x: 560, y: 570, status: 'strong', suggestion: '强链建议环节' },
  { id: 'finance', label: '智慧金融', x: 730, y: 610, status: 'strong', suggestion: '强链建议环节' },
  { id: 'construction', label: '智能建筑集成系统', x: 730, y: 690, status: 'strong', suggestion: '强链建议环节' },
  { id: 'industrial-robot', label: '工业机器人', x: 730, y: 260, status: 'strong', suggestion: '强链建议环节' },
  { id: 'special-robot', label: '特种机器人', x: 730, y: 190, status: 'middle', suggestion: '强链建议环节' },
];

const strengthEdges = [
  ['root', 'base'],
  ['root', 'app'],
  ['base', 'ai-chip'],
  ['base', 'sensor'],
  ['base', 'cloud'],
  ['sensor', 'robot'],
  ['cloud', 'drone'],
  ['app', 'solution'],
  ['solution', 'smart-home'],
  ['solution', 'smart-city'],
  ['smart-city', 'finance'],
  ['smart-city', 'construction'],
  ['robot', 'industrial-robot'],
  ['robot', 'special-robot'],
].map(([source, target]) => ({ source, target }));

export const industries: IndustryDetail[] = [
  {
    id: 'electronic-information',
    name: '电子信息产业链',
    definition:
      '电子信息产业，是指为了实现制作、加工、处理、传播或接收信息等功能或目的，利用电子技术和信息技术从事的与电子信息产品相关的设备生产、硬件制造、系统集成、软件开发以及应用服务等作业过程的集合。',
    scope:
      '上游包括电子材料、芯片设计、关键零部件和生产设备，中游包括元器件、终端设备和系统集成，下游覆盖通信、智能制造、智慧城市、消费电子等应用场景。',
    coreLinks: ['芯片设计与制造', '电子元器件', '通信设备', '智能终端', '软件与信息服务'],
    upstream: ['半导体材料', '芯片设计', '生产设备', '电子化学品'],
    midstream: ['电子元件', '集成电路', '通信设备', '智能终端'],
    downstream: ['智慧城市', '工业互联网', '消费电子', '汽车电子'],
    policyItems: [
      '关于征集具身智能领域攻关需求的通知',
      '关于加快新一代信息技术产业集群培育的实施意见',
      '集成电路和软件产业高质量发展专项政策',
    ],
    newsItems: [
      'AI电源行业的人才困局：为什么十年经验不如一种思维方式',
      '通32万手封单！一分钟，直线涨停',
      '计算机跌出本科专业月收入前十，年轻人的第一份工作被AI截胡',
    ],
    graphTree: electronicMindMapTree,
    graphNodes: electronicNodes,
    graphEdges: electronicEdges,
    strengthNodes,
    strengthEdges,
    trend: {
      enterpriseCount: [2450000, 2750000, 3120000, 3560000, 3740000],
      revenue: [1200, 3600, 8200, 58000, 188000],
      financing: [
        { round: '种子轮', value: 18, color: '#2584ff' },
        { round: '天使轮', value: 25, color: '#83d99c' },
        { round: 'A轮融资', value: 34, color: '#ffb84d' },
        { round: 'B轮融资', value: 12, color: '#ff7a7a' },
        { round: 'C轮融资', value: 8, color: '#8f7cf6' },
      ],
    },
  },
];

const defaultIndustryIds = [
  'medical-device',
  'new-materials',
  'new-energy-vehicle',
  'biomedicine',
  'computer',
  'communication',
  'shipbuilding',
  'high-end-equipment',
  'artificial-intelligence',
  'software-service',
  'modern-logistics',
  'environmental-protection',
  'digital-creative',
];

defaultIndustryIds.forEach((id) => {
  if (industries.some((industry) => industry.id === id)) return;
  const readableNameMap: Record<string, string> = {
    'medical-device': '医疗器械产业链',
    'new-materials': '新材料产业链',
    'new-energy-vehicle': '新能源汽车产业链',
    biomedicine: '生物医药产业链',
    computer: '计算机产业链',
    communication: '通信产业链',
    shipbuilding: '船舶制造产业链',
    'high-end-equipment': '高端装备产业链',
    'artificial-intelligence': '人工智能产业链',
    'software-service': '软件服务产业链',
    'modern-logistics': '现代物流产业链',
    'environmental-protection': '节能环保产业链',
    'digital-creative': '数字创意产业链',
  };
  industries.push({
    ...industries[0],
    id,
    name: readableNameMap[id] || '产业链',
    definition: `${readableNameMap[id] || '产业链'}聚焦关键环节、核心企业和区域配套能力，支撑招商团队快速识别优势环节与补链方向。`,
  });
});

export function getIndustryById(id?: string) {
  if (!id) return industries[0];
  return industries.find((industry) => industry.id === id) || industries[0];
}

export function getCompanyById(id?: string) {
  if (!id) return companies[0];
  return companies.find((company) => company.id === id) || companies[0];
}

export function getCompanyList(ids: string[]) {
  return ids.map((id) => getCompanyById(id)).filter(Boolean);
}

function getRelatedCompanyIds(node: IndustryMindMapNode, depth: number) {
  if (node.companyIds.length > 0) return node.companyIds;
  if (depth === 0 || companies.length === 0) return [];

  const companyIds = companies.map((company) => company.id);
  const offset =
    node.id.split('').reduce((total, char) => total + char.charCodeAt(0), 0) %
    companyIds.length;

  return companyIds.map((_, index) => companyIds[(offset + index) % companyIds.length]);
}

export function getIndustryOptions() {
  return industries.map((industry) => ({
    label: industry.name,
    value: industry.id,
  }));
}

function toMindMapTreeNode(
  node: IndustryMindMapNode,
  depth: number,
  rootLabel: string,
): TreeData {
  const label = depth === 0 ? rootLabel : node.label;
  const companyIds = getRelatedCompanyIds(node, depth);
  const children = (node.children as IndustryMindMapNode[] | undefined)?.map((child) =>
    toMindMapTreeNode(child, depth + 1, rootLabel),
  );

  return {
    id: node.id,
    label,
    companyIds,
    data: {
      id: node.id,
      label,
      companyIds,
    },
    ...(children?.length ? { children } : {}),
  };
}

export function toIndustryMindMapData(industry: IndustryDetail): TreeData {
  return toMindMapTreeNode(industry.graphTree, 0, industry.name);
}

const statusStyle: Record<ChainNodeStatus, { fill: string; stroke: string; color: string }> = {
  strong: { fill: '#ff5a3d', stroke: '#ff5a3d', color: '#ffffff' },
  middle: { fill: '#ff9f00', stroke: '#ff9f00', color: '#ffffff' },
  weak: { fill: '#1677ff', stroke: '#1677ff', color: '#ffffff' },
  empty: { fill: '#a9adb5', stroke: '#a9adb5', color: '#ffffff' },
};

export function toIndustryGraphData(industry: IndustryDetail): GraphData {
  return treeToGraphData(industry.graphTree, {
    getNodeData: (datum, depth) => {
      const node = datum as IndustryMindMapNode;
      const level = depth ?? 0;
      const label = level === 0 ? industry.name : node.label;
      const companyIds = getRelatedCompanyIds(node, level);
      const isRoot = level === 0;
      const isMainBranch = level === 1;

      return {
        id: node.id,
        children: node.children?.map((child) => child.id),
        depth: level,
        data: {
          id: node.id,
          label,
          companyIds,
        },
        style: {
          size: isRoot ? [174, 44] : isMainBranch ? [174, 38] : [158, 34],
          radius: isRoot || isMainBranch ? 10 : 7,
          fill: isRoot ? '#55b8ff' : isMainBranch ? '#8793b4' : '#f7fbff',
          stroke: isRoot ? '#55b8ff' : isMainBranch ? '#8793b4' : '#92b8f7',
          lineWidth: isRoot || isMainBranch ? 0 : 1.5,
          labelText: label,
          labelPlacement: 'center',
          labelFill: isRoot || isMainBranch ? '#ffffff' : '#24324a',
          labelFontSize: 12,
          labelFontWeight: 700,
        },
      };
    },
    getEdgeData: (source, target) => ({
      source: source.id,
      target: target.id,
      style: {
        stroke: '#cdd7e8',
        lineWidth: 1.4,
        lineDash: [5, 5],
        endArrow: true,
      },
    }),
  });
}

export function toStrengthGraphData(industry: IndustryDetail): GraphData {
  return {
    nodes: industry.strengthNodes.map((node) => {
      const style = statusStyle[node.status];
      return {
        id: node.id,
        data: node,
        style: {
          x: node.x,
          y: node.y,
          size: [126, 32],
          radius: 6,
          fill: style.fill,
          stroke: style.stroke,
          lineWidth: 1,
          labelText: node.label,
          labelPlacement: 'center',
          labelFill: style.color,
          labelFontSize: 12,
          labelFontWeight: 700,
          halo: node.status === 'weak' || node.status === 'empty',
          haloStroke: style.stroke,
          haloLineWidth: 8,
          haloStrokeOpacity: 0.16,
        },
      };
    }),
    edges: industry.strengthEdges.map((edge, index) => ({
      id: `strength-edge-${index}`,
      source: edge.source,
      target: edge.target,
      style: {
        stroke: '#d8dce5',
        lineWidth: 5,
        strokeOpacity: 0.62,
      },
    })),
  };
}
