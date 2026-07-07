import { Graph, NodeEvent } from '@antv/g6';
import type { GraphData, LayoutOptions, NodeData, TreeData } from '@antv/g6';
import { MindMap } from '@ant-design/graphs';
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  BranchesOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  InfoCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Descriptions,
  Drawer,
  Select,
  Space,
  Tabs,
  Tag,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
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
