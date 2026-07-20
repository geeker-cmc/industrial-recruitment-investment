import {
  ApartmentOutlined,
  BankOutlined,
  BookOutlined,
  BulbOutlined,
  DatabaseOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Empty, Input, Space, Tag } from 'antd';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

type KnowledgeType = 'chain' | 'opportunity' | 'technology' | 'cluster' | 'talent' | 'company';

type KnowledgeCategory = {
  key: KnowledgeType;
  label: string;
  icon: ReactNode;
};

type KnowledgeRecord = {
  id: string;
  title: string;
  tag: string;
  date: string;
  source: string;
  summary: string;
  metrics: string[];
};

const categories: KnowledgeCategory[] = [
  { key: 'chain', label: '产业链', icon: <NodeIndexOutlined /> },
  { key: 'opportunity', label: '商机库', icon: <BankOutlined /> },
  { key: 'technology', label: '技术库', icon: <BulbOutlined /> },
  { key: 'cluster', label: '产业集群库', icon: <ApartmentOutlined /> },
  { key: 'talent', label: '人才库', icon: <TeamOutlined /> },
  { key: 'company', label: '企业库', icon: <DatabaseOutlined /> },
];

const records: Record<KnowledgeType, KnowledgeRecord[]> = {
  chain: [
    {
      id: 'chain-001',
      title: '电子信息产业链全景与关键补链环节',
      tag: '产业链图谱',
      date: '2026-07-09',
      source: '产业洞察模型',
      summary:
        '围绕电子元器件、集成电路设计、封装测试、通信设备和工业软件环节，梳理全国格局、南通基础、关键短板和可延伸方向，形成补链、强链、延链建议。',
      metrics: ['强链节点 12 个', '补链节点 7 个', '关联企业 13.3 万家'],
    },
    {
      id: 'chain-002',
      title: '智能制造装备产业链上下游结构',
      tag: '强弱诊断',
      date: '2026-07-08',
      source: '区域产业库',
      summary:
        '分析工业机器人、传感器、控制系统、数字化产线和系统集成服务，识别南通装备制造的优势基础与关键技术空白。',
      metrics: ['优势环节 8 个', '薄弱环节 5 个', '延链方向 4 类'],
    },
  ],
  opportunity: [
    {
      id: 'opportunity-001',
      title: '电子信息补链项目储备机会',
      tag: '投资机会',
      date: '2026-07-09',
      source: '项目管理',
      summary:
        '基于产业链空白节点和企业画像评分，筛选出集成电路分析服务、通信设备贸易、电子设备技术服务等方向的项目机会。',
      metrics: ['候选企业 28 家', '高匹配项目 6 个', '拟投金额 1.8 亿'],
    },
    {
      id: 'opportunity-002',
      title: '南通高端装备招商协同机会',
      tag: '招商线索',
      date: '2026-07-06',
      source: '商机库',
      summary:
        '结合区域产业集群、企业融资动态和政策导向，识别高端装备项目落地、并购和联合研发的潜在线索。',
      metrics: ['招商线索 19 条', '重点跟进 5 条', '协同园区 3 个'],
    },
  ],
  technology: [
    {
      id: 'tech-001',
      title: '芯片分析与 EDA 辅助工具关键技术',
      tag: '关键技术',
      date: '2026-07-09',
      source: '技术库',
      summary:
        '覆盖版图解析、逆向分析、验证工具、可靠性评估和知识产权分析，支撑电子信息产业链核心环节能力判断。',
      metrics: ['专利 126 件', '软著 42 项', '关联专家 18 人'],
    },
    {
      id: 'tech-002',
      title: '工业视觉检测与智能质检技术',
      tag: '技术趋势',
      date: '2026-07-05',
      source: '科研数据库',
      summary:
        '梳理视觉检测算法、边缘计算、缺陷识别模型和工业场景落地案例，辅助智能制造项目技术尽调。',
      metrics: ['论文 312 篇', '专利 88 件', '应用场景 9 类'],
    },
  ],
  cluster: [
    {
      id: 'cluster-001',
      title: '南通电子信息产业集群画像',
      tag: '产业集群',
      date: '2026-07-09',
      source: '产业集群库',
      summary:
        '从区域分布、企业密度、产品结构、创新资源和投融资活跃度五个维度刻画南通电子信息产业集群。',
      metrics: ['重点区域 6 个', '企业 13.3 万家', '融资事件 391 起'],
    },
    {
      id: 'cluster-002',
      title: '长三角智能制造产业集群对比',
      tag: '区域对标',
      date: '2026-07-03',
      source: '区域数据库',
      summary:
        '对比南通、苏州、无锡、宁波等区域的产业链完整度、重点企业、人才资源和技术承载能力。',
      metrics: ['对标城市 8 个', '重点园区 21 个', '标杆企业 64 家'],
    },
  ],
  talent: [
    {
      id: 'talent-001',
      title: '电子信息产业专家人才画像',
      tag: '专家人才',
      date: '2026-07-09',
      source: '人才库',
      summary:
        '汇总集成电路、通信设备、工业软件和智能制造方向专家，辅助项目尽调、技术评审和投委会外部论证。',
      metrics: ['专家 86 人', '高校院所 14 家', '可邀约 23 人'],
    },
    {
      id: 'talent-002',
      title: '高端装备项目技术评审专家池',
      tag: '评审资源',
      date: '2026-07-04',
      source: '专家人才库',
      summary:
        '围绕机器人、传感器、控制系统和自动化产线方向，建立可用于项目技术尽调的专家资源清单。',
      metrics: ['专家 52 人', '产业背景 31 人', '科研背景 21 人'],
    },
  ],
  company: [
    {
      id: 'company-001',
      title: '北京芯愿景软件技术股份有限公司',
      tag: '目标企业',
      date: '2026-07-09',
      source: '企业库',
      summary:
        '企业位于电子信息与集成电路服务环节，具备芯片分析服务、EDA辅助工具、知识产权分析和设计验证能力，适合进入投前尽调。',
      metrics: ['综合评价 A', '科创评分 S', '风险线索 1 条'],
    },
    {
      id: 'company-002',
      title: '苏州苏试试验集团股份有限公司',
      tag: '同业企业',
      date: '2026-07-07',
      source: '企业库',
      summary:
        '企业聚焦环境与可靠性试验、集成电路验证和高端装备检测服务，可作为电子信息与高端装备项目同业对标样本。',
      metrics: ['上市企业', '检测服务', '综合评价 A'],
    },
  ],
};

export default function KnowledgeBasePage() {
  const [activeKey, setActiveKey] = useState<KnowledgeType>('chain');
  const [draftKeyword, setDraftKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const activeCategory = categories.find((item) => item.key === activeKey) ?? categories[0]!;
  const list = useMemo(() => {
    const source = records[activeKey];
    const normalized = keyword.trim().toLowerCase();
    return normalized
      ? source.filter((item) => `${item.title}${item.summary}${item.tag}${item.source}`.toLowerCase().includes(normalized))
      : source;
  }, [activeKey, keyword]);

  return (
    <main className="knowledge-page">
      <section className="knowledge-search-panel">
        <div className="knowledge-search-panel__header">
          <div>
            <span className="management-eyebrow">知识库</span>
            <h1>数据检索</h1>
            <p>{activeCategory.label} / 支持跨库关键词检索、结果筛选和知识条目查看。</p>
          </div>
        </div>
        <div className="knowledge-search-row">
          <Input
            allowClear
            className="knowledge-search"
            onChange={(event) => setDraftKeyword(event.target.value)}
            onPressEnter={() => setKeyword(draftKeyword)}
            placeholder={`请输入${activeCategory.label}检索内容`}
            size="large"
            value={draftKeyword}
          />
          <Button icon={<SearchOutlined />} onClick={() => setKeyword(draftKeyword)} size="large" type="primary">
            确认
          </Button>
        </div>
        <nav className="knowledge-database-tabs" aria-label="知识库类型">
          {categories.map((category) => (
            <button
              className={activeKey === category.key ? 'is-active' : ''}
              key={category.key}
              onClick={() => setActiveKey(category.key)}
              type="button"
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </nav>
      </section>

      <section className="knowledge-results-panel">
        <div className="knowledge-results-panel__title">
          <h2>{activeCategory.label}检索结果</h2>
          <span>共 {list.length} 条</span>
        </div>
        {list.length ? (
          <div className="knowledge-result-list">
            {list.map((item) => (
              <article className="knowledge-result-card" key={item.id}>
                <div className="knowledge-result-card__icon">
                  <BookOutlined />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <Space wrap size={8}>
                    <Tag color="blue">{item.tag}</Tag>
                    <span>{item.source}</span>
                    <span>{item.date}</span>
                  </Space>
                  <p>{item.summary}</p>
                  <div className="knowledge-result-card__metrics">
                    {item.metrics.map((metric) => (
                      <Tag key={metric}>{metric}</Tag>
                    ))}
                  </div>
                </div>
                <Button icon={<UserOutlined />} type="link">
                  查看详情
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <Empty description="暂无匹配结果" />
        )}
      </section>
    </main>
  );
}
