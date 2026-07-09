import { Graph } from '@antv/g6';
import type { GraphData, LayoutOptions } from '@antv/g6';
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
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  companies,
  type ChainNodeStatus,
  type CompanyProfile,
  type IndustryGraphNode,
  type IndustryMindMapNode,
  getCompanyList,
  getIndustryById,
  getIndustryOptions,
  toStrengthGraphData,
} from '../../mock/industry';
import beijingGeoJson from '../../assets/maps/beijing.json';
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

type SankeyStatusStyle = {
  color: string;
  textColor: string;
  linkColor: string;
};

type IndustrySankeyNode = {
  name: string;
  displayName: string;
  companyIds: string[];
  depth: number;
  nodeStatus: ChainNodeStatus;
  itemStyle: { color: string; borderColor: string; borderWidth: number };
  label: {
    formatter: string;
    color: string;
    backgroundColor: string;
    borderRadius: number;
    fontSize: number;
    fontWeight: number;
    padding: number[];
  };
};

type IndustrySankeyLink = {
  source: string;
  target: string;
  value: number;
  lineStyle: { color: string; opacity: number; curveness: number };
};

type SankeyChartData = {
  nodes: IndustrySankeyNode[];
  links: IndustrySankeyLink[];
};

type SankeyMouseEvent = {
  dataType?: string;
  data?: Partial<IndustrySankeyNode>;
  event?: {
    offsetX?: number;
    offsetY?: number;
    clientX?: number;
    clientY?: number;
    event?: {
      offsetX?: number;
      offsetY?: number;
      clientX?: number;
      clientY?: number;
    };
  };
};

const sankeyStatusStyles: Record<ChainNodeStatus, SankeyStatusStyle> = {
  strong: { color: '#ff563d', textColor: '#ffffff', linkColor: '#dcdfe5' },
  middle: { color: '#ffa000', textColor: '#ffffff', linkColor: '#e3e5ea' },
  weak: { color: '#1677ff', textColor: '#ffffff', linkColor: '#dfe5ef' },
  empty: { color: '#a6a9ae', textColor: '#ffffff', linkColor: '#e6e8ec' },
};

const sankeyLegendItems: Array<{ label: string; status: ChainNodeStatus }> = [
  { label: '强节点', status: 'strong' },
  { label: '中节点', status: 'middle' },
  { label: '弱节点', status: 'weak' },
  { label: '空节点', status: 'empty' },
];

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

type EChartsFormatterParam = {
  name?: string;
  value?: number | string;
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

const beijingDistrictMapData = [
  { name: '东城区', value: 9340 },
  { name: '西城区', value: 9660 },
  { name: '朝阳区', value: 14176 },
  { name: '丰台区', value: 11936 },
  { name: '石景山区', value: 8840 },
  { name: '海淀区', value: 23171 },
  { name: '门头沟区', value: 9420 },
  { name: '房山区', value: 8410 },
  { name: '通州区', value: 13247 },
  { name: '顺义区', value: 10860 },
  { name: '昌平区', value: 12711 },
  { name: '大兴区', value: 11280 },
  { name: '怀柔区', value: 6550 },
  { name: '平谷区', value: 6980 },
  { name: '密云区', value: 6120 },
  { name: '延庆区', value: 5980 },
];

const BEIJING_ENTERPRISE_MAP_NAME = 'beijing-enterprise-distribution';
const hiddenBeijingMapLabels = new Set(['东城区', '西城区', '石景山区']);

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
  const setCurrentCompanyId = useCompanyStore((state) => state.setCurrentCompanyId);
  const navigate = useNavigate();

  const sankeyData = useMemo(() => toIndustrySankeyData(industry), [industry]);
  const sankeyOption = useMemo(() => createSankeyOption(sankeyData), [sankeyData]);

  const closeTooltipSoon = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setTooltip(null), 160);
  }, []);

  const openCompanyDrawer = (company: CompanyProfile) => {
    setCurrentCompanyId(company.id);
    setDrawerCompany(company);
  };

  const showSankeyTooltip = useCallback((params: SankeyMouseEvent) => {
    const node = params.data;
    const rect = graphShellRef.current?.getBoundingClientRect();
    if (params.dataType !== 'node' || !node?.name || !rect) return;
    if (!node.companyIds || node.companyIds.length === 0 || node.depth === 0) {
      closeTooltipSoon();
      return;
    }

    const pointerPosition = getSankeyPointerPosition(params, rect);
    const position = getTooltipPosition(
      pointerPosition.x,
      pointerPosition.y,
      rect,
      node.companyIds.length,
    );

    window.clearTimeout(hideTimerRef.current);
    setTooltip({
      x: position.x,
      y: position.y,
      node: {
        id: node.name,
        label: node.displayName ?? node.name,
        companyIds: node.companyIds,
      },
    });
  }, [closeTooltipSoon]);

  const sankeyEvents = useMemo(
    () => ({
      mouseover: showSankeyTooltip,
      mousemove: showSankeyTooltip,
      mouseout: closeTooltipSoon,
      globalout: closeTooltipSoon,
    }),
    [closeTooltipSoon, showSankeyTooltip],
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
          <div className="sankey-legend" aria-label="节点强弱图例">
            {sankeyLegendItems.map((item) => (
              <span key={item.status}>
                <i style={{ background: sankeyStatusStyles[item.status].color }} />
                {item.label}
              </span>
            ))}
            <Checkbox>补链建议环节</Checkbox>
            <Checkbox>延链建议环节</Checkbox>
          </div>
          <ReactECharts
            className="industry-sankey-chart"
            notMerge
            onEvents={sankeyEvents}
            option={sankeyOption}
            style={{ height: 700 }}
          />
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

function createSankeyOption(data: SankeyChartData) {
  return {
    backgroundColor: 'transparent',
    animationDuration: 450,
    tooltip: { show: false },
    series: [
      {
        type: 'sankey',
        data: data.nodes,
        links: data.links,
        left: 18,
        right: 28,
        top: 26,
        bottom: 18,
        nodeWidth: 12,
        nodeGap: 16,
        draggable: false,
        layoutIterations: 72,
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            opacity: 0.28,
          },
        },
        lineStyle: {
          color: '#e2e5ea',
          opacity: 0.58,
          curveness: 0.52,
        },
      },
    ],
  };
}

function toIndustrySankeyData(industry: ReturnType<typeof getIndustryById>): SankeyChartData {
  const nodes: IndustrySankeyNode[] = [];
  const links: IndustrySankeyLink[] = [];
  const visited = new Set<string>();

  const walk = (node: IndustryMindMapNode, depth: number, parentId?: string) => {
    const displayName = depth === 0 ? industry.name : node.label;
    const companyIds = getSankeyCompanyIds(node, depth);
    const nodeStatus = getSankeyNodeStatus(node, depth);
    const style = sankeyStatusStyles[nodeStatus];

    if (!visited.has(node.id)) {
      visited.add(node.id);
      nodes.push({
        name: node.id,
        displayName,
        companyIds,
        depth,
        nodeStatus,
        itemStyle: {
          color: style.color,
          borderColor: style.color,
          borderWidth: 1,
        },
        label: {
          formatter: displayName,
          color: style.textColor,
          backgroundColor: style.color,
          borderRadius: 3,
          fontSize: depth <= 1 ? 13 : 12,
          fontWeight: 700,
          padding: [3, 7],
        },
      });
    }

    if (parentId) {
      links.push({
        source: parentId,
        target: node.id,
        value: getSankeyWeight(node),
        lineStyle: {
          color: '#dfe2e8',
          opacity: 0.56,
          curveness: 0.52,
        },
      });
    }

    (node.children as IndustryMindMapNode[] | undefined)?.forEach((child) =>
      walk(child, depth + 1, node.id),
    );
  };

  walk(industry.graphTree, 0);

  return { nodes, links };
}

function getSankeyNodeStatus(node: IndustryMindMapNode, depth: number): ChainNodeStatus {
  if (depth === 0) return 'empty';
  if (depth === 1) return 'middle';
  if (node.companyIds.length >= 2) return 'strong';
  if (node.companyIds.length === 1) return 'weak';
  if (depth === 2) return 'middle';
  return 'empty';
}

function getSankeyCompanyIds(node: IndustryMindMapNode, depth: number) {
  if (node.companyIds.length > 0) return node.companyIds;
  if (depth === 0 || companies.length === 0) return [];

  const companyIds = companies.map((company) => company.id);
  const offset =
    node.id.split('').reduce((total, char) => total + char.charCodeAt(0), 0) %
    companyIds.length;

  return companyIds.map((_, index) => companyIds[(offset + index) % companyIds.length]);
}

function getSankeyWeight(node: IndustryMindMapNode): number {
  const children = node.children as IndustryMindMapNode[] | undefined;
  if (!children || children.length === 0) return 1;
  return Math.max(
    1,
    children.reduce((total, child) => total + getSankeyWeight(child), 0),
  );
}

function getSankeyPointerPosition(params: SankeyMouseEvent, containerRect: DOMRect) {
  const event = params.event;
  const browserEvent = event?.event;
  const offsetPoint =
    getPointFromValues(event?.offsetX, event?.offsetY) ??
    getPointFromValues(browserEvent?.offsetX, browserEvent?.offsetY);

  if (offsetPoint) return offsetPoint;

  const clientPoint =
    getPointFromValues(event?.clientX, event?.clientY) ??
    getPointFromValues(browserEvent?.clientX, browserEvent?.clientY);

  if (clientPoint) {
    return {
      x: clientPoint.x - containerRect.left,
      y: clientPoint.y - containerRect.top,
    };
  }

  return {
    x: containerRect.width / 2,
    y: containerRect.height / 2,
  };
}

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
  if (!echarts.getMap(BEIJING_ENTERPRISE_MAP_NAME)) {
    echarts.registerMap(
      BEIJING_ENTERPRISE_MAP_NAME,
      beijingGeoJson as Parameters<typeof echarts.registerMap>[1],
    );
  }

  const mapOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        borderWidth: 0,
        padding: [8, 12],
        formatter: (params: EChartsFormatterParam) => {
          const value = Number(params.value ?? 0);
          return `${params.name}<br/>企业数量：${value.toLocaleString()}`;
        },
      },
      visualMap: {
        min: 5800,
        max: 23171,
        left: 8,
        bottom: 22,
        orient: 'vertical',
        itemWidth: 22,
        itemHeight: 86,
        text: ['高', '23,171'],
        textGap: 10,
        calculable: false,
        inRange: {
          color: ['#bcd4fb', '#6fa3f5', '#1f5aa6'],
        },
        textStyle: {
          color: '#334155',
          fontSize: 14,
          fontWeight: 700,
        },
      },
      series: [
        {
          name: '企业数量',
          type: 'map',
          map: BEIJING_ENTERPRISE_MAP_NAME,
          roam: false,
          selectedMode: false,
          layoutCenter: ['52%', '50%'],
          layoutSize: '98%',
          aspectScale: 0.92,
          data: beijingDistrictMapData,
          label: {
            show: true,
            formatter: (params: EChartsFormatterParam) =>
              hiddenBeijingMapLabels.has(params.name ?? '') ? '' : params.name,
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 800,
            textBorderColor: 'rgba(30, 41, 59, 0.45)',
            textBorderWidth: 3,
          },
          labelLayout: {
            hideOverlap: true,
          },
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 3,
            shadowBlur: 12,
            shadowColor: 'rgba(24, 83, 160, 0.18)',
          },
          emphasis: {
            label: {
              show: true,
              color: '#ffffff',
              fontWeight: 800,
            },
            itemStyle: {
              areaColor: '#1f6fe5',
              borderColor: '#ffffff',
              borderWidth: 3,
            },
          },
        },
      ],
    }),
    [],
  );

  return (
    <div className="beijing-map">
      <ReactECharts className="beijing-map__chart" option={mapOption} />
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

function getPointFromValues(x?: number, y?: number) {
  if (typeof x !== 'number' || typeof y !== 'number') return undefined;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  return { x, y };
}
