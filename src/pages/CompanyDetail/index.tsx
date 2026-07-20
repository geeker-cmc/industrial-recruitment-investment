import {
  ArrowLeftOutlined,
  CloudDownloadOutlined,
  FileProtectOutlined,
  ProjectOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Descriptions,
  Modal,
  Progress,
  Space,
  Table,
  Tabs,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { companies, getCompanyById, type CompanyProfile } from '../../mock/industry';
import { useCompanyStore } from '../../stores/useCompanyStore';

type CompanyParams = {
  companyId: string;
};

type CompanyDetailTab =
  | '基本信息'
  | '工商'
  | '司法'
  | '舆情'
  | '财务'
  | '技术'
  | '人才'
  | '产业链'
  | '综合评价'
  | '同业公司';

type CompanyStat = {
  label: string;
  value: string;
  note: string;
};

type ShareholderRow = {
  id: string;
  name: string;
  type: string;
  ratio: string;
  subscribed: string;
  paid: string;
};

type BusinessChangeRow = {
  id: string;
  date: string;
  item: string;
  before: string;
  after: string;
};

type JudicialRow = {
  id: string;
  type: string;
  title: string;
  date: string;
  amount: string;
  status: string;
};

type OpinionRow = {
  id: string;
  title: string;
  source: string;
  date: string;
  sentiment: '正向' | '中性' | '风险';
  influence: string;
};

type FinanceRow = {
  year: string;
  revenue: string;
  profit: string;
  margin: string;
  debtRatio: string;
};

type TechRow = {
  id: string;
  type: string;
  name: string;
  count: string;
  status: string;
};

type TalentRow = {
  id: string;
  role: string;
  name: string;
  background: string;
  stability: string;
};

type ChainRow = {
  id: string;
  node: string;
  position: string;
  matchedProducts: string;
  value: string;
};

type PeerRow = {
  id: string;
  name: string;
  region: string;
  score: string;
  financing: string;
  advantage: string;
};

const companyDetailTabs: CompanyDetailTab[] = [
  '基本信息',
  '工商',
  '司法',
  '舆情',
  '财务',
  '技术',
  '人才',
  '产业链',
  '综合评价',
  '同业公司',
];

function createCompanyModuleData(company: CompanyProfile) {
  const peers = companies
    .filter((item) => item.id !== company.id)
    .slice(0, 5)
    .map<PeerRow>((item, index) => ({
      id: item.id,
      name: item.name,
      region: item.address.split('市')[0] ? `${item.address.split('市')[0]}市` : '华东区域',
      score: ['539', '526', '519', '512', '506'][index] ?? '500',
      financing: index % 2 === 0 ? '已融资' : '未披露',
      advantage: item.mainBusiness.slice(0, 2).join('、'),
    }));

  return {
    businessStats: [
      { label: '登记状态', value: company.status, note: '工商主体状态稳定' },
      { label: '注册资本', value: company.registeredCapital, note: '实缴口径待接口确认' },
      { label: '成立时间', value: company.establishedDate, note: '经营年限较长' },
      { label: '工商变更', value: '8 次', note: '近三年 2 次变更' },
    ] satisfies CompanyStat[],
    shareholders: [
      {
        id: 'sh-1',
        name: company.legalPerson,
        type: '自然人股东',
        ratio: '33.00%',
        subscribed: '1,650.00 万',
        paid: '1,650.00 万',
      },
      {
        id: 'sh-2',
        name: `${company.shortName}员工持股平台`,
        type: '合伙企业',
        ratio: '18.60%',
        subscribed: '930.00 万',
        paid: '780.00 万',
      },
      {
        id: 'sh-3',
        name: '产业投资引导基金',
        type: '机构股东',
        ratio: '12.40%',
        subscribed: '620.00 万',
        paid: '620.00 万',
      },
    ] satisfies ShareholderRow[],
    businessChanges: [
      {
        id: 'bc-1',
        date: '2026-06-18',
        item: '经营范围',
        before: '电子产品销售、技术服务',
        after: '新增智能制造装备及工业软件服务',
      },
      {
        id: 'bc-2',
        date: '2025-12-09',
        item: '主要人员',
        before: '董事 5 人',
        after: '董事 7 人，新增独立董事',
      },
      {
        id: 'bc-3',
        date: '2025-05-22',
        item: '注册资本',
        before: '4,200.00 万',
        after: company.registeredCapital,
      },
    ] satisfies BusinessChangeRow[],
    judicialStats: [
      { label: '司法案件', value: '2 件', note: '均为合同纠纷' },
      { label: '被执行', value: '0 条', note: '未发现新增执行信息' },
      { label: '行政处罚', value: '0 条', note: '近一年无处罚记录' },
      { label: '风险结论', value: '低风险', note: '持续关注应收账款回款' },
    ] satisfies CompanyStat[],
    judicialCases: [
      {
        id: 'j-1',
        type: '民事案件',
        title: '买卖合同纠纷一审裁定',
        date: '2026-04-12',
        amount: '36.20 万',
        status: '已结案',
      },
      {
        id: 'j-2',
        type: '知识产权',
        title: '软件著作权许可争议',
        date: '2025-11-02',
        amount: '--',
        status: '调解中',
      },
    ] satisfies JudicialRow[],
    opinions: [
      {
        id: 'op-1',
        title: `${company.shortName}完成智能制造产线升级`,
        source: '产业日报',
        date: '2026-07-02',
        sentiment: '正向',
        influence: '高',
      },
      {
        id: 'op-2',
        title: `${company.shortName}入选区域重点产业链企业库`,
        source: '地方工信',
        date: '2026-06-19',
        sentiment: '正向',
        influence: '中',
      },
      {
        id: 'op-3',
        title: '部分客户回款周期延长，行业现金流承压',
        source: '行业观察',
        date: '2026-05-28',
        sentiment: '风险',
        influence: '中',
      },
    ] satisfies OpinionRow[],
    financeRows: [
      { year: '2026E', revenue: '18,600 万', profit: '2,180 万', margin: '31.6%', debtRatio: '42.1%' },
      { year: '2025', revenue: '16,920 万', profit: '1,940 万', margin: '30.8%', debtRatio: '43.4%' },
      { year: '2024', revenue: '14,730 万', profit: '1,520 万', margin: '28.2%', debtRatio: '46.9%' },
      { year: '2023', revenue: '12,840 万', profit: '1,210 万', margin: '26.7%', debtRatio: '48.5%' },
    ] satisfies FinanceRow[],
    techRows: [
      { id: 't-1', type: '专利', name: '核心产品结构与工艺专利', count: '42 项', status: '有效' },
      { id: 't-2', type: '软著', name: '生产管理与检测软件', count: '16 项', status: '有效' },
      { id: 't-3', type: '资质', name: company.tags.slice(0, 3).join('、'), count: '3 项', status: '已认证' },
      { id: 't-4', type: '研发项目', name: '高可靠连接组件自动化测试平台', count: '5 项', status: '进行中' },
    ] satisfies TechRow[],
    talentRows: [
      {
        id: 'talent-1',
        role: '董事长 / 法定代表人',
        name: company.legalPerson,
        background: '产业经营与供应链管理经验丰富',
        stability: '稳定',
      },
      {
        id: 'talent-2',
        role: '技术负责人',
        name: '李明远',
        background: '负责核心产品研发和知识产权布局',
        stability: '稳定',
      },
      {
        id: 'talent-3',
        role: '财务负责人',
        name: '周雅',
        background: '负责预算、成本核算和融资材料管理',
        stability: '关注',
      },
    ] satisfies TalentRow[],
    chainRows: company.industries.slice(0, 5).map<ChainRow>((industry, index) => ({
      id: `chain-${index}`,
      node: industry,
      position: ['上游材料与设备', '中游制造', '下游应用', '技术服务', '渠道配套'][index] ?? '关键配套',
      matchedProducts: company.mainBusiness[index % company.mainBusiness.length],
      value: ['核心供应', '补链价值高', '区域协同', '技术支撑', '应用拓展'][index] ?? '协同',
    })),
    peers,
  };
}

type CompanyModuleData = ReturnType<typeof createCompanyModuleData>;

export default function CompanyDetailPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<CompanyParams>();
  const [searchParams] = useSearchParams();
  const company = getCompanyById(companyId);
  const setCurrentCompanyId = useCompanyStore((state) => state.setCurrentCompanyId);
  const [activeTab, setActiveTab] = useState<CompanyDetailTab>('基本信息');
  const [followed, setFollowed] = useState(false);
  const [candidateOpen, setCandidateOpen] = useState(false);
  const recommendationSource = searchParams.get('recommendationSource') ?? '企业画像推荐';
  const recommendationReason = searchParams.get('recommendationReason') ?? '基于企业画像进入项目储备，建议先完成尽调和估值参考。';
  const moduleData = useMemo(() => createCompanyModuleData(company), [company]);

  useEffect(() => {
    setCurrentCompanyId(company.id);
  }, [company.id, setCurrentCompanyId]);

  return (
    <main className="company-detail-page">
      <section className="company-hero">
        <div className="company-hero__identity">
          <Avatar className="company-logo" shape="square" size={70}>
            {company.logoText}
          </Avatar>
          <div>
            <div className="company-hero__title">
              <h1>{company.name}</h1>
              <Tag color="purple">{company.status}</Tag>
              {company.stock ? <Tag color="orange">{company.stock}</Tag> : null}
            </div>
            <div className="company-hero__tags">
              <span>资质：</span>
              {company.tags.map((tag) => (
                <Tag color="gold" key={tag}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button icon={<ProjectOutlined />} onClick={() => setCandidateOpen(true)} type="primary">
            加入备选池
          </Button>
          <Button icon={<FileProtectOutlined />} onClick={() => navigate('/agents?tool=contract')}>
            合同审核
          </Button>
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => message.success('报告下载任务已创建')}
          >
            下载报告
          </Button>
          <Button
            icon={<StarOutlined />}
            onClick={() => setFollowed((value) => !value)}
            type={followed ? 'primary' : 'default'}
          >
            {followed ? '已关注' : '关注'}
          </Button>
        </Space>
      </section>

      <section className="company-tabs-panel">
        <Tabs
          activeKey={activeTab}
          className="company-primary-tabs"
          items={companyDetailTabs.map((tab) => ({ key: tab, label: tab }))}
          onChange={(key) => setActiveTab(key as CompanyDetailTab)}
        />
        <CompanyContent activeTab={activeTab} company={company} moduleData={moduleData} />
      </section>
      <Modal
        okText="进入项目管理"
        onCancel={() => setCandidateOpen(false)}
        onOk={() => {
          const params = new URLSearchParams({
            companyId: company.id,
            recommendationSource,
            recommendationReason,
          });
          navigate(`/project-management?${params.toString()}`);
        }}
        open={candidateOpen}
        title="已加入备选池"
      >
        <div className="company-candidate-result">
          <ProjectOutlined />
          <h3>{company.shortName}产业投资项目</h3>
          <p>
            目标企业已进入南通产控备选项目池，系统已生成项目草稿，可继续补充拟投金额、
            投资人/出资人、尽调资料和合同文件。
          </p>
          <div>
            <Tag color="blue">项目阶段：募</Tag>
            <Tag color="gold">下一步：新建项目并绑定企业</Tag>
            <Tag color="green">画像结论：适合进入投前尽调</Tag>
          </div>
          <div className="company-candidate-result__source">
            <strong>机会来源：{recommendationSource}</strong>
            <span>{recommendationReason}</span>
          </div>
        </div>
      </Modal>
    </main>
  );
}

function CompanyContent({
  activeTab,
  company,
  moduleData,
}: {
  activeTab: CompanyDetailTab;
  company: CompanyProfile;
  moduleData: CompanyModuleData;
}) {
  if (activeTab === '基本信息') return <BasicInfo company={company} />;
  if (activeTab === '工商') return <BusinessInfo company={company} moduleData={moduleData} />;
  if (activeTab === '司法') return <JudicialInfo moduleData={moduleData} />;
  if (activeTab === '舆情') return <OpinionInfo moduleData={moduleData} />;
  if (activeTab === '财务') return <FinanceInfo moduleData={moduleData} />;
  if (activeTab === '技术') return <TechInfo company={company} moduleData={moduleData} />;
  if (activeTab === '人才') return <TalentInfo moduleData={moduleData} />;
  if (activeTab === '产业链') return <ChainInfo company={company} moduleData={moduleData} />;
  if (activeTab === '综合评价') return <CompanyEvaluation company={company} moduleData={moduleData} />;
  return <PeerInfo moduleData={moduleData} />;
}

function BasicInfo({ company }: { company: CompanyProfile }) {
  return (
    <div className="company-content">
      <SectionTitle title="企业基本信息" />
      <Descriptions
        className="company-descriptions"
        column={2}
        colon={false}
        labelStyle={{ width: 170 }}
      >
        <Descriptions.Item label="公司名称">{company.name}</Descriptions.Item>
        <Descriptions.Item label="法定代表人">{company.legalPerson}</Descriptions.Item>
        <Descriptions.Item label="统一社会信用代码">{company.creditCode}</Descriptions.Item>
        <Descriptions.Item label="登记状态">{company.status}</Descriptions.Item>
        <Descriptions.Item label="成立日期">{company.establishedDate}</Descriptions.Item>
        <Descriptions.Item label="注册资本">{company.registeredCapital}</Descriptions.Item>
        <Descriptions.Item label="企业类型">{company.companyType}</Descriptions.Item>
        <Descriptions.Item label="登记机关">南通市市场监督管理局</Descriptions.Item>
        <Descriptions.Item label="注册地址" span={2}>
          {company.address}
        </Descriptions.Item>
        <Descriptions.Item label="联系方式">{company.contact}</Descriptions.Item>
        <Descriptions.Item label="企业邮箱">{company.email}</Descriptions.Item>
        <Descriptions.Item label="企业网址">
          <a href={company.website} rel="noreferrer" target="_blank">
            {company.website}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="邮政编码">{company.postcode}</Descriptions.Item>
        <Descriptions.Item label="所属行业" span={2}>
          {company.nationalIndustry}
        </Descriptions.Item>
        <Descriptions.Item label="经营范围" span={2}>
          {company.businessScope}
        </Descriptions.Item>
        <Descriptions.Item label="主营业务" span={2}>
          {company.mainBusiness.map((item) => (
            <Tag color="cyan" key={item}>
              {item}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="所属重点产业链" span={2}>
          {company.industries.map((item) => (
            <Tag color="blue" key={item}>
              {item}
            </Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

function BusinessInfo({
  company,
  moduleData,
}: {
  company: CompanyProfile;
  moduleData: CompanyModuleData;
}) {
  const shareholderColumns: ColumnsType<ShareholderRow> = [
    { title: '股东名称', dataIndex: 'name' },
    { title: '股东类型', dataIndex: 'type', width: 140 },
    { title: '持股比例', dataIndex: 'ratio', width: 120 },
    { title: '认缴出资', dataIndex: 'subscribed', width: 150 },
    { title: '实缴出资', dataIndex: 'paid', width: 150 },
  ];
  const changeColumns: ColumnsType<BusinessChangeRow> = [
    { title: '变更日期', dataIndex: 'date', width: 130 },
    { title: '变更事项', dataIndex: 'item', width: 130 },
    { title: '变更前', dataIndex: 'before' },
    { title: '变更后', dataIndex: 'after' },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="工商信息" />
      <StatGrid items={moduleData.businessStats} />
      <div className="company-module-grid company-module-grid--two">
        <section className="company-table-card">
          <h3>股东与出资</h3>
          <Table columns={shareholderColumns} dataSource={moduleData.shareholders} pagination={false} rowKey="id" />
        </section>
        <section className="company-table-card">
          <h3>工商变更</h3>
          <Table columns={changeColumns} dataSource={moduleData.businessChanges} pagination={false} rowKey="id" />
        </section>
      </div>
      <Descriptions className="company-descriptions company-descriptions--compact" column={2} colon={false}>
        <Descriptions.Item label="登记机关">南通市市场监督管理局</Descriptions.Item>
        <Descriptions.Item label="企业类型">{company.companyType}</Descriptions.Item>
        <Descriptions.Item label="注册地址" span={2}>
          {company.address}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

function JudicialInfo({ moduleData }: { moduleData: CompanyModuleData }) {
  const columns: ColumnsType<JudicialRow> = [
    { title: '类型', dataIndex: 'type', width: 130 },
    { title: '事项名称', dataIndex: 'title' },
    { title: '日期', dataIndex: 'date', width: 130 },
    { title: '涉案金额', dataIndex: 'amount', width: 130 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => <Tag color={status === '已结案' ? 'green' : 'orange'}>{status}</Tag>,
    },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="司法信息" />
      <StatGrid items={moduleData.judicialStats} />
      <section className="company-table-card">
        <h3>司法风险明细</h3>
        <Table columns={columns} dataSource={moduleData.judicialCases} pagination={false} rowKey="id" />
      </section>
    </div>
  );
}

function OpinionInfo({ moduleData }: { moduleData: CompanyModuleData }) {
  const columns: ColumnsType<OpinionRow> = [
    { title: '舆情标题', dataIndex: 'title' },
    { title: '来源', dataIndex: 'source', width: 130 },
    { title: '发布日期', dataIndex: 'date', width: 130 },
    {
      title: '情绪',
      dataIndex: 'sentiment',
      width: 110,
      render: (sentiment) => {
        const color = sentiment === '正向' ? 'green' : sentiment === '风险' ? 'red' : 'blue';
        return <Tag color={color}>{sentiment}</Tag>;
      },
    },
    { title: '影响等级', dataIndex: 'influence', width: 110 },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="舆情信息" />
      <div className="company-module-grid company-module-grid--three">
        <MetricBlock label="正向舆情" value="12" note="近 90 天" />
        <MetricBlock label="风险舆情" value="1" note="需关注行业现金流" />
        <MetricBlock label="媒体热度" value="82" note="高于同业均值" />
      </div>
      <section className="company-table-card">
        <h3>舆情动态</h3>
        <Table columns={columns} dataSource={moduleData.opinions} pagination={false} rowKey="id" />
      </section>
    </div>
  );
}

function FinanceInfo({ moduleData }: { moduleData: CompanyModuleData }) {
  const columns: ColumnsType<FinanceRow> = [
    { title: '年度', dataIndex: 'year', width: 120 },
    { title: '营业收入', dataIndex: 'revenue' },
    { title: '净利润', dataIndex: 'profit' },
    { title: '毛利率', dataIndex: 'margin' },
    { title: '资产负债率', dataIndex: 'debtRatio' },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="财务信息" />
      <div className="company-module-grid company-module-grid--three">
        <MetricBlock label="收入 CAGR" value="13.2%" note="2023-2026E" />
        <MetricBlock label="净利率" value="11.7%" note="高于同业中位数" />
        <MetricBlock label="现金流质量" value="B+" note="回款周期需跟踪" />
      </div>
      <section className="company-table-card">
        <h3>财务指标</h3>
        <Table columns={columns} dataSource={moduleData.financeRows} pagination={false} rowKey="year" />
      </section>
      <div className="company-progress-list">
        <Progress percent={78} strokeColor="#1677ff" />
        <span>财报完整度：已覆盖利润表、资产负债表、现金流量表，缺少分客户收入拆分。</span>
      </div>
    </div>
  );
}

function TechInfo({
  company,
  moduleData,
}: {
  company: CompanyProfile;
  moduleData: CompanyModuleData;
}) {
  const columns: ColumnsType<TechRow> = [
    { title: '类型', dataIndex: 'type', width: 120 },
    { title: '名称', dataIndex: 'name' },
    { title: '数量', dataIndex: 'count', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => <Tag color={status === '进行中' ? 'blue' : 'green'}>{status}</Tag>,
    },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="技术信息" />
      <div className="company-tag-panel">
        {company.tags.map((tag) => (
          <Tag color="gold" key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
      <section className="company-table-card">
        <h3>技术资产</h3>
        <Table columns={columns} dataSource={moduleData.techRows} pagination={false} rowKey="id" />
      </section>
    </div>
  );
}

function TalentInfo({ moduleData }: { moduleData: CompanyModuleData }) {
  const columns: ColumnsType<TalentRow> = [
    { title: '角色', dataIndex: 'role', width: 180 },
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '背景', dataIndex: 'background' },
    {
      title: '稳定性',
      dataIndex: 'stability',
      width: 120,
      render: (stability) => <Tag color={stability === '稳定' ? 'green' : 'orange'}>{stability}</Tag>,
    },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="人才信息" />
      <div className="company-module-grid company-module-grid--three">
        <MetricBlock label="核心团队" value="18 人" note="研发与管理骨干" />
        <MetricBlock label="研发占比" value="36%" note="高于同业均值" />
        <MetricBlock label="招聘热度" value="中" note="算法、销售工程师扩招" />
      </div>
      <section className="company-table-card">
        <h3>核心人员</h3>
        <Table columns={columns} dataSource={moduleData.talentRows} pagination={false} rowKey="id" />
      </section>
    </div>
  );
}

function ChainInfo({
  company,
  moduleData,
}: {
  company: CompanyProfile;
  moduleData: CompanyModuleData;
}) {
  const columns: ColumnsType<ChainRow> = [
    { title: '产业链', dataIndex: 'node', width: 220 },
    { title: '链上位置', dataIndex: 'position', width: 160 },
    { title: '匹配产品/服务', dataIndex: 'matchedProducts' },
    { title: '投资价值', dataIndex: 'value', width: 150 },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="产业链信息" />
      <div className="company-chain-flow">
        <span>上游原材料</span>
        <strong>{company.shortName}</strong>
        <span>下游应用场景</span>
      </div>
      <section className="company-table-card">
        <h3>产业链匹配</h3>
        <Table columns={columns} dataSource={moduleData.chainRows} pagination={false} rowKey="id" />
      </section>
    </div>
  );
}

function CompanyEvaluation({
  company,
  moduleData,
}: {
  company: CompanyProfile;
  moduleData: CompanyModuleData;
}) {
  return (
    <div className="company-content">
      <section className="company-evaluation">
        <SectionTitle title="综合评价" />
        <div className="company-summary-scores">
          <div>
            <span>企业综合评价</span>
            <strong>{company.summaryScores.comprehensive}</strong>
          </div>
          <div>
            <span>企业科创评分</span>
            <strong>{company.summaryScores.innovation}</strong>
          </div>
          <div>
            <span>企业商机价值</span>
            <strong>{company.summaryScores.business}</strong>
          </div>
          <div>
            <span>企业触达价值</span>
            <strong>{company.summaryScores.reach}</strong>
          </div>
        </div>
        <div className="company-score-grid company-score-grid--detail">
          {company.scores.map((score) => (
            <div className="company-score-card" key={score.label}>
              <span>{score.label}</span>
              <strong>{score.grade}</strong>
              <small>{score.ranking}</small>
            </div>
          ))}
        </div>
        <section className="company-evaluation-summary">
          <h3>评价摘要</h3>
          <p>
            企业具备稳定经营基础和较强产业协同价值，技术资产和履约表现较好。
            财务端需继续关注回款周期，司法与舆情风险整体可控。
          </p>
          <Tag color="green">{moduleData.judicialStats[3].value}</Tag>
          <Tag color="blue">适合作为投前尽调候选企业</Tag>
        </section>
      </section>
    </div>
  );
}

function PeerInfo({ moduleData }: { moduleData: CompanyModuleData }) {
  const columns: ColumnsType<PeerRow> = [
    { title: '同业公司', dataIndex: 'name' },
    { title: '区域', dataIndex: 'region', width: 160 },
    { title: '综合评分', dataIndex: 'score', width: 120 },
    { title: '融资状态', dataIndex: 'financing', width: 120 },
    { title: '优势领域', dataIndex: 'advantage' },
  ];

  return (
    <div className="company-content">
      <SectionTitle title="同业公司" />
      <section className="company-table-card">
        <h3>同业对比</h3>
        <Table columns={columns} dataSource={moduleData.peers} pagination={false} rowKey="id" />
      </section>
    </div>
  );
}

function StatGrid({ items }: { items: CompanyStat[] }) {
  return (
    <div className="company-module-grid company-module-grid--four">
      {items.map((item) => (
        <MetricBlock key={item.label} label={item.label} note={item.note} value={item.value} />
      ))}
    </div>
  );
}

function MetricBlock({ label, note, value }: CompanyStat) {
  return (
    <article className="company-module-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="company-section-title">
      <span />
      {title}
    </h2>
  );
}
