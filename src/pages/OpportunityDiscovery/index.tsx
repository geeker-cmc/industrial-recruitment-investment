import {
  ApartmentOutlined,
  ArrowRightOutlined,
  BankOutlined,
  CheckOutlined,
  ClearOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  FilterOutlined,
  FundProjectionScreenOutlined,
  PlusOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Input,
  Progress,
  Radio,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  buildInvestmentStyleProfile,
  companyOpportunityMetadata,
  getOpportunityRecommendations,
  opportunityFilterGroups,
  opportunityStrategies,
  type OpportunityFilterKey,
  type OpportunityFilters,
  type OpportunityRecommendation,
} from '../../mock/opportunity';
import { useOpportunityStore } from '../../stores/useOpportunityStore';

const filterIcons: Record<OpportunityFilterKey, React.ReactNode> = {
  governmentRewards: <TrophyOutlined />,
  certifications: <SafetyCertificateOutlined />,
  technologyCertifications: <ExperimentOutlined />,
  industry: <ApartmentOutlined />,
  region: <EnvironmentOutlined />,
  scaleStage: <BankOutlined />,
  financing: <FundProjectionScreenOutlined />,
  risk: <SafetyCertificateOutlined />,
  technologyTalent: <ThunderboltOutlined />,
};

export default function OpportunityDiscoveryPage() {
  const navigate = useNavigate();
  const strategy = useOpportunityStore((state) => state.strategy);
  const keyword = useOpportunityStore((state) => state.keyword);
  const draftFilters = useOpportunityStore((state) => state.draftFilters);
  const appliedFilters = useOpportunityStore((state) => state.appliedFilters);
  const setStrategy = useOpportunityStore((state) => state.setStrategy);
  const setKeyword = useOpportunityStore((state) => state.setKeyword);
  const setDraftFilters = useOpportunityStore((state) => state.setDraftFilters);
  const applyFilters = useOpportunityStore((state) => state.applyFilters);
  const resetFilters = useOpportunityStore((state) => state.resetFilters);
  const setRecommendations = useOpportunityStore((state) => state.setRecommendations);
  const profile = useMemo(() => buildInvestmentStyleProfile(), []);
  const recommendations = useMemo(
    () => getOpportunityRecommendations({ strategy, filters: appliedFilters, keyword }),
    [appliedFilters, keyword, strategy],
  );

  useEffect(() => {
    setRecommendations(recommendations);
  }, [recommendations, setRecommendations]);

  const selectedCount = Object.values(draftFilters).reduce((count, values) => count + (values?.length ?? 0), 0);
  const appliedSelection = flattenFilters(appliedFilters);

  const updateFilter = (key: OpportunityFilterKey, values: string[]) => {
    const nextFilters: OpportunityFilters = { ...draftFilters };
    if (values.length) nextFilters[key] = values;
    else delete nextFilters[key];
    setDraftFilters(nextFilters);
  };

  const confirmFilters = () => {
    applyFilters();
    message.success('筛选条件已应用');
  };

  const clearFilters = () => {
    resetFilters();
    message.success('筛选条件已清空');
  };

  const openProjectForm = (record: OpportunityRecommendation) => {
    const source = record.recommendationSources.join('、');
    const params = new URLSearchParams({
      companyId: record.company.id,
      recommendationSource: source,
      recommendationReason: record.reason,
    });
    navigate(`/project-management?${params.toString()}`);
  };

  const columns: ColumnsType<OpportunityRecommendation> = [
    {
      title: '推荐度',
      dataIndex: 'score',
      width: 112,
      fixed: 'left',
      render: (score: number) => (
        <div className="opportunity-score-cell">
          <strong>{score}</strong>
          <Progress percent={score} showInfo={false} size="small" strokeColor="#1677ff" />
        </div>
      ),
    },
    {
      title: '企业名称',
      dataIndex: ['company', 'name'],
      width: 250,
      render: (_value, record) => (
        <div className="opportunity-company-cell">
          <Link to={companyDetailPath(record)}>{record.company.name}</Link>
          <span>{record.company.nationalIndustry.split(' > ').slice(-1)[0]}</span>
        </div>
      ),
    },
    {
      title: '推荐来源',
      dataIndex: 'recommendationSources',
      width: 170,
      render: (sources: string[]) => (
        <Space size={[4, 4]} wrap>
          {sources.map((source) => <Tag color="blue" key={source}>{source}</Tag>)}
        </Space>
      ),
    },
    {
      title: '产业链节点',
      dataIndex: ['meta', 'industry'],
      width: 210,
      render: (industries: string[]) => (
        <Space size={[4, 4]} wrap>
          {industries.slice(0, 3).map((industry) => <Tag key={industry}>{industry.replace('产业链', '')}</Tag>)}
        </Space>
      ),
    },
    {
      title: '所在地',
      dataIndex: ['meta', 'region'],
      width: 130,
      render: (regions: string[]) => regions[0] ?? '华东区域',
    },
    {
      title: '企业标签',
      dataIndex: ['meta', 'technologyCertifications'],
      width: 220,
      render: (tags: string[]) => (
        <Space size={[4, 4]} wrap>
          {tags.slice(0, 3).map((tag) => <Tag color="gold" key={tag}>{tag}</Tag>)}
        </Space>
      ),
    },
    {
      title: '综合评价',
      dataIndex: ['meta', 'score'],
      width: 110,
      render: (score: number) => <strong className="opportunity-score-text">{score}分</strong>,
    },
    {
      title: '风险等级',
      dataIndex: ['meta', 'riskLevel'],
      width: 100,
      render: (risk: '低' | '中' | '高') => <Tag color={risk === '高' ? 'red' : risk === '中' ? 'orange' : 'green'}>{risk}</Tag>,
    },
    {
      title: '推荐理由',
      dataIndex: 'reason',
      width: 330,
      render: (reason: string, record) => (
        <div className="opportunity-reason-cell">
          <span>{reason}</span>
          <Space size={4} wrap>
            {record.matchedDimensions.slice(0, 3).map((dimension) => <Tag color="cyan" key={dimension}>{dimension}</Tag>)}
          </Space>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 170,
      fixed: 'right',
      render: (_value, record) => (
        <Space className="opportunity-row-actions" size={4} wrap>
          <Button type="link" size="small" href={`#${companyDetailPath(record)}`}>查看画像</Button>
          <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => openProjectForm(record)}>新建项目</Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="opportunity-page">
      <section className="opportunity-hero">
        <div>
          <span className="management-eyebrow">投资机会发现</span>
          <h1>发现企业</h1>
          <p>基于投中和投后项目形成投资风格，从产业链、区域、认证、经营和技术人才等维度发现值得进一步研究的企业。</p>
        </div>
        <div className="opportunity-hero__badge">
          <strong>{profile.sampleCount}</strong>
          <span>投中/投后样本企业</span>
        </div>
      </section>

      <section className="opportunity-strategy-panel">
        <div className="opportunity-section-heading">
          <div>
            <h2><ThunderboltOutlined /> 推荐策略</h2>
            <p>策略决定排序，筛选条件决定候选范围。</p>
          </div>
          <Tag color="blue">当前样本 {profile.sampleCount} 家</Tag>
        </div>
        <Radio.Group
          className="opportunity-strategy-group"
          value={strategy}
          onChange={(event) => setStrategy(event.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          {opportunityStrategies.map((item) => (
            <Radio.Button key={item.key} value={item.key}>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </Radio.Button>
          ))}
        </Radio.Group>
      </section>

      <section className="opportunity-filter-panel">
        <div className="opportunity-section-heading">
          <div>
            <h2><FilterOutlined /> 多维筛选</h2>
            <p>同一分组内按“或”匹配，不同分组之间按“且”组合。</p>
          </div>
          <Space>
            <Tag color={selectedCount ? 'blue' : 'default'}>{selectedCount} 项待确认条件</Tag>
            <Button icon={<ClearOutlined />} onClick={clearFilters}>清空条件</Button>
            <Button type="primary" icon={<CheckOutlined />} onClick={confirmFilters}>确认查询</Button>
          </Space>
        </div>
        <Collapse
          className="opportunity-filter-collapse"
          bordered={false}
          defaultActiveKey={['technologyCertifications', 'industry', 'region']}
          items={opportunityFilterGroups.map((group) => {
            const values = draftFilters[group.key] ?? [];
            return {
              key: group.key,
              label: (
                <span className="opportunity-filter-title">
                  {filterIcons[group.key]}
                  <strong>{group.label}</strong>
                  {values.length ? <Tag color="blue">{values.length} 项</Tag> : <Tag>全部</Tag>}
                </span>
              ),
              children: (
                <div className="opportunity-filter-options">
                  <Checkbox checked={!values.length} onChange={() => updateFilter(group.key, [])}>全部</Checkbox>
                  <Checkbox.Group
                    value={values}
                    options={group.options}
                    onChange={(checkedValues) => updateFilter(group.key, checkedValues as string[])}
                  />
                </div>
              ),
            };
          })}
        />
      </section>

      <section className="opportunity-result-panel">
        <div className="opportunity-section-heading opportunity-result-heading">
          <div>
            <h2><BankOutlined /> 推荐企业</h2>
            <p>共 {recommendations.length} 家企业，推荐结果仅作为投资研究参考。</p>
          </div>
          <Input
            className="opportunity-search"
            allowClear
            prefix={<SearchOutlined />}
            placeholder="搜索企业、产业链或主营业务"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onPressEnter={confirmFilters}
          />
        </div>
        {appliedSelection.length ? (
          <div className="opportunity-applied-filters">
            <span>已应用条件：</span>
            {appliedSelection.map((item) => <Tag key={item}>{item}</Tag>)}
          </div>
        ) : null}
        <Alert
          className="opportunity-profile-alert"
          type="info"
          showIcon
          message={profile.sampleCount ? `投资风格来自 ${profile.sampleProjectNames.slice(0, 3).join('、')}${profile.sampleProjectNames.length > 3 ? ' 等项目' : ''}` : '当前没有投中或投后样本，已切换为重点产业降级推荐'}
          description={profile.preferredIndustries.length ? `重点偏好：${profile.preferredIndustries.slice(0, 4).join('、')}` : '可先使用产业链、区域和认证条件筛选候选企业。'}
        />
        <Table<OpportunityRecommendation>
          className="opportunity-table"
          columns={columns}
          dataSource={recommendations}
          rowKey={(record) => record.company.id}
          pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `共 ${total} 家` }}
          scroll={{ x: 1840 }}
          locale={{ emptyText: '暂无符合条件的推荐企业，请调整筛选条件' }}
        />
      </section>
    </main>
  );
}

function flattenFilters(filters: OpportunityFilters) {
  return Object.values(filters).flatMap((values) => values ?? []);
}

function companyDetailPath(record: OpportunityRecommendation) {
  const params = new URLSearchParams({
    recommendationSource: record.recommendationSources.join('、'),
    recommendationReason: record.reason,
  });
  return `/companies/${record.company.id}?${params.toString()}`;
}
