import { companies, type CompanyProfile } from './industry';
import {
  investmentProjects,
  type InvestmentProject,
  type LifecycleStage,
} from './investment';

export type OpportunityStrategy =
  | 'investment-style'
  | 'supply-chain'
  | 'nantong-priority'
  | 'growth-first'
  | 'comprehensive';

export type OpportunityFilterKey =
  | 'governmentRewards'
  | 'certifications'
  | 'technologyCertifications'
  | 'industry'
  | 'region'
  | 'scaleStage'
  | 'financing'
  | 'risk'
  | 'technologyTalent';

export type OpportunityFilters = Partial<Record<OpportunityFilterKey, string[]>>;

export type OpportunityFilterGroup = {
  key: OpportunityFilterKey;
  label: string;
  options: string[];
};

export type CompanyOpportunityMeta = {
  companyId: string;
  region: string[];
  governmentRewards: string[];
  certifications: string[];
  technologyCertifications: string[];
  industry: string[];
  scaleStage: string[];
  financing: string[];
  risk: string[];
  technologyTalent: string[];
  score: number;
  innovationScore: number;
  riskLevel: '低' | '中' | '高';
  hasExistingProject: boolean;
  existingProjectStage?: LifecycleStage;
};

export type InvestmentStyleProfile = {
  sampleCount: number;
  sampleCompanyIds: string[];
  sampleProjectNames: string[];
  preferredIndustries: string[];
  preferredTags: string[];
  preferredBusiness: string[];
  preferredRegions: string[];
};

export type OpportunityRecommendation = {
  company: CompanyProfile;
  meta: CompanyOpportunityMeta;
  score: number;
  recommendationSources: string[];
  matchedDimensions: string[];
  reason: string;
};

export const opportunityStrategies: Array<{ key: OpportunityStrategy; label: string; description: string }> = [
  { key: 'investment-style', label: '投资风格相似', description: '参考投中和投后企业的产业链、标签和技术特征' },
  { key: 'supply-chain', label: '产业链补链', description: '优先发现产业链关键节点和潜在补链企业' },
  { key: 'nantong-priority', label: '南通重点产业', description: '围绕区域重点产业方向优先推荐' },
  { key: 'growth-first', label: '高成长优选', description: '优先关注成长、创新和商机表现突出的企业' },
  { key: 'comprehensive', label: '综合推荐', description: '综合产业匹配、企业质量和风险表现排序' },
];

export const opportunityFilterGroups: OpportunityFilterGroup[] = [
  {
    key: 'governmentRewards',
    label: '政府奖励',
    options: [
      '国家技术发明奖',
      '国家科学技术进步奖',
      '地方政府专项资金奖励企业',
      '中国地理信息产业百强企业',
      '中国地理信息产业高成长企业TOP50',
      '中国地理信息产业最具成长性企业',
    ],
  },
  {
    key: 'certifications',
    label: '认定认证',
    options: [
      '国家级质量标杆企业',
      '省级质量标杆企业',
      '省级服务型制造示范企业',
      '省级工业绿色设计企业',
      '国家级智慧养老示范企业',
      '国家级智能光伏试点示范企业',
      '国资委“双百企业”',
    ],
  },
  {
    key: 'technologyCertifications',
    label: '科技类认证',
    options: [
      '高新技术企业',
      '专精特新',
      '国家级专精特新“小巨人”',
      '省级专精特新',
      '科技小巨人',
      '瞪羚企业',
      '独角兽企业',
      '隐形冠军',
    ],
  },
  {
    key: 'industry',
    label: '产业链与行业',
    options: [
      '电子信息产业链',
      '集成电路产业链',
      '高端装备产业链',
      '智能制造产业链',
      '数字经济产业链',
      '智能终端产业链',
      '信息技术服务产业链',
      '软件服务产业链',
      '通信产业链',
      '光子产业链',
      '半导体材料产业链',
      '检测认证产业链',
    ],
  },
  {
    key: 'region',
    label: '区域',
    options: ['南通市', '江苏省', '北京市', '浙江省', '上海市', '广东省', '华东区域', '华北区域'],
  },
  {
    key: 'scaleStage',
    label: '企业规模与发展阶段',
    options: ['大型企业', '中型企业', '小型企业', '科技型中小企业', '早期', '成长期', '成熟期', '上市企业', '新三板企业'],
  },
  {
    key: 'financing',
    label: '投融资特征',
    options: ['已上市', '新三板', '近期有融资', '拟融资', '股权融资', '未披露'],
  },
  {
    key: 'risk',
    label: '经营与风险',
    options: ['低风险', '重点关注', '重大风险', '经营稳定', '商机活跃', '履约信用良好'],
  },
  {
    key: 'technologyTalent',
    label: '技术与人才',
    options: ['人工智能', '半导体', '智能制造', '通信技术', '软件服务', '电子设备', '检测技术', '新能源', '企业技术中心', '研发团队', '高层次人才'],
  },
];

const extraMetadata: Record<string, Partial<CompanyOpportunityMeta>> = {
  tianjie: {
    region: ['浙江省', '华东区域'],
    technologyCertifications: ['高新技术企业', '专精特新'],
    technologyTalent: ['智能制造', '通信技术', '企业技术中心', '研发团队'],
    governmentRewards: ['地方政府专项资金奖励企业'],
  },
  'xinrui-software': {
    region: ['北京市', '华北区域'],
    technologyCertifications: ['高新技术企业', '专精特新', '科技小巨人'],
    technologyTalent: ['半导体', '软件服务', '企业技术中心', '高层次人才', '研发团队'],
    governmentRewards: ['国家科学技术进步奖'],
  },
  'suzhou-sushi': {
    region: ['江苏省', '华东区域'],
    technologyCertifications: ['高新技术企业'],
    technologyTalent: ['智能制造', '检测技术', '企业技术中心', '研发团队'],
    governmentRewards: ['地方政府专项资金奖励企业'],
  },
};

function scoreFromCompany(company: CompanyProfile, label: string) {
  const score = company.scores.find((item) => item.label === label)?.ranking ?? '';
  const percent = score.match(/前(\d+)%/);
  return percent ? Math.max(60, 100 - Number(percent[1])) : 70;
}

function regionFromAddress(address: string) {
  const knownRegions = ['北京市', '上海市', '江苏省', '浙江省', '广东省'];
  const province = knownRegions.find((region) => address.startsWith(region));
  if (province === '江苏省') return [province, '华东区域'];
  if (province === '浙江省' || province === '上海市') return [province, '华东区域'];
  if (province === '北京市') return [province, '华北区域'];
  return [province ?? '华东区域'];
}

function metadataForCompany(company: CompanyProfile, index: number): CompanyOpportunityMeta {
  const score = Number(company.summaryScores.comprehensive.match(/(\d+)分/)?.[1] ?? 450);
  const innovationScore = Number(company.summaryScores.innovation.match(/(\d+)分/)?.[1] ?? 430);
  const hasHighRisk = company.riskSummary.includes('1 条') || company.riskSummary.includes('2 条');
  const isListed = company.tags.includes('上市企业') || Boolean(company.stock);
  const capital = Number(company.registeredCapital.replace(/[^0-9.]/g, ''));
  const scale = capital >= 30000 ? '大型企业' : capital >= 5000 ? '中型企业' : '小型企业';
  const stage = isListed ? '上市企业' : index % 3 === 0 ? '成长期' : index % 3 === 1 ? '成熟期' : '早期';
  const derived: CompanyOpportunityMeta = {
    companyId: company.id,
    region: regionFromAddress(company.address),
    governmentRewards: index % 3 === 0 ? ['地方政府专项资金奖励企业'] : [],
    certifications: company.tags.includes('企业技术中心') ? ['省级服务型制造示范企业'] : [],
    technologyCertifications: [
      ...(company.tags.includes('高新技术企业认定') || company.tags.includes('高新技术企业') ? ['高新技术企业'] : []),
      ...(company.tags.includes('专精特新') ? ['专精特新'] : []),
      ...(company.tags.includes('科技型中小企业评价') ? ['科技小巨人'] : []),
      ...(company.tags.includes('瞪羚企业') ? ['瞪羚企业'] : []),
    ],
    industry: company.industries,
    scaleStage: [scale, stage, ...(capital < 5000 ? ['科技型中小企业'] : [])],
    financing: [
      ...(isListed ? ['已上市'] : ['未披露']),
      ...(company.summaryScores.business.includes('商机') ? ['近期有融资'] : []),
      ...(index % 4 === 0 ? ['股权融资'] : []),
    ],
    risk: [hasHighRisk ? '重点关注' : '低风险', hasHighRisk ? '经营稳定' : '履约信用良好', ...(company.summaryScores.business.includes('商机') ? ['商机活跃'] : [])],
    technologyTalent: [
      ...company.mainBusiness,
      ...(company.tags.includes('智能制造') ? ['智能制造'] : []),
      ...(company.tags.includes('企业技术中心') ? ['企业技术中心'] : []),
      ...(company.tags.includes('研发能力突出') ? ['高层次人才', '研发团队'] : ['研发团队']),
    ],
    score,
    innovationScore,
    riskLevel: hasHighRisk ? '中' : index % 5 === 0 ? '高' : '低',
    hasExistingProject: investmentProjects.some((project) => project.company.id === company.id),
    existingProjectStage: investmentProjects.find((project) => project.company.id === company.id)?.stage,
  };

  return {
    ...derived,
    ...extraMetadata[company.id],
    region: extraMetadata[company.id]?.region ?? derived.region,
    governmentRewards: [...new Set([...(derived.governmentRewards ?? []), ...(extraMetadata[company.id]?.governmentRewards ?? [])])],
    certifications: [...new Set([...(derived.certifications ?? []), ...(extraMetadata[company.id]?.certifications ?? [])])],
    technologyCertifications: [...new Set([...(derived.technologyCertifications ?? []), ...(extraMetadata[company.id]?.technologyCertifications ?? [])])],
    technologyTalent: [...new Set([...(derived.technologyTalent ?? []), ...(extraMetadata[company.id]?.technologyTalent ?? [])])],
  };
}

export const companyOpportunityMetadata: Record<string, CompanyOpportunityMeta> = Object.fromEntries(
  companies.map((company, index) => [company.id, metadataForCompany(company, index)]),
);

function topValues(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
    .slice(0, 6)
    .map(([value]) => value);
}

export function buildInvestmentStyleProfile(projects: InvestmentProject[] = investmentProjects): InvestmentStyleProfile {
  const samples = projects.filter((project) => project.stage === '投' || project.stage === '管');
  return {
    sampleCount: samples.length,
    sampleCompanyIds: [...new Set(samples.map((project) => project.company.id))],
    sampleProjectNames: samples.map((project) => project.name),
    preferredIndustries: topValues(samples.flatMap((project) => project.company.industries)),
    preferredTags: topValues(samples.flatMap((project) => project.company.tags)),
    preferredBusiness: topValues(samples.flatMap((project) => project.company.mainBusiness)),
    preferredRegions: topValues(samples.flatMap((project) => companyOpportunityMetadata[project.company.id]?.region ?? [])),
  };
}

function intersection(values: string[], preferred: string[]) {
  return values.filter((value) => preferred.includes(value));
}

function matchesFilters(meta: CompanyOpportunityMeta, company: CompanyProfile, filters: OpportunityFilters, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (
    normalizedKeyword &&
    ![company.name, company.shortName, ...company.industries, ...company.mainBusiness]
      .join(' ')
      .toLowerCase()
      .includes(normalizedKeyword)
  ) {
    return false;
  }

  return Object.entries(filters).every(([key, values]) => {
    if (!values?.length) return true;
    const selected = values.filter((value) => value !== '全部');
    if (!selected.length) return true;
    const actualValues = meta[key as OpportunityFilterKey] as string[];
    return selected.some((value) => actualValues.includes(value));
  });
}

function strategyScore(strategy: OpportunityStrategy, values: {
  chainMatches: number;
  tagMatches: number;
  businessMatches: number;
  regionMatches: number;
  meta: CompanyOpportunityMeta;
}) {
  const { chainMatches, tagMatches, businessMatches, regionMatches, meta } = values;
  const quality = Math.round((meta.score + meta.innovationScore) / 2);
  if (strategy === 'supply-chain') return 60 + chainMatches * 12 + tagMatches * 4 + regionMatches * 3 + quality / 25;
  if (strategy === 'nantong-priority') return 58 + chainMatches * 8 + regionMatches * 12 + tagMatches * 3 + quality / 28;
  if (strategy === 'growth-first') return 55 + quality / 5 + businessMatches * 5 + tagMatches * 3;
  if (strategy === 'investment-style') return 58 + chainMatches * 8 + tagMatches * 5 + businessMatches * 3 + regionMatches * 2;
  return 58 + chainMatches * 6 + tagMatches * 4 + businessMatches * 2 + regionMatches * 2 + quality / 20;
}

export function getOpportunityRecommendations({
  strategy = 'investment-style',
  filters = {},
  keyword = '',
  projects = investmentProjects,
}: {
  strategy?: OpportunityStrategy;
  filters?: OpportunityFilters;
  keyword?: string;
  projects?: InvestmentProject[];
} = {}): OpportunityRecommendation[] {
  const profile = buildInvestmentStyleProfile(projects);
  const fallbackIndustries = profile.preferredIndustries.length
    ? profile.preferredIndustries
    : ['电子信息产业链', '高端装备产业链', '智能制造产业链'];
  const candidates = companies.filter((company) => !profile.sampleCompanyIds.includes(company.id));

  return candidates
    .filter((company) => matchesFilters(companyOpportunityMetadata[company.id]!, company, filters, keyword))
    .map((company) => {
      const meta = companyOpportunityMetadata[company.id]!;
      const chainMatches = intersection(meta.industry, fallbackIndustries);
      const tagMatches = intersection(meta.technologyCertifications, profile.preferredTags);
      const businessMatches = intersection(meta.technologyTalent, profile.preferredBusiness);
      const regionMatches = intersection(meta.region, profile.preferredRegions);
      const score = Math.min(
        99,
        Math.max(
          52,
          Math.round(strategyScore(strategy, {
            chainMatches: chainMatches.length,
            tagMatches: tagMatches.length,
            businessMatches: businessMatches.length,
            regionMatches: regionMatches.length,
            meta,
          })),
        ),
      );
      const sources = new Set<string>();
      if (chainMatches.length) sources.add(strategy === 'supply-chain' ? '产业链补链' : '产业链匹配');
      if (tagMatches.length || businessMatches.length) sources.add('投资风格相似');
      if (regionMatches.length || strategy === 'nantong-priority') sources.add('区域产业协同');
      if (strategy === 'growth-first') sources.add('高成长优选');
      if (!sources.size) sources.add('综合推荐');
      const matchedDimensions = [
        ...chainMatches.slice(0, 2),
        ...tagMatches.slice(0, 2),
        ...businessMatches.slice(0, 2),
        ...regionMatches.slice(0, 1),
      ];
      const reason = matchedDimensions.length
        ? `匹配${matchedDimensions.slice(0, 3).join('、')}，综合评价 ${meta.score} 分，建议优先查看企业画像。`
        : `企业综合评价 ${meta.score} 分，具备${meta.industry.slice(0, 2).join('、')}业务基础，建议进一步核验投资条件。`;
      return {
        company,
        meta,
        score,
        recommendationSources: [...sources],
        matchedDimensions: [...new Set(matchedDimensions)],
        reason,
      };
    })
    .sort((a, b) => b.score - a.score || b.meta.score - a.meta.score);
}

export function scoreFromRanking(company: CompanyProfile, label: string) {
  return scoreFromCompany(company, label);
}
