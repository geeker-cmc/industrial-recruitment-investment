import {
  ApartmentOutlined,
  AppstoreOutlined,
  BankOutlined,
  BranchesOutlined,
  BulbOutlined,
  CarOutlined,
  CloudOutlined,
  ClusterOutlined,
  CodeOutlined,
  DesktopOutlined,
  DownOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FireOutlined,
  GoldOutlined,
  HeartOutlined,
  HomeOutlined,
  LaptopOutlined,
  MedicineBoxOutlined,
  NodeIndexOutlined,
  PartitionOutlined,
  RadarChartOutlined,
  RightOutlined,
  RocketOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  TruckOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { Input, Select, Tag } from 'antd';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIndustryStore } from '../../stores/useIndustryStore';
import { featuredTopics, regionalPlans } from './data';
import type {
  FeaturedTopic,
  HomeSelection,
  HomeMenuType,
  IconTone,
  IndustryChain,
  RegionalPlan,
} from './types';

const iconMap: Record<string, ReactNode> = {
  atom: <ClusterOutlined />,
  battery: <ThunderboltOutlined />,
  'battery-cell': <ThunderboltOutlined />,
  building: <HomeOutlined />,
  bulb: <BulbOutlined />,
  car: <CarOutlined />,
  charging: <ThunderboltOutlined />,
  chip: <LaptopOutlined />,
  communication: <WifiOutlined />,
  cpu: <LaptopOutlined />,
  desktop: <DesktopOutlined />,
  dna: <ExperimentOutlined />,
  file: <FileTextOutlined />,
  finance: <BankOutlined />,
  health: <HeartOutlined />,
  leaf: <BranchesOutlined />,
  magnet: <MedicineBoxOutlined />,
  manufacturing: <AppstoreOutlined />,
  marine: <ClusterOutlined />,
  media: <FireOutlined />,
  nodes: <NodeIndexOutlined />,
  plane: <RocketOutlined />,
  radar: <RadarChartOutlined />,
  rise: <RocketOutlined />,
  robot: <CodeOutlined />,
  sensor: <PartitionOutlined />,
  service: <GoldOutlined />,
  ship: <CloudOutlined />,
  shopping: <ShopOutlined />,
  silicon: <GoldOutlined />,
  spark: <FireOutlined />,
  sun: <BulbOutlined />,
  target: <RadarChartOutlined />,
  tool: <ToolOutlined />,
  traditional: <ApartmentOutlined />,
  train: <TruckOutlined />,
  wave: <CloudOutlined />,
};

const toneClass: Record<IconTone, string> = {
  red: 'tone-red',
  green: 'tone-green',
  blue: 'tone-blue',
  purple: 'tone-purple',
  yellow: 'tone-yellow',
  cyan: 'tone-cyan',
  orange: 'tone-orange',
};

function getIcon(icon: string) {
  return iconMap[icon] || <SettingOutlined />;
}

function matchesKeyword(chain: IndustryChain, keyword: string) {
  const text = `${chain.name}${chain.id}${chain.description || ''}`.toLowerCase();
  return text.includes(keyword.toLowerCase());
}

export default function HomePage() {
  const navigate = useNavigate();
  const setCurrentIndustryChainId = useIndustryStore(
    (state) => state.setCurrentIndustryChainId,
  );
  const [keyword, setKeyword] = useState('');
  const [selection, setSelection] = useState<HomeSelection>({
    type: 'featured',
    id: featuredTopics[0].id,
  });
  const [expandedSections, setExpandedSections] = useState<
    Record<HomeMenuType, boolean>
  >({
    featured: true,
    regional: true,
  });

  const selectedFeatured = featuredTopics.find(
    (item) => item.id === selection.id,
  );
  const selectedRegional = regionalPlans.find((item) => item.id === selection.id);

  const handleChainClick = (chain: IndustryChain) => {
    setCurrentIndustryChainId(chain.id);
    navigate(`/industries/${chain.id}`);
  };

  const toggleSection = (type: HomeMenuType) => {
    setExpandedSections((sections) => ({
      ...sections,
      [type]: !sections[type],
    }));
  };

  return (
    <main className="home-page">
      <aside className="home-sidebar" aria-label="产业导航">
        <Input
          allowClear
          className="home-search"
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="请输入产业链名称关键"
          prefix={<SearchOutlined />}
          size="large"
          value={keyword}
        />
        <div className="home-sidebar__scroll">
          <SidebarSection
            expanded={expandedSections.featured}
            onToggle={() => toggleSection('featured')}
            title="精选产业专题"
          >
            {featuredTopics.map((topic) => (
              <SidebarButton
                active={selection.type === 'featured' && selection.id === topic.id}
                icon={topic.icon}
                key={topic.id}
                label={topic.title}
                onClick={() => setSelection({ type: 'featured', id: topic.id })}
                tone={topic.tone}
              />
            ))}
          </SidebarSection>
          <SidebarSection
            expanded={expandedSections.regional}
            onToggle={() => toggleSection('regional')}
            title="区域重点产业"
          >
            {regionalPlans.map((plan) => (
              <SidebarButton
                active={selection.type === 'regional' && selection.id === plan.id}
                icon={plan.icon}
                key={plan.id}
                label={plan.title}
                onClick={() => setSelection({ type: 'regional', id: plan.id })}
                tone={plan.tone}
              />
            ))}
          </SidebarSection>
        </div>
      </aside>
      <section className="home-main">
        {selection.type === 'featured' && selectedFeatured ? (
          <FeaturedContent
            keyword={keyword}
            onChainClick={handleChainClick}
            topic={selectedFeatured}
          />
        ) : null}
        {selection.type === 'regional' && selectedRegional ? (
          <RegionalContent
            keyword={keyword}
            onChainClick={handleChainClick}
            plan={selectedRegional}
          />
        ) : null}
      </section>
    </main>
  );
}

function SidebarSection({
  children,
  expanded,
  onToggle,
  title,
}: {
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  title: string;
}) {
  return (
    <section className={`sidebar-section ${expanded ? 'is-expanded' : 'is-collapsed'}`}>
      <button
        aria-expanded={expanded}
        className="sidebar-section__title"
        onClick={onToggle}
        type="button"
      >
        <ClusterOutlined />
        <span>{title}</span>
        <span className="sidebar-section__toggle">
          {expanded ? <DownOutlined /> : <RightOutlined />}
        </span>
      </button>
      {expanded ? <div className="sidebar-section__items">{children}</div> : null}
    </section>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  onClick,
  tone,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
  tone: IconTone;
}) {
  return (
    <button
      className={`sidebar-item ${active ? 'is-active' : ''}`}
      onClick={onClick}
      type="button"
    >
      <span className={`sidebar-item__icon ${toneClass[tone]}`}>
        {getIcon(icon)}
      </span>
      <span>{label}</span>
    </button>
  );
}

function FeaturedContent({
  keyword,
  onChainClick,
  topic,
}: {
  keyword: string;
  onChainClick: (chain: IndustryChain) => void;
  topic: FeaturedTopic;
}) {
  const chains = useMemo(() => {
    if (!keyword.trim()) {
      return topic.chains;
    }
    return topic.chains.filter((chain) => matchesKeyword(chain, keyword));
  }, [keyword, topic.chains]);

  return (
    <div className="home-panel featured-panel">
      <p className="featured-panel__summary">{topic.description}</p>
      <IndustryGrid chains={chains} onChainClick={onChainClick} />
    </div>
  );
}

function RegionalContent({
  keyword,
  onChainClick,
  plan,
}: {
  keyword: string;
  onChainClick: (chain: IndustryChain) => void;
  plan: RegionalPlan;
}) {
  const groups = useMemo(() => {
    if (!keyword.trim()) {
      return plan.groups;
    }

    return plan.groups
      .map((group) => ({
        ...group,
        chains: group.chains.filter((chain) => matchesKeyword(chain, keyword)),
      }))
      .filter(
        (group) =>
          group.chains.length > 0 ||
          group.title.includes(keyword) ||
          group.description.includes(keyword),
      );
  }, [keyword, plan.groups]);

  return (
    <div className="home-panel regional-panel">
      <div className="regional-panel__topbar">
        <div>
          <span className="regional-panel__back">返回地图</span>
          <strong>{plan.headline}</strong>
        </div>
        <Select
          className="regional-panel__select"
          options={[{ label: plan.regionLabel, value: plan.id }]}
          value={plan.id}
        />
      </div>
      <div className="regional-panel__content">
        {groups.map((group) => (
          <article className="regional-group" key={group.id}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className="regional-group__tags">
              {group.chains.map((chain) => (
                <Tag
                  className="industry-tag"
                  key={chain.id}
                  onClick={() => onChainClick(chain)}
                >
                  {chain.name}
                </Tag>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function IndustryGrid({
  chains,
  onChainClick,
}: {
  chains: IndustryChain[];
  onChainClick: (chain: IndustryChain) => void;
}) {
  if (chains.length === 0) {
    return <div className="empty-result">未匹配到产业链</div>;
  }

  return (
    <div className="industry-grid">
      {chains.map((chain) => (
        <button
          className="industry-card"
          key={chain.id}
          onClick={() => onChainClick(chain)}
          type="button"
        >
          <span className="industry-card__icon">{getIcon(chain.icon)}</span>
          <span className="industry-card__name">{chain.name}</span>
          <span className="industry-card__mark">
            <BranchesOutlined />
          </span>
        </button>
      ))}
    </div>
  );
}
