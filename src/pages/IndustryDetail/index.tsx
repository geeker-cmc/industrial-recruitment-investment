import { Graph, NodeEvent } from '@antv/g6';
import type { GraphData, LayoutOptions, NodeData, TreeData } from '@antv/g6';
import { MindMap } from '@ant-design/graphs';
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  BranchesOutlined,
  BuildOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  GoldOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Descriptions,
  Drawer,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  companies,
  type CompanyProfile,
  type IndustryGraphNode,
  getCompanyList,
  getIndustryById,
  getIndustryOptions,
  toIndustryMindMapData,
  toStrengthGraphData,
} from '../../mock/industry';
import { useCompanyStore } from '../../stores/useCompanyStore';
import { useIndustryStore } from '../../stores/useIndustryStore';

type IndustryParams = {
  industryChainId: string;
};

type NodeTooltipState = {
  x: number;
  y: number;
  node: IndustryGraphNode;
};

type NodeHoverPayload = {
  localX: number;
  localY: number;
  containerRect: DOMRect;
};

type PointerLikeEvent = {
  clientX?: number;
  clientY?: number;
  canvasX?: number;
  canvasY?: number;
  viewportX?: number;
  viewportY?: number;
  client?: { x?: number; y?: number };
  canvas?: { x?: number; y?: number };
  viewport?: { x?: number; y?: number };
  nativeEvent?: { clientX?: number; clientY?: number };
  target?: { id?: string };
  originalTarget?: { id?: string };
  composedPath?: () => Array<{ id?: string }>;
};

const MIND_MAP_ANIMATION = { duration: 260 };
const MIND_MAP_CONTAINER_STYLE = { height: 760 };
const MIND_MAP_EDGE = {
  style: {
    lineWidth: 2.4,
    strokeOpacity: 0.5,
  },
};
const MIND_MAP_LAYOUT: LayoutOptions = {
  type: 'mindmap',
  getHGap: () => 82,
  getSubTreeSep: () => 38,
  getVGap: () => 18,
};

type EnterpriseDistributionRow = {
  id: string;
  index: number;
  company: CompanyProfile;
  district: string;
  chainNode: string;
  nationalIndustry: string;
  score: number;
  grade: string;
  market: string;
};

const distributionMetrics = [
  { key: 'all', label: '全部企业', value: '133,791', icon: <DatabaseOutlined /> },
  { key: 'listed', label: '上市企业', value: '110', icon: <BuildOutlined /> },
  { key: 'neeq', label: '新三板企业', value: '138', icon: <BarChartOutlined /> },
  { key: 'bond', label: '发债企业', value: '64', icon: <GoldOutlined /> },
  { key: 'funding', label: '私募融资企业', value: '391', icon: <FundProjectionScreenOutlined /> },
  { key: 'qualified', label: '资质认定企业', value: '9,230', icon: <TrophyOutlined /> },
];

const districtStats = [
  { name: '海淀区', value: 23171 },
  { name: '朝阳区', value: 14176 },
  { name: '通州区', value: 13247 },
  { name: '昌平区', value: 12711 },
  { name: '丰台区', value: 11936 },
];

const productDistribution = [
  { name: '电子设备及元器件经销', value: 42 },
  { name: '电脑与外围设备贸易', value: 18 },
  { name: '通信设备贸易', value: 16 },
  { name: '电子设备', value: 10 },
  { name: '仪器仪表', value: 8 },
  { name: '消费电子产品', value: 6 },
  { name: '通信系统', value: 5 },
  { name: '安防设备', value: 4 },
];

export default function IndustryDetailPage() {
  const navigate = useNavigate();
  const { industryChainId } = useParams<IndustryParams>();
  const setCurrentIndustryChainId = useIndustryStore(
    (state) => state.setCurrentIndustryChainId,
  );
  const industry = getIndustryById(industryChainId);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setCurrentIndustryChainId(industry.id);
  }, [industry.id, setCurrentIndustryChainId]);

  return (
    <main className="industry-detail-page">
      <header className="industry-detail-header">
        <div className="industry-detail-header__left">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/home')}
            type="text"
          >
            返回产业列表
          </Button>
          <Select
            className="industry-selector"
            options={getIndustryOptions()}
            onChange={(value) => navigate(`/industries/${value}`)}
            value={industry.id}
          />
        </div>
        <Space size={12}>
          <Button icon={<StarOutlined />}>关注</Button>
          <Button icon={<DownloadOutlined />} type="primary">
            下载报告
          </Button>
        </Space>
      </header>
      <Tabs
        activeKey={activeTab}
        className="detail-tabs"
        items={[
          {
            key: 'overview',
            label: '产业概况',
            children: <IndustryOverview industry={industry} />,
          },
          {
            key: 'map',
            label: '产业图谱',
            children: <IndustryMap industry={industry} />,
          },
          {
            key: 'strength',
            label: '产业链强弱分析',
            children: <IndustryStrengthAnalysis industry={industry} />,
          },
          {
            key: 'enterprise-distribution',
            label: '企业分布',
            children: <EnterpriseDistribution industry={industry} />,
          },
        ]}
        onChange={setActiveTab}
      />
    </main>
  );
}

function IndustryOverview({ industry }: { industry: ReturnType<typeof getIndustryById> }) {
  return (
    <section className="detail-panel">
      <article className="detail-section">
        <h2>
          <InfoCircleOutlined />
          产业链简介
        </h2>
        <p>{industry.definition}</p>
        <p>{industry.scope}</p>
      </article>
      <div className="overview-grid">
        <InfoCard title="核心环节" values={industry.coreLinks} />
        <InfoCard title="上游" values={industry.upstream} />
        <InfoCard title="中游" values={industry.midstream} />
        <InfoCard title="下游" values={industry.downstream} />
      </div>
      <div className="overview-split">
        <article className="detail-section">
          <h2>
            <FileTextOutlined />
            产业政策
          </h2>
          <ul className="news-list">
            {industry.policyItems.map((item) => (
              <li key={item}>
                <Tag color="blue">政策</Tag>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="detail-section">
          <h2>
            <BarChartOutlined />
            产业新闻
          </h2>
          <ul className="news-list">
            {industry.newsItems.map((item) => (
              <li key={item}>
                <Tag color="cyan">新闻</Tag>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function InfoCard({ title, values }: { title: string; values: string[] }) {
  return (
    <article className="overview-card">
      <h3>{title}</h3>
      <div>
        {values.map((value) => (
          <Tag key={value}>{value}</Tag>
        ))}
      </div>
    </article>
  );
}

function IndustryMap({ industry }: { industry: ReturnType<typeof getIndustryById> }) {
  const [tooltip, setTooltip] = useState<NodeTooltipState | null>(null);
  const [drawerCompany, setDrawerCompany] = useState<CompanyProfile | null>(null);
  const graphShellRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | undefined>();
  const registeredMindMapRef = useRef<Graph | null>(null);
  const setCurrentCompanyId = useCompanyStore((state) => state.setCurrentCompanyId);
  const navigate = useNavigate();

  const mindMapData = useMemo(() => toIndustryMindMapData(industry), [industry]);

  const closeTooltipSoon = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setTooltip(null), 160);
  }, []);

  const openCompanyDrawer = (company: CompanyProfile) => {
    setCurrentCompanyId(company.id);
    setDrawerCompany(company);
  };

  const handleNodeMove = useCallback(
    (event: NodeHoverPayload, node: IndustryGraphNode) => {
      if (node.companyIds.length === 0) return;
      const rect = event.containerRect;
      const position = getTooltipPosition(event.localX, event.localY, rect, node.companyIds.length);
      window.clearTimeout(hideTimerRef.current);
      setTooltip({
        x: position.x,
        y: position.y,
        node,
      });
    },
    [],
  );

  const handleMindMapReady = useCallback(
    (graph: Graph) => {
      if (graph.destroyed) return;
      if (registeredMindMapRef.current === graph) return;
      registeredMindMapRef.current = graph;

      const handlePointer = (event: unknown) => {
        const pointerEvent = event as PointerLikeEvent;
        const node = getNodeDataFromPointerEvent(graph, pointerEvent);
        const nodeData = node ? toIndustryGraphNode(node) : undefined;
        const containerRect = graphShellRef.current?.getBoundingClientRect();
        if (!nodeData || !containerRect) return;

        const pointerPosition = getLocalPointerPosition(pointerEvent, containerRect);
        handleNodeMove(
          {
            localX: pointerPosition.x,
            localY: pointerPosition.y,
            containerRect,
          },
          nodeData,
        );
      };

      graph.on(NodeEvent.POINTER_ENTER, handlePointer);
      graph.on(NodeEvent.POINTER_MOVE, handlePointer);
      graph.on(NodeEvent.POINTER_LEAVE, closeTooltipSoon);
      void graph.zoomTo(1).then(async () => {
        if (graph.destroyed) return;
        await graph.fitCenter();
        if (!graph.destroyed) await graph.translateBy([150, 0]);
      });
    },
    [closeTooltipSoon, handleNodeMove],
  );

  return (
    <section className="detail-panel industry-map-layout">
      <div className="map-workspace">
        <div className="section-title-row">
          <h2>
            <BranchesOutlined />
            产业链图谱
          </h2>
          <span>当前节点：全部节点</span>
        </div>
        <div className="graph-shell" ref={graphShellRef}>
          <IndustryMindMapCanvas data={mindMapData} onReady={handleMindMapReady} />
          {tooltip ? (
            <div
              className="company-tooltip"
              onMouseEnter={() => window.clearTimeout(hideTimerRef.current)}
              onMouseLeave={closeTooltipSoon}
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {getCompanyList(tooltip.node.companyIds)
                .slice(0, 10)
                .map((company, index) => (
                  <button
                    key={company.id}
                    onClick={() => openCompanyDrawer(company)}
                    type="button"
                  >
                    <span>{index + 1}</span>
                    <strong>{company.name}</strong>
                  </button>
                ))}
              <button className="company-tooltip__more" type="button">
                查看更多
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <aside className="trend-panel">
        <h2>
          <FundProjectionScreenOutlined />
          产业发展趋势
        </h2>
        <TrendCharts industry={industry} />
      </aside>
      <Drawer
        className="company-profile-drawer"
        onClose={() => setDrawerCompany(null)}
        open={Boolean(drawerCompany)}
        title="客户营销画像"
        width={760}
      >
        {drawerCompany ? (
          <CompanyDrawerContent
            company={drawerCompany}
            onDetail={() => {
              setCurrentCompanyId(drawerCompany.id);
              navigate(`/companies/${drawerCompany.id}`);
            }}
          />
        ) : null}
      </Drawer>
    </section>
  );
}

const IndustryMindMapCanvas = memo(function IndustryMindMapCanvas({
  data,
  onReady,
}: {
  data: TreeData;
  onReady: (graph: Graph) => void;
}) {
  return (
    <MindMap
      animation={MIND_MAP_ANIMATION}
      autoFit="center"
      className="industry-mind-map"
      containerStyle={MIND_MAP_CONTAINER_STYLE}
      data={data}
      defaultExpandLevel={6}
      direction="right"
      edge={MIND_MAP_EDGE}
      labelField="label"
      layout={MIND_MAP_LAYOUT}
      nodeMaxWidth={220}
      nodeMinWidth={124}
      onReady={onReady}
      padding={72}
      type="boxed"
    />
  );
});

function TrendCharts({ industry }: { industry: ReturnType<typeof getIndustryById> }) {
  const years = ['2022', '2023', '2024', '2025', '2026'];
  const enterpriseOption = {
    grid: { top: 22, right: 10, bottom: 30, left: 54 },
    tooltip: {},
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: industry.trend.enterpriseCount,
        itemStyle: { color: '#2584ff' },
        barWidth: 28,
      },
    ],
  };
  const revenueOption = {
    grid: { top: 24, right: 18, bottom: 30, left: 50 },
    tooltip: {},
    xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025'] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: industry.trend.revenue,
        itemStyle: { color: '#2584ff' },
        barWidth: 26,
      },
      {
        type: 'line',
        data: [30, 120, 180, 780, 220],
        yAxisIndex: 0,
        smooth: true,
        itemStyle: { color: '#f7bd3a' },
      },
    ],
  };
  const financingOption = {
    tooltip: {},
    legend: { orient: 'vertical', right: 0, top: 20 },
    series: [
      {
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['35%', '50%'],
        data: industry.trend.financing.map((item) => ({
          name: item.round,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  return (
    <div className="trend-charts">
      <h3>企业数量趋势</h3>
      <ReactECharts option={enterpriseOption} style={{ height: 210 }} />
      <h3>营业收入趋势</h3>
      <ReactECharts option={revenueOption} style={{ height: 230 }} />
      <h3>投融资轮次分布情况</h3>
      <ReactECharts option={financingOption} style={{ height: 240 }} />
    </div>
  );
}

function CompanyDrawerContent({
  company,
  onDetail,
}: {
  company: CompanyProfile;
  onDetail: () => void;
}) {
  return (
    <div className="drawer-profile">
      <div className="drawer-profile__top">
        <div>
          <h2>{company.name}</h2>
          <div className="drawer-profile__tags">
            {company.tags.map((tag) => (
              <Tag color="gold" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <Button onClick={onDetail} type="link">
          查看企业洞察详情
        </Button>
      </div>
      <div className="risk-ribbon">风险提示：{company.riskSummary}</div>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="法定代表人">{company.legalPerson}</Descriptions.Item>
        <Descriptions.Item label="成立日期">{company.establishedDate}</Descriptions.Item>
        <Descriptions.Item label="注册资本">{company.registeredCapital}</Descriptions.Item>
        <Descriptions.Item label="联系方式">{company.contact}</Descriptions.Item>
        <Descriptions.Item label="联系地址" span={2}>
          {company.address}
        </Descriptions.Item>
        <Descriptions.Item label="所属重点产业链" span={2}>
          {company.industries.map((item) => (
            <Tag color="blue" key={item}>
              {item}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="所属国标行业" span={2}>
          {company.nationalIndustry}
        </Descriptions.Item>
      </Descriptions>
      <div className="drawer-score-section">
        <h3>企业综合得分</h3>
        <div className="company-score-grid">
          {company.scores.map((score) => (
            <div className="company-score-card" key={score.label}>
              <span>{score.label}</span>
              <strong>{score.grade}</strong>
              <small>{score.ranking}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnterpriseDistribution({
  industry,
}: {
  industry: ReturnType<typeof getIndustryById>;
}) {
  const [keyword, setKeyword] = useState('');
  const [drawerCompany, setDrawerCompany] = useState<CompanyProfile | null>(null);
  const navigate = useNavigate();
  const setCurrentCompanyId = useCompanyStore((state) => state.setCurrentCompanyId);

  const rows = useMemo<EnterpriseDistributionRow[]>(
    () =>
      companies.slice(3, 13).map((company, index) => ({
        id: company.id,
        index: index + 1,
        company,
        district: [
          '北京市-北京市-海淀区',
          '北京市-北京市-大兴区',
          '北京市-北京市-朝阳区',
          '北京市-北京市-顺义区',
          '北京市-北京市-昌平区',
        ][index % 5],
        chainNode: [
          '电子设备及元器件经销，电脑与外围设备贸易，通信设备贸易，销售渠道、应用场景',
          '生产设备，原材料，设计、加工，IC生产设备',
          '有线通信系统，通信系统，电子设备、仪器，通信设备',
          '应用电子仪器及设备，电子设备、仪器',
        ][index % 4],
        nationalIndustry: company.nationalIndustry,
        score: 539 - index * 4,
        grade: index === 1 ? 'S' : 'A',
        market: index % 3 === 0 ? '--' : index % 3 === 1 ? '科创板:688' : '新三板:873',
      })),
    [],
  );

  const filteredRows = useMemo(() => {
    const value = keyword.trim();
    if (!value) return rows;
    return rows.filter((row) => row.company.name.includes(value));
  }, [keyword, rows]);

  const productOption = useMemo(
    () => ({
      tooltip: {},
      series: [
        {
          type: 'treemap',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          label: {
            show: true,
            color: '#ffffff',
            fontWeight: 700,
          },
          upperLabel: { show: false },
          itemStyle: {
            borderColor: '#9cc0ff',
            borderWidth: 1,
            gapWidth: 1,
          },
          data: productDistribution.map((item, index) => ({
            ...item,
            itemStyle: {
              color: ['#2554a3', '#4f8df4', '#6fa3f9', '#9cbbef', '#b4caf4'][
                Math.min(index, 4)
              ],
            },
          })),
        },
      ],
    }),
    [],
  );

  const openCompanyDrawer = (company: CompanyProfile) => {
    setCurrentCompanyId(company.id);
    setDrawerCompany(company);
  };

  const columns: ColumnsType<EnterpriseDistributionRow> = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 76,
      align: 'center',
    },
    {
      title: '公司名称',
      dataIndex: ['company', 'name'],
      width: 250,
      render: (_, row) => (
        <button
          className="company-name-button"
          onClick={() => openCompanyDrawer(row.company)}
          type="button"
        >
          {row.company.name}
        </button>
      ),
    },
    {
      title: '公司所在地',
      dataIndex: 'district',
      width: 220,
    },
    {
      title: '产业链节点',
      dataIndex: 'chainNode',
      width: 240,
    },
    {
      title: '国标行业',
      dataIndex: 'nationalIndustry',
      width: 340,
    },
    {
      title: '综合评分信息',
      dataIndex: 'score',
      width: 170,
      render: (score, row) => (
        <span className="company-score-inline">
          {score}
          <Tag color="blue">{row.grade}</Tag>
        </span>
      ),
    },
    {
      title: '交易市场',
      dataIndex: 'market',
      width: 140,
    },
    {
      title: '营销管理',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, row) => (
        <Space size={12}>
          <Button onClick={() => openCompanyDrawer(row.company)} type="link">
            加潜客
          </Button>
          <Button type="link">关注</Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="detail-panel enterprise-distribution-panel">
      <div className="distribution-toolbar">
        <Select
          className="distribution-select"
          options={[{ label: '北京市', value: 'beijing' }]}
          value="beijing"
        />
        <Select
          className="distribution-select distribution-select--wide"
          options={industry.graphNodes
            .filter((node) => node.id !== `${industry.id}-root`)
            .slice(0, 8)
            .map((node) => ({ label: node.label, value: node.id }))}
          placeholder="请选择产业链节点"
        />
      </div>
      <div className="distribution-metrics">
        {distributionMetrics.map((metric, index) => (
          <article
            className={`distribution-metric ${index === 0 ? 'is-active' : ''}`}
            key={metric.key}
          >
            <span>{metric.icon}</span>
            <div>
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
            </div>
          </article>
        ))}
      </div>
      <div className="distribution-overview">
        <article className="distribution-card distribution-map-card">
          <h2>
            <TeamOutlined />
            产业地图
          </h2>
          <BeijingDistributionMap />
        </article>
        <article className="distribution-card distribution-side-card">
          <h2>产品分布</h2>
          <ReactECharts option={productOption} style={{ height: 270 }} />
          <h2>区域排行</h2>
          <div className="district-ranking">
            {districtStats.map((item, index) => (
              <div className="district-ranking__item" key={item.name}>
                <span>{index + 1}</span>
                <strong>{item.name}</strong>
                <div>
                  <i style={{ width: `${Math.max(26, (item.value / 23171) * 100)}%` }} />
                </div>
                <em>{item.value.toLocaleString()}</em>
              </div>
            ))}
          </div>
        </article>
      </div>
      <article className="distribution-card enterprise-list-card">
        <div className="distribution-section-title">
          <h2>
            <TeamOutlined />
            企业名单
          </h2>
          <Space>
            <Button icon={<UploadOutlined />} type="link">
              批量导出
            </Button>
            <Button icon={<EditOutlined />} type="link">
              自定义字段
            </Button>
          </Space>
        </div>
        <div className="enterprise-filters">
          <label>
            企业名称：
            <Input
              allowClear
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="请输入企业名称关键字"
              prefix={<SearchOutlined />}
              value={keyword}
            />
          </label>
          <label>
            地区：
            <Select options={[{ label: '北京市', value: 'beijing' }]} value="beijing" />
          </label>
          <label>
            资质标签：
            <Select placeholder="请选择资质" />
          </label>
          <label>
            国标行业：
            <Input placeholder="国标分类" />
          </label>
          <div className="enterprise-filter-row">
            <span>成立日期：</span>
            {['1年内', '1-3年', '3-5年', '5-10年', '10年以上'].map((item) => (
              <Button key={item}>{item}</Button>
            ))}
          </div>
          <div className="enterprise-filter-row">
            <span>企业综合评分：</span>
            {['A', 'B', 'C', 'D', 'E'].map((item) => (
              <Button key={item}>{item}</Button>
            ))}
          </div>
        </div>
        <Table<EnterpriseDistributionRow>
          columns={columns}
          dataSource={filteredRows}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: () => '共 133791 条',
          }}
          rowKey="id"
          scroll={{ x: 1600 }}
        />
      </article>
      <Drawer
        className="company-profile-drawer"
        onClose={() => setDrawerCompany(null)}
        open={Boolean(drawerCompany)}
        title="客户营销画像"
        width={760}
      >
        {drawerCompany ? (
          <CompanyDrawerContent
            company={drawerCompany}
            onDetail={() => {
              setCurrentCompanyId(drawerCompany.id);
              navigate(`/companies/${drawerCompany.id}`);
            }}
          />
        ) : null}
      </Drawer>
    </section>
  );
}

function BeijingDistributionMap() {
  return (
    <div className="beijing-map">
      <svg aria-label="北京市企业分布示意图" viewBox="0 0 640 520">
        <path className="district district--light" d="M122 312 62 368 86 450 192 470 234 404 206 332Z" />
        <path className="district district--mid" d="M206 332 234 404 330 390 342 314 276 268Z" />
        <path className="district district--dark" d="M276 268 342 314 418 298 436 214 354 172 286 202Z" />
        <path className="district district--mid" d="M354 172 436 214 538 174 542 90 432 56 356 88Z" />
        <path className="district district--light" d="M202 188 286 202 356 88 286 40 192 86 150 146Z" />
        <path className="district district--mid" d="M418 298 330 390 376 476 520 454 582 350 520 290Z" />
        <path className="district district--deep" d="M234 404 192 470 278 506 376 476 330 390Z" />
        <path className="district district--light" d="M62 368 122 312 150 146 72 180 28 266Z" />
        <text x="214" y="238">海淀区</text>
        <text x="314" y="286">昌平区</text>
        <text x="432" y="178">密云区</text>
        <text x="174" y="398">门头沟区</text>
        <text x="394" y="380">朝阳区</text>
        <text x="292" y="448">丰台区</text>
      </svg>
      <div className="beijing-map__legend">
        <span>高</span>
        <i />
        <strong>23,171</strong>
      </div>
    </div>
  );
}

function IndustryStrengthAnalysis({
  industry,
}: {
  industry: ReturnType<typeof getIndustryById>;
}) {
  const graphData = useMemo(() => toStrengthGraphData(industry), [industry]);

  return (
    <section className="detail-panel">
      <div className="section-title-row">
        <h2>
          <BranchesOutlined />
          产业链强补延图谱
        </h2>
        <Checkbox.Group
          defaultValue={['补链建议环节', '强链建议环节']}
          options={['补链建议环节', '强链建议环节']}
        />
      </div>
      <div className="strength-legend">
        <span className="legend-dot strong" /> 强节点
        <span className="legend-dot middle" /> 中节点
        <span className="legend-dot weak" /> 弱节点
        <span className="legend-dot empty" /> 空节点
      </div>
      <div className="graph-shell strength-graph">
        <G6Graph data={graphData} height={720} />
      </div>
    </section>
  );
}

function G6Graph({
  data,
  edgeType = 'polyline',
  height,
  layout,
}: {
  data: GraphData;
  edgeType?: 'polyline' | 'cubic-horizontal';
  height: number;
  layout?: LayoutOptions;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const container = containerRef.current;
    const graph = new Graph({
      container,
      width: container.clientWidth,
      height,
      data,
      animation: false,
      autoFit: 'view',
      padding: 40,
      layout,
      node: {
        type: 'rect',
      },
      edge: {
        type: edgeType,
      },
      behaviors: ['drag-canvas', 'zoom-canvas'],
    });

    void graph.render();

    return () => {
      graph.destroy();
    };
  }, [data, edgeType, height, layout]);

  return <div className="g6-graph" ref={containerRef} style={{ height }} />;
}

function getNodeDataFromPointerEvent(graph: Graph, event: PointerLikeEvent) {
  const targetIds = [
    event.target?.id,
    event.originalTarget?.id,
    ...(event.composedPath?.().map((target) => target.id) ?? []),
  ].filter((nodeId): nodeId is string => typeof nodeId === 'string' && nodeId.length > 0);

  for (const nodeId of targetIds) {
    try {
      return graph.getNodeData(nodeId) as NodeData;
    } catch {
      // G6 can report the inner shape id first; keep walking the event path.
    }
  }

  return undefined;
}

function toIndustryGraphNode(node: NodeData): IndustryGraphNode | undefined {
  const topLevelNode = node as NodeData & Partial<IndustryGraphNode>;
  const payload = (node.data ?? {}) as Partial<IndustryGraphNode>;
  const id = typeof topLevelNode.id === 'string' ? topLevelNode.id : payload.id;
  const label =
    typeof topLevelNode.label === 'string'
      ? topLevelNode.label
      : typeof payload.label === 'string'
        ? payload.label
        : id;
  const companyIds = Array.isArray(topLevelNode.companyIds)
    ? topLevelNode.companyIds
    : Array.isArray(payload.companyIds)
      ? payload.companyIds
      : [];

  if (!id || !label) return undefined;

  return {
    id,
    label,
    companyIds,
  };
}

function getLocalPointerPosition(event: PointerLikeEvent, containerRect: DOMRect) {
  const browserPoint =
    getPointFromValues(event.nativeEvent?.clientX, event.nativeEvent?.clientY) ??
    getPointFromValues(event.clientX, event.clientY);

  if (browserPoint) {
    return {
      x: browserPoint.x - containerRect.left,
      y: browserPoint.y - containerRect.top,
    };
  }

  const candidates = [
    getPoint(event.client),
    getPoint(event.viewport),
    getPointFromValues(event.viewportX, event.viewportY),
    getPoint(event.canvas),
    getPointFromValues(event.canvasX, event.canvasY),
  ];

  for (const point of candidates) {
    if (!point) continue;
    if (point.x <= containerRect.width + 48 && point.y <= containerRect.height + 48) {
      return point;
    }

    return {
      x: point.x - containerRect.left,
      y: point.y - containerRect.top,
    };
  }

  if (
    typeof event.nativeEvent?.clientX === 'number' &&
    typeof event.nativeEvent.clientY === 'number'
  ) {
    return {
      x: event.nativeEvent.clientX - containerRect.left,
      y: event.nativeEvent.clientY - containerRect.top,
    };
  }

  return {
    x: containerRect.width / 2,
    y: containerRect.height / 2,
  };
}

function getTooltipPosition(
  pointerX: number,
  pointerY: number,
  containerRect: DOMRect,
  companyCount: number,
) {
  const gap = 12;
  const padding = 12;
  const tooltipWidth = 360;
  const visibleCompanyCount = Math.min(companyCount, 10);
  const tooltipHeight = Math.min(420, 58 + visibleCompanyCount * 48);
  const maxX = Math.max(padding, containerRect.width - tooltipWidth - padding);
  const maxY = Math.max(padding, containerRect.height - tooltipHeight - padding);
  let x = pointerX + gap;
  let y = pointerY + gap;

  if (x + tooltipWidth > containerRect.width - padding) {
    x = pointerX - tooltipWidth - gap;
  }

  if (y + tooltipHeight > containerRect.height - padding) {
    y = pointerY - tooltipHeight - gap;
  }

  return {
    x: Math.min(Math.max(x, padding), maxX),
    y: Math.min(Math.max(y, padding), maxY),
  };
}

function getPoint(point?: { x?: number; y?: number }) {
  return getPointFromValues(point?.x, point?.y);
}

function getPointFromValues(x?: number, y?: number) {
  if (typeof x !== 'number' || typeof y !== 'number') return undefined;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  return { x, y };
}
