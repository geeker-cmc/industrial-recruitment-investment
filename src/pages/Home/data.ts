import type { FeaturedTopic, RegionalPlan } from './types';

export const featuredTopics: FeaturedTopic[] = [
  {
    id: 'advanced-manufacturing',
    type: 'featured',
    title: '先进制造产业',
    icon: 'manufacturing',
    tone: 'red',
    description:
      '先进制造业是相对于传统制造业而言，指制造业不断吸收电子信息、计算机、机械、材料以及现代管理技术等方面的高新技术成果，并将这些先进制造技术综合应用于制造业产品的研发设计、生产制造、在线检测、营销服务和管理的全过程。',
    chains: [
      { id: 'new-materials', name: '新材料产业链', icon: 'nodes' },
      { id: 'new-energy-vehicle', name: '新能源汽车产业链', icon: 'car' },
      { id: 'biomedicine', name: '生物医药产业链', icon: 'dna' },
      { id: 'medical-device', name: '医疗器械产业链', icon: 'magnet' },
      { id: 'computer', name: '计算机产业链', icon: 'desktop' },
      { id: 'communication', name: '通信产业链', icon: 'radar' },
      { id: 'electronic-equipment', name: '电子设备产业链', icon: 'chip' },
      { id: 'robot', name: '机器人产业链', icon: 'robot' },
      { id: 'led', name: 'LED产业链', icon: 'bulb' },
      { id: 'pump-motor', name: '泵与电机产业链', icon: 'battery' },
      { id: 'glass-fiber', name: '玻璃纤维产业链', icon: 'file' },
      { id: 'charging-pile', name: '充电桩产业链', icon: 'charging' },
      { id: 'sensor', name: '传感器产业链', icon: 'sensor' },
      { id: 'shipbuilding', name: '船舶制造产业链', icon: 'ship' },
      { id: 'large-aircraft', name: '大飞机产业链', icon: 'plane' },
      { id: 'electronic-information', name: '电子信息产业链', icon: 'cpu' },
      { id: 'power-battery', name: '动力电池产业链', icon: 'battery-cell' },
      { id: 'high-end-equipment', name: '高端装备产业链', icon: 'target' },
      { id: 'industrial-machinery', name: '工业机械制造产业链', icon: 'tool' },
      { id: 'photonics', name: '光子产业链', icon: 'spark' },
      { id: 'silicon-material', name: '硅基材料产业链', icon: 'silicon' },
      { id: 'rail-transit', name: '轨道交通产业链', icon: 'train' },
      { id: 'marine-equipment', name: '海工装备产业链', icon: 'marine' },
      { id: 'marine-economy', name: '海洋经济产业链', icon: 'wave' },
    ],
  },
  {
    id: 'green-low-carbon',
    type: 'featured',
    title: '绿色低碳产业',
    icon: 'leaf',
    tone: 'green',
    description:
      '围绕能源清洁化、生产低碳化和资源循环化，重点关注新能源、节能环保、碳管理、绿色制造和循环经济等产业链方向。',
    chains: [
      { id: 'solar-energy', name: '光伏产业链', icon: 'sun' },
      { id: 'energy-storage', name: '储能产业链', icon: 'battery-cell' },
      { id: 'hydrogen-energy', name: '氢能产业链', icon: 'bolt' },
      { id: 'environmental-protection', name: '节能环保产业链', icon: 'leaf' },
      { id: 'carbon-service', name: '碳服务产业链', icon: 'radar' },
      { id: 'recycling-economy', name: '循环经济产业链', icon: 'nodes' },
    ],
  },
  {
    id: 'strategic-emerging',
    type: 'featured',
    title: '战略新兴产业',
    icon: 'rise',
    tone: 'blue',
    description:
      '面向新一轮科技革命和产业变革，聚焦信息技术、高端装备、新能源、新材料、生物技术等具有增长潜力的产业方向。',
    chains: [
      { id: 'artificial-intelligence', name: '人工智能产业链', icon: 'robot' },
      { id: 'big-data', name: '大数据产业链', icon: 'desktop' },
      { id: 'cloud-computing', name: '云计算产业链', icon: 'nodes' },
      { id: 'satellite-internet', name: '卫星互联网产业链', icon: 'radar' },
      { id: 'quantum-info', name: '量子信息产业链', icon: 'spark' },
      { id: 'low-altitude-economy', name: '低空经济产业链', icon: 'plane' },
    ],
  },
  {
    id: 'consumer',
    type: 'featured',
    title: '大消费产业',
    icon: 'shopping',
    tone: 'purple',
    description:
      '围绕居民消费升级和新消费场景，关注食品饮料、文旅体育、健康服务、智慧零售和消费电子等产业链。',
    chains: [
      { id: 'food-drink', name: '食品饮料产业链', icon: 'bulb' },
      { id: 'consumer-electronics', name: '消费电子产业链', icon: 'chip' },
      { id: 'smart-retail', name: '智慧零售产业链', icon: 'target' },
      { id: 'culture-tourism', name: '文化旅游产业链', icon: 'ship' },
      { id: 'sports', name: '体育产业链', icon: 'radar' },
      { id: 'elderly-care', name: '养老产业链', icon: 'leaf' },
    ],
  },
  {
    id: 'modern-service',
    type: 'featured',
    title: '现代服务产业',
    icon: 'service',
    tone: 'yellow',
    description:
      '以生产性服务和生活性服务为重点，聚焦现代物流、软件服务、工业设计、科技服务、金融服务和专业服务。',
    chains: [
      { id: 'modern-logistics', name: '现代物流产业链', icon: 'train' },
      { id: 'software-service', name: '软件服务产业链', icon: 'desktop' },
      { id: 'industrial-design', name: '创意与工业设计产业链', icon: 'tool' },
      { id: 'science-service', name: '科技服务产业链', icon: 'spark' },
      { id: 'financial-service', name: '金融服务产业链', icon: 'target' },
      { id: 'business-service', name: '商务服务产业链', icon: 'file' },
    ],
  },
  {
    id: 'life-health',
    type: 'featured',
    title: '生命健康产业',
    icon: 'health',
    tone: 'purple',
    description:
      '围绕生物医药、医疗器械、智慧医疗、康养服务和健康管理等方向，构建生命健康产业生态。',
    chains: [
      { id: 'biomedicine-health', name: '生物医药产业链', icon: 'dna' },
      { id: 'medical-device-health', name: '医疗器械产业链', icon: 'magnet' },
      { id: 'smart-medical', name: '智慧医疗产业链', icon: 'radar' },
      { id: 'health-management', name: '健康管理产业链', icon: 'leaf' },
      { id: 'cell-therapy', name: '细胞治疗产业链', icon: 'dna' },
      { id: 'rehabilitation', name: '康复器械产业链', icon: 'tool' },
    ],
  },
  {
    id: 'information-technology',
    type: 'featured',
    title: '信息科技产业',
    icon: 'atom',
    tone: 'cyan',
    description:
      '聚焦电子信息、软件服务、人工智能、云计算、大数据、通信网络和信息安全等数字技术方向。',
    chains: [
      { id: 'electronic-info-tech', name: '电子信息产业链', icon: 'cpu' },
      { id: '5g', name: '5G产业链', icon: 'radar' },
      { id: 'ai-tech', name: '人工智能产业链', icon: 'robot' },
      { id: 'data-security', name: '数据安全产业链', icon: 'file' },
      { id: 'semiconductor', name: '半导体产业链', icon: 'chip' },
      { id: 'industrial-internet', name: '工业互联网产业链', icon: 'nodes' },
    ],
  },
  {
    id: 'media-entertainment',
    type: 'featured',
    title: '文娱传媒产业',
    icon: 'media',
    tone: 'purple',
    description:
      '重点关注数字内容、文化创意、游戏动漫、短视频直播、影视制作和数字营销等新型内容产业。',
    chains: [
      { id: 'digital-content', name: '数字内容产业链', icon: 'spark' },
      { id: 'animation-game', name: '动漫游戏产业链', icon: 'robot' },
      { id: 'film-tv', name: '影视制作产业链', icon: 'desktop' },
      { id: 'live-streaming', name: '直播电商产业链', icon: 'radar' },
      { id: 'digital-marketing', name: '数字营销产业链', icon: 'target' },
      { id: 'creative-design', name: '创意设计产业链', icon: 'tool' },
    ],
  },
  {
    id: 'finance-real-estate',
    type: 'featured',
    title: '金融地产产业',
    icon: 'finance',
    tone: 'yellow',
    description:
      '围绕产业金融、科技金融、资产管理、城市更新和产业园区运营，服务区域产业发展和项目落地。',
    chains: [
      { id: 'industrial-finance', name: '产业金融产业链', icon: 'target' },
      { id: 'fintech', name: '金融科技产业链', icon: 'cpu' },
      { id: 'asset-management', name: '资产管理产业链', icon: 'file' },
      { id: 'park-operation', name: '园区运营产业链', icon: 'nodes' },
      { id: 'urban-renewal', name: '城市更新产业链', icon: 'tool' },
      { id: 'reits', name: '不动产基金产业链', icon: 'finance' },
    ],
  },
  {
    id: 'traditional',
    type: 'featured',
    title: '传统产业',
    icon: 'traditional',
    tone: 'cyan',
    description:
      '围绕纺织服装、化工材料、食品加工、机械加工等传统优势产业，推动数字化改造和高端化升级。',
    chains: [
      { id: 'textile', name: '高端纺织产业链', icon: 'file' },
      { id: 'fine-chemical', name: '精细化工产业链', icon: 'nodes' },
      { id: 'food-processing', name: '食品加工产业链', icon: 'bulb' },
      { id: 'metal-processing', name: '金属加工产业链', icon: 'tool' },
      { id: 'packaging', name: '包装材料产业链', icon: 'chip' },
      { id: 'equipment-renewal', name: '设备更新产业链', icon: 'battery' },
    ],
  },
];

export const regionalPlans: RegionalPlan[] = [
  {
    id: 'fourteenth-five-year',
    type: 'regional',
    title: '十四五规划产业',
    icon: 'building',
    tone: 'blue',
    regionLabel: '江苏省 / 南通市',
    headline: '南通市 · 十四五规划产业',
    groups: [
      {
        id: 'strategic-emerging-development',
        title: '大力发展优势战略性新兴产业',
        description:
          '重点发展天链零部件、天链天任技术、智能化技术、轻量化技术、无人驾驶、先进电设施网络、共享出行行业公寺等。',
        chains: [
          { id: 'new-energy-vehicle', name: '新能源汽车产业链', icon: 'car' },
          { id: 'intelligent-connected-car', name: '智能网联汽车产业链', icon: 'radar' },
        ],
      },
      {
        id: 'environment-protection',
        title: '节能环保产业',
        description:
          '重点发展节能降碳、大气污染防治、水污染防治、污水治理、固体废弃物处理处置及综合利用、环境保护监测处理等技术装备。',
        chains: [
          { id: 'environmental-protection', name: '节能环保产业链', icon: 'leaf' },
        ],
      },
      {
        id: 'digital-creative',
        title: '数字创意产业',
        description:
          '重点发展数字阅读、文化创意、设计服务、游戏、动漫、电竞、直播、短视频等。',
        chains: [
          { id: 'digital-creative', name: '数字创意产业链', icon: 'spark' },
        ],
      },
      {
        id: 'producer-service',
        title: '推动生产性服务向专业化和价值链高端延伸',
        description:
          '大力发展现代物流、科技服务、信息与软件服务、服务外包、工业设计等服务业。',
        chains: [
          { id: 'modern-logistics', name: '现代物流产业链', icon: 'train' },
          { id: 'software-service', name: '软件服务产业链', icon: 'desktop' },
          { id: 'industrial-design', name: '创意与工业设计产业链', icon: 'tool' },
        ],
      },
      {
        id: 'life-service',
        title: '推动生活性服务业向高品质和多样化升级',
        description:
          '加快发展旅游、健康、文体、家政、养老等服务业，加强公益性、基础性服务业供给。',
        chains: [
          { id: 'culture-tourism', name: '文化旅游产业链', icon: 'ship' },
          { id: 'sports', name: '体育产业链', icon: 'radar' },
          { id: 'elderly-care', name: '养老产业链', icon: 'leaf' },
        ],
      },
    ],
  },
  {
    id: 'fifteenth-five-year',
    type: 'regional',
    title: '十五五规划产业',
    icon: 'building',
    tone: 'blue',
    regionLabel: '北京市',
    headline: '北京市 · 十五五规划产业',
    groups: [
      {
        id: 'smart-manufacturing',
        title: '大力发展智能制造高端制造',
        description:
          '培育万亿级新一代信息技术产业集群，聚焦5G、人工智能、大数据、云计算、物联网、区块链等基础领域。',
        chains: [
          { id: 'electronic-information', name: '电子信息产业链', icon: 'cpu' },
          { id: '5g', name: '5G产业链', icon: 'radar' },
          { id: 'artificial-intelligence', name: '人工智能产业链', icon: 'robot' },
          { id: 'big-data', name: '大数据产业链', icon: 'desktop' },
          { id: 'cloud-computing', name: '云计算产业链', icon: 'nodes' },
          { id: 'internet-of-things', name: '物联网产业链', icon: 'sensor' },
          { id: 'blockchain', name: '区块链产业链', icon: 'nodes' },
          { id: 'integrated-circuit', name: '集成电路产业链', icon: 'chip' },
        ],
      },
      {
        id: 'healthcare',
        title: '医药健康产业',
        description:
          '培育以生物医药产业带动大健康制造与服务配套发展的万亿级产业集群，推进生物医药与健康产业协同发展。',
        chains: [
          { id: 'biomedicine', name: '生物医药产业链', icon: 'dna' },
          { id: 'medical-device', name: '医疗器械产业链', icon: 'magnet' },
        ],
      },
      {
        id: 'future-industry',
        title: '未来产业',
        description:
          '前瞻布局量子信息、新材料、人工智能、卫星互联网、机器人等未来产业，培育新技术新产品新业态新模式。',
        chains: [
          { id: 'quantum-info', name: '量子信息产业链', icon: 'spark' },
          { id: 'new-materials', name: '新材料产业链', icon: 'nodes' },
          { id: 'artificial-intelligence', name: '人工智能产业链', icon: 'robot' },
          { id: 'satellite-internet', name: '卫星及应用产业链', icon: 'radar' },
          { id: 'robot', name: '机器人产业链', icon: 'robot' },
        ],
      },
      {
        id: 'green-energy',
        title: '全面提升绿色能源支撑能力',
        description:
          '建设安全高效、清洁低碳的新型能源体系，推进能源技术装备、储能、氢能和智慧电网协同发展。',
        chains: [
          { id: 'energy-storage', name: '储能产业链', icon: 'battery-cell' },
          { id: 'hydrogen-energy', name: '氢能产业链', icon: 'bolt' },
          { id: 'smart-grid', name: '智慧电网产业链', icon: 'radar' },
        ],
      },
    ],
  },
];
