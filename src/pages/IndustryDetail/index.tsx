import { Graph, NodeEvent } from '@antv/g6';
import type { GraphData, LayoutOptions, NodeData } from '@antv/g6';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type CompanyProfile,
  type IndustryGraphNode,
  getCompanyList,
  getIndustryById,
  getIndustryOptions,
  toIndustryGraphData,
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
  const hideTimerRef = useRef<number | undefined>();
  const setCurrentCompanyId = useCompanyStore((state) => state.setCurrentCompanyId);
  const navigate = useNavigate();

  const graphData = useMemo(() => toIndustryGraphData(industry), [industry]);
  const mindMapLayout = useMemo<LayoutOptions>(
    () => ({
      type: 'mindmap',
      direction: 'LR',
      getWidth: () => 148,
      getHeight: () => 34,
      getHGap: () => 64,
      getVGap: () => 16,
      getSubTreeSep: () => 20,
    }),
    [],
  );

  const closeTooltipSoon = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setTooltip(null), 160);
  }, []);

  const openCompanyDrawer = (company: CompanyProfile) => {
    setCurrentCompanyId(company.id);
    setDrawerCompany(company);
  };

  const handleNodeMove = useCallback(
    (event: { clientX: number; clientY: number; containerRect: DOMRect }, node: IndustryGraphNode) => {
      if (node.companyIds.length === 0) return;
      const rect = event.containerRect;
      setTooltip({
        x: Math.min(event.clientX - rect.left + 16, rect.width - 300),
        y: Math.max(event.clientY - rect.top - 26, 16),
        node,
      });
    },
    [],
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
        <div className="graph-shell">
          <G6Graph
            data={graphData}
            edgeType="cubic-horizontal"
            height={760}
            layout={mindMapLayout}
            onNodeLeave={closeTooltipSoon}
            onNodeMove={handleNodeMove}
          />
          {tooltip ? (
            <div
              className="company-tooltip"
              onMouseEnter={() => window.clearTimeout(hideTimerRef.current)}
              onMouseLeave={closeTooltipSoon}
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {getCompanyList(tooltip.node.companyIds)
                .slice(0, 2)
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
  onNodeLeave,
  onNodeMove,
}: {
  data: GraphData;
  edgeType?: 'polyline' | 'cubic-horizontal';
  height: number;
  layout?: LayoutOptions;
  onNodeLeave?: () => void;
  onNodeMove?: (
    event: { clientX: number; clientY: number; containerRect: DOMRect },
    node: IndustryGraphNode,
  ) => void;
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

    graph.on(NodeEvent.POINTER_MOVE, (event: unknown) => {
      if (!onNodeMove) return;
      const pointerEvent = event as {
        clientX: number;
        clientY: number;
        target?: { id?: string };
      };
      const nodeId = pointerEvent.target?.id;
      if (!nodeId) return;
      const node = graph.getNodeData(nodeId) as NodeData;
      const nodeData = node.data as IndustryGraphNode | undefined;
      if (!nodeData) return;
      onNodeMove(
        {
          clientX: pointerEvent.clientX,
          clientY: pointerEvent.clientY,
          containerRect: container.getBoundingClientRect(),
        },
        nodeData,
      );
    });

    if (onNodeLeave) {
      graph.on(NodeEvent.POINTER_LEAVE, onNodeLeave);
    }

    graph.render();

    return () => {
      graph.destroy();
    };
  }, [data, edgeType, height, layout, onNodeLeave, onNodeMove]);

  return <div className="g6-graph" ref={containerRef} style={{ height }} />;
}
