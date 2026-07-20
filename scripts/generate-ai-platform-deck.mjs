import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = '南通产控AI产业招投平台';
pptx.subject = 'AI+产业/招投平台全流程用户业务路径';
pptx.title = 'AI+产业/招投平台·全流程用户业务路径';
pptx.company = '南通产控集团';
pptx.lang = 'zh-CN';
pptx.theme = {
  headFontFace: 'Microsoft YaHei',
  bodyFontFace: 'Microsoft YaHei',
  lang: 'zh-CN',
};

const W = 13.333;
const H = 7.5;
const C = {
  navy: '122A54',
  blue: '1E70E8',
  blue2: '3D8BFF',
  cyan: '18B9C2',
  purple: '6554C0',
  orange: 'F39A1B',
  red: 'E75B5B',
  ink: '1F3150',
  muted: '64738B',
  faint: '8D9AAF',
  line: 'D8E2F0',
  softBlue: 'EAF3FF',
  softCyan: 'EAFBFC',
  softPurple: 'F1EEFF',
  softOrange: 'FFF5E5',
  softRed: 'FFF0F0',
  white: 'FFFFFF',
  bg: 'F6F9FD',
};

const FONT = 'Microsoft YaHei';

function text(slide, value, x, y, w, h, opts = {}) {
  slide.addText(value, {
    x, y, w, h,
    fontFace: FONT,
    color: opts.color ?? C.ink,
    fontSize: opts.fontSize ?? 14,
    bold: opts.bold ?? false,
    margin: opts.margin ?? 0,
    breakLine: false,
    fit: 'shrink',
    valign: opts.valign ?? 'mid',
    align: opts.align ?? 'left',
    paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 0,
    italic: opts.italic,
    bullet: opts.bullet,
    charSpacing: opts.charSpacing,
  });
}

function rect(slide, x, y, w, h, fill, radius = 0.12, line = null) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: radius,
    fill: { color: fill },
    line: line ? { color: line, width: 1 } : { color: fill, transparency: 100 },
  });
}

function line(slide, x1, y1, x2, y2, color = C.line, width = 1.2, dash = 'solid') {
  slide.addShape(pptx.ShapeType.line, {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color, width, dashType: dash, beginArrowType: 'none', endArrowType: 'none' },
  });
}

function arrow(slide, x, y, w, color = C.blue) {
  slide.addShape(pptx.ShapeType.chevron, {
    x, y, w, h: 0.26,
    fill: { color },
    line: { color, transparency: 100 },
  });
}

function badge(slide, label, x, y, w, fill = C.softBlue, color = C.blue) {
  rect(slide, x, y, w, 0.35, fill, 0.08);
  text(slide, label, x, y, w, 0.35, { fontSize: 10.5, color, bold: true, align: 'center', valign: 'mid', margin: 0 });
}

function dot(slide, x, y, color, size = 0.12) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: size, h: size,
    fill: { color }, line: { color, transparency: 100 },
  });
}

function bulletList(slide, items, x, y, w, lineHeight = 0.38, color = C.ink, size = 12.5) {
  items.forEach((item, index) => {
    dot(slide, x, y + index * lineHeight + 0.13, C.blue2, 0.08);
    text(slide, item, x + 0.18, y + index * lineHeight, w - 0.18, lineHeight, { fontSize: size, color });
  });
}

function footer(slide, activeIndex) {
  const labels = ['产业链', '技术链', '人才链', '资本链', '政策链'];
  const fills = [C.blue, C.cyan, C.purple, C.orange, C.navy];
  const y = 6.70;
  const x0 = 2.65;
  const itemW = 1.47;
  const gap = 0.28;
  rect(slide, 0.52, 6.55, 12.29, 0.58, 'EEF3FA', 0.14, 'DCE6F3');
  text(slide, '五链数据底座贯穿全流程', 0.78, 6.66, 1.68, 0.30, { fontSize: 9.3, color: C.muted, bold: true, valign: 'mid', margin: 0 });
  labels.forEach((label, index) => {
    const x = x0 + index * (itemW + gap);
    const active = index === activeIndex;
    rect(slide, x, y, itemW, 0.30, active ? fills[index] : C.white, 0.08, active ? fills[index] : C.line);
    text(slide, label, x, y, itemW, 0.30, { fontSize: 10.4, color: active ? C.white : C.muted, bold: active, align: 'center', valign: 'mid', margin: 0 });
    if (index < labels.length - 1) arrow(slide, x + itemW + 0.05, y + 0.02, 0.14, C.faint);
  });
  text(slide, '平台能力示意，实际结论以授权数据和业务审批为准', 9.00, 7.19, 3.55, 0.14, { fontSize: 7.5, color: C.faint, align: 'right' });
}

function pageHeader(slide, number, title, subtitle, accent) {
  slide.background = { color: C.bg };
  text(slide, 'AI+产业/招投平台 · 全流程用户业务路径', 0.65, 0.28, 4.6, 0.18, { fontSize: 10.5, color: C.blue, bold: true, charSpacing: 0.5 });
  text(slide, '从本地产业诊断到投后风控决策的数据驱动闭环', 0.65, 0.50, 5.0, 0.17, { fontSize: 8.5, color: C.faint });
  line(slide, 0.65, 0.82, 12.68, 0.82, C.line, 1);
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.68, y: 1.08, w: 0.65, h: 0.65, fill: { color: accent }, line: { color: accent, transparency: 100 } });
  text(slide, String(number), 0.68, 1.08, 0.65, 0.65, { fontSize: 23, color: C.white, bold: true, align: 'center', valign: 'mid', margin: 0 });
  text(slide, title, 1.52, 1.01, 6.6, 0.50, { fontSize: 25, color: C.navy, bold: true, valign: 'mid', margin: 0 });
  text(slide, subtitle, 1.54, 1.48, 7.6, 0.30, { fontSize: 11.5, color: C.muted, valign: 'mid', margin: 0 });
  badge(slide, '用户业务环节 ' + number + '/5', 10.78, 1.16, 1.64, C.white, accent);
  line(slide, 10.90, 1.53, 12.38, 1.53, accent, 2.4);
}

function stageCard(slide, { x, y, w, h, title, tag, accent, fill, items, footerText }) {
  rect(slide, x, y, w, h, C.white, 0.14, C.line);
  rect(slide, x, y, w, 0.08, accent, 0.04);
  badge(slide, tag, x + 0.24, y + 0.25, 0.94, fill, accent);
  text(slide, title, x + 0.24, y + 0.68, w - 0.45, 0.28, { fontSize: 16, color: C.navy, bold: true });
  line(slide, x + 0.24, y + 1.08, x + w - 0.24, y + 1.08, C.line, 0.8);
  bulletList(slide, items, x + 0.24, y + 1.28, w - 0.48, 0.42, C.ink, 11.8);
  text(slide, footerText, x + 0.24, y + h - 0.47, w - 0.48, 0.20, { fontSize: 9.5, color: accent, bold: true });
}

function enginePanel(slide, { x, y, w, h, title, summary, metrics, accent, fill }) {
  rect(slide, x, y, w, h, fill, 0.16, fill);
  text(slide, 'AI ENGINE', x + 0.28, y + 0.28, 1.2, 0.18, { fontSize: 9.5, color: accent, bold: true, charSpacing: 1.2 });
  text(slide, title, x + 0.28, y + 0.56, w - 0.56, 0.42, { fontSize: 17, color: C.navy, bold: true });
  text(slide, summary, x + 0.28, y + 1.15, w - 0.56, 0.56, { fontSize: 11.2, color: C.muted, valign: 'top' });
  metrics.forEach((metric, index) => {
    const rowY = y + 1.98 + index * 0.58;
    rect(slide, x + 0.28, rowY, w - 0.56, 0.42, C.white, 0.08);
    text(slide, metric.label, x + 0.45, rowY + 0.04, 1.65, 0.28, { fontSize: 10, color: C.muted });
    text(slide, metric.value, x + 2.02, rowY + 0.03, w - 2.45, 0.29, { fontSize: 12.2, color: accent, bold: true, align: 'right' });
  });
}

function outputPanel(slide, { x, y, w, h, title, score, items, accent, tag }) {
  rect(slide, x, y, w, h, C.white, 0.14, C.line);
  badge(slide, tag, x + 0.24, y + 0.25, 1.15, C.softBlue, accent);
  text(slide, title, x + 0.24, y + 0.72, w - 0.48, 0.28, { fontSize: 16, color: C.navy, bold: true });
  if (score) {
    text(slide, score.value, x + w - 1.62, y + 0.29, 1.32, 0.42, { fontSize: 24, color: accent, bold: true, align: 'right' });
    text(slide, score.label, x + w - 1.62, y + 0.68, 1.32, 0.18, { fontSize: 9, color: C.faint, align: 'right' });
  }
  line(slide, x + 0.24, y + 1.10, x + w - 0.24, y + 1.10, C.line, 0.8);
  bulletList(slide, items, x + 0.24, y + 1.31, w - 0.48, 0.43, C.ink, 11.8);
}

function panel(slide, x, y, w, h, title, accent, fill = C.white) {
  rect(slide, x, y, w, h, fill, 0.14, C.line);
  rect(slide, x, y, w, 0.07, accent, 0.03);
  text(slide, title, x + 0.26, y + 0.16, w - 0.52, 0.42, { fontSize: 15, color: C.navy, bold: true, valign: 'mid', margin: 0 });
  line(slide, x + 0.26, y + 0.72, x + w - 0.26, y + 0.72, C.line, 0.8);
}

function statusRow(slide, x, y, w, title, description, accent, fill = C.softBlue) {
  rect(slide, x, y, w, 0.55, C.white, 0.08, C.line);
  rect(slide, x, y, 0.08, 0.55, accent, 0.02);
  badge(slide, title, x + 0.20, y + 0.10, 0.94, fill, accent);
  text(slide, description, x + 1.28, y + 0.08, w - 1.48, 0.39, { fontSize: 9.6, color: C.muted, valign: 'mid', margin: 0 });
}

function dimensionCard(slide, x, y, w, h, title, description, accent, fill) {
  rect(slide, x, y, w, h, C.white, 0.10, C.line);
  rect(slide, x, y, 0.08, h, accent, 0.03);
  text(slide, title, x + 0.22, y + 0.08, w - 0.40, 0.32, { fontSize: 12.5, color: C.navy, bold: true, valign: 'mid', margin: 0 });
  text(slide, description, x + 0.22, y + 0.40, w - 0.40, h - 0.48, { fontSize: 9.8, color: C.muted, valign: 'mid', margin: 0 });
}

function flowNode(slide, x, y, w, label, index, accent, active = false) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: 0.44, h: 0.44,
    fill: { color: active ? accent : C.white },
    line: { color: accent, width: 1.5 },
  });
  text(slide, String(index), x, y, 0.44, 0.44, { fontSize: 11, color: active ? C.white : accent, bold: true, align: 'center', valign: 'mid', margin: 0 });
  text(slide, label, x - 0.22, y + 0.53, w, 0.34, { fontSize: 10.5, color: C.ink, bold: active, align: 'center', valign: 'mid', margin: 0 });
}

function addSlideOne() {
  const slide = pptx.addSlide();
  pageHeader(slide, 1, 'AI产业诊断', '把产业名称转化为全国格局、南通强补延方向和招商机会清单', C.blue);
  rect(slide, 0.65, 1.98, 12.03, 0.64, C.white, 0.12, C.blue);
  badge(slide, '输入', 0.88, 2.15, 0.72, C.softBlue, C.blue);
  text(slide, '输入产业名称，选择分析范围，启动产业诊断', 1.82, 2.12, 5.6, 0.28, { fontSize: 14, color: C.navy, bold: true });
  badge(slide, '全国分析', 8.55, 2.15, 1.02, C.softBlue, C.blue);
  badge(slide, '南通诊断', 9.76, 2.15, 1.02, C.softCyan, C.cyan);
  rect(slide, 11.08, 2.10, 1.34, 0.38, C.blue, 0.08);
  text(slide, '开始分析', 11.08, 2.16, 1.34, 0.20, { fontSize: 11, color: C.white, bold: true, align: 'center' });

  panel(slide, 0.65, 2.91, 4.72, 3.25, '全国行业洞察', C.blue, C.white);
  text(slide, '从宏观格局判断产业的规模、趋势、区域和竞争结构', 0.95, 3.82, 4.12, 0.28, { fontSize: 11, color: C.muted });
  const insightRows = [
    ['产业规模', '判断行业空间与发展阶段', 0.82],
    ['区域分布', '识别产业集聚与迁移方向', 0.66],
    ['企业格局', '定位龙头、专精特新与潜力企业', 0.52],
  ];
  insightRows.forEach(([label, description, ratio], index) => {
    const y = 4.30 + index * 0.55;
    text(slide, label, 0.95, y, 0.76, 0.20, { fontSize: 10.5, color: C.ink, bold: true });
    rect(slide, 1.82, y + 0.04, 2.30, 0.12, 'EAF0F8', 0.05);
    rect(slide, 1.82, y + 0.04, 2.30 * ratio, 0.12, C.blue2, 0.05);
    text(slide, description, 0.95, y + 0.22, 3.92, 0.19, { fontSize: 9.5, color: C.faint });
  });

  panel(slide, 5.66, 2.91, 3.23, 3.25, '南通强补延诊断', C.cyan, C.softCyan);
  text(slide, '把产业分析转化为本地行动方向', 5.96, 3.82, 2.60, 0.28, { fontSize: 11, color: C.muted });
  statusRow(slide, 5.96, 4.30, 2.62, '强链', '放大已有优势环节', C.blue, C.softBlue);
  statusRow(slide, 5.96, 4.96, 2.62, '补链', '识别薄弱和缺失环节', C.orange, C.softOrange);
  statusRow(slide, 5.96, 5.62, 2.62, '延链', '发现产业延伸和招商方向', C.cyan, C.softCyan);

  panel(slide, 9.18, 2.91, 3.50, 3.25, 'AI诊断输出', C.purple, C.white);
  badge(slide, '产业判断', 9.50, 3.82, 1.08, C.softPurple, C.purple);
  text(slide, '从“看产业”走向“定方向”', 9.50, 4.28, 2.78, 0.30, { fontSize: 16, color: C.navy, bold: true });
  line(slide, 9.54, 4.88, 12.20, 4.88, C.line, 1.2);
  bulletList(slide, ['形成产业招商主题', '识别关键技术机会', '沉淀企业筛选条件'], 9.50, 5.12, 2.78, 0.34, C.ink, 11);
  footer(slide, 0);
}

function addSlideTwo() {
  const slide = pptx.addSlide();
  pageHeader(slide, 2, '智能招投定位', '以投资风格和产业缺口为约束，从“看产业”进入“找企业”', C.orange);
  text(slide, '推荐策略由多类特征共同决定', 0.65, 1.96, 3.4, 0.25, { fontSize: 13, color: C.navy, bold: true });
  const strategies = [
    ['投资风格', C.orange, C.softOrange], ['产业链补链', C.blue, C.softBlue], ['区域偏好', C.cyan, C.softCyan], ['成长与创新', C.purple, C.softPurple], ['综合匹配', C.navy, 'EEF2F7'],
  ];
  strategies.forEach(([label, accent, fill], index) => {
    const x = 0.65 + index * 2.40;
    rect(slide, x, 2.28, 2.18, 0.48, index === 0 ? accent : C.white, 0.08, accent);
    text(slide, label, x, 2.40, 2.18, 0.20, { fontSize: 11.5, color: index === 0 ? C.white : accent, bold: true, align: 'center' });
  });

  panel(slide, 0.65, 3.06, 3.30, 3.10, '多维筛选', C.orange, C.white);
  text(slide, '通过筛选条件控制候选范围', 0.95, 3.88, 2.65, 0.22, { fontSize: 10.8, color: C.muted });
  const filters = ['产业链节点', '区域与落地意愿', '企业成长阶段', '资质与技术能力', '历史投资相似度'];
  filters.forEach((item, index) => {
    const y = 4.26 + index * 0.34;
    slide.addShape(pptx.ShapeType.rect, { x: 0.96, y: y + 0.02, w: 0.16, h: 0.16, fill: { color: index < 3 ? C.orange : C.white }, line: { color: C.orange, width: 1 } });
    text(slide, item, 1.25, y, 2.28, 0.20, { fontSize: 10.5, color: C.ink });
  });

  panel(slide, 4.18, 3.06, 5.05, 3.10, '推荐企业池', C.blue, C.softBlue);
  text(slide, '候选企业按照投资匹配逻辑分层呈现', 4.48, 3.88, 4.30, 0.22, { fontSize: 10.8, color: C.muted });
  const candidates = [
    ['候选企业画像', '产业链补链', '技术能力与投资风格匹配'],
    ['候选企业画像', '区域协同', '具备落地和合作空间'],
    ['候选企业画像', '成长潜力', '符合目标阶段和发展方向'],
  ];
  candidates.forEach(([name, tag, reason], index) => {
    const y = 4.28 + index * 0.58;
    rect(slide, 4.48, y, 4.45, 0.45, C.white, 0.07, C.line);
    text(slide, name, 4.68, y + 0.06, 1.25, 0.20, { fontSize: 10.8, color: C.navy, bold: true });
    badge(slide, tag, 6.00, y + 0.07, 0.92, C.softOrange, C.orange);
    text(slide, reason, 7.08, y + 0.06, 1.66, 0.25, { fontSize: 9.5, color: C.muted, align: 'right' });
  });

  panel(slide, 9.46, 3.06, 3.22, 3.10, '推荐解释与动作', C.cyan, C.white);
  badge(slide, '可解释', 9.76, 3.88, 0.84, C.softCyan, C.cyan);
  text(slide, '为什么推荐？', 9.76, 4.32, 2.50, 0.27, { fontSize: 16, color: C.navy, bold: true });
  bulletList(slide, ['说明匹配的产业逻辑', '展示企业优势和关注项', '支持收藏、比较、加入项目'], 9.76, 4.78, 2.55, 0.37, C.ink, 10.7);
  footer(slide, 1);
}

function addSlideThree() {
  const slide = pptx.addSlide();
  pageHeader(slide, 3, 'AI企业画像', '将企业公开信息和产业关系统一为可比较、可追踪的投资对象画像', C.cyan);
  rect(slide, 0.65, 1.98, 12.03, 0.91, C.navy, 0.14);
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.96, y: 2.19, w: 0.47, h: 0.47, fill: { color: C.cyan }, line: { color: C.cyan, transparency: 100 } });
  text(slide, '企', 0.96, 2.28, 0.47, 0.20, { fontSize: 12, color: C.white, bold: true, align: 'center' });
  text(slide, 'AI企业画像摘要', 1.64, 2.12, 2.55, 0.26, { fontSize: 16, color: C.white, bold: true });
  text(slide, '汇聚九类信息，帮助用户快速判断企业是否值得继续投入尽调和谈判资源', 1.64, 2.48, 6.40, 0.21, { fontSize: 10.5, color: 'C8D8EF' });
  badge(slide, '可比较', 9.62, 2.27, 0.86, C.softCyan, C.cyan);
  badge(slide, '可追踪', 10.62, 2.27, 0.86, C.softBlue, C.blue2);
  badge(slide, '可解释', 11.62, 2.27, 0.86, C.softPurple, C.purple);

  const dimensions = [
    ['工商', '核验主体、股权与经营基础', C.blue, C.softBlue],
    ['司法', '识别诉讼、执行与合规风险', C.red, C.softRed],
    ['舆情', '观察企业声誉与外部变化', C.orange, C.softOrange],
    ['财务', '判断经营质量、成长与现金流', C.cyan, C.softCyan],
    ['技术', '识别专利、研发和技术壁垒', C.purple, C.softPurple],
    ['人才', '分析核心团队和人才结构', C.blue, C.softBlue],
    ['产业链', '定位上下游关系和产业位置', C.cyan, C.softCyan],
    ['综合评价', '形成优势、风险和关注事项摘要', C.orange, C.softOrange],
    ['同业公司', '支持横向对标和竞争位置判断', C.navy, 'EEF2F7'],
  ];
  dimensions.forEach(([title, description, accent, fill], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    dimensionCard(slide, 0.65 + col * 4.02, 3.16 + row * 0.99, 3.76, 0.83, title, description, accent, fill);
  });
  footer(slide, 2);
}

function addSlideFour() {
  const slide = pptx.addSlide();
  pageHeader(slide, 4, '智能尽调审核', '把资料提交、尽调分析、合同审查和投资决策依据串成一次可追溯任务', C.purple);
  panel(slide, 0.65, 1.98, 3.18, 4.28, '资料任务', C.purple, C.white);
  badge(slide, '尽调智能体', 0.95, 2.82, 1.16, C.softPurple, C.purple);
  badge(slide, '合同审核', 2.18, 2.82, 1.02, C.softBlue, C.blue);
  text(slide, '提交资料后，智能体先完成分类、解析和状态跟踪', 0.95, 3.34, 2.52, 0.45, { fontSize: 10.5, color: C.muted, valign: 'top' });
  const files = [
    ['商业计划书', '待解析'], ['财务资料', '待补充'], ['投资协议', '待审核'], ['补充说明', '可选资料'],
  ];
  files.forEach(([name, status], index) => {
    const y = 4.02 + index * 0.49;
    slide.addShape(pptx.ShapeType.ellipse, { x: 0.98, y: y + 0.06, w: 0.28, h: 0.28, fill: { color: C.softPurple }, line: { color: C.purple, width: 1 } });
    text(slide, '文', 0.98, y + 0.12, 0.28, 0.12, { fontSize: 7.5, color: C.purple, bold: true, align: 'center' });
    text(slide, name, 1.42, y, 1.18, 0.22, { fontSize: 10.5, color: C.ink, bold: true });
    text(slide, status, 2.64, y, 0.70, 0.22, { fontSize: 9.5, color: C.faint, align: 'right' });
  });
  text(slide, '系统入口：skill合集', 0.95, 5.96, 2.30, 0.20, { fontSize: 9.5, color: C.purple, bold: true });

  panel(slide, 4.12, 1.98, 4.42, 4.28, '智能体工作流', C.blue, C.softBlue);
  text(slide, '从原始资料到投资判断依据', 4.42, 2.82, 3.65, 0.24, { fontSize: 11, color: C.muted });
  line(slide, 5.04, 3.52, 5.04, 5.67, C.blue2, 2.2);
  const flow = [
    ['01', '资料解析', '识别文件结构和关键字段'],
    ['02', '事实抽取', '形成企业事实和证据索引'],
    ['03', '风险识别', '标注异常、缺失和风险条款'],
    ['04', '结论生成', '输出报告、建议和待确认项'],
  ];
  flow.forEach(([index, title, description], i) => {
    const y = 3.32 + i * 0.62;
    slide.addShape(pptx.ShapeType.ellipse, { x: 4.83, y, w: 0.42, h: 0.42, fill: { color: i === 3 ? C.purple : C.white }, line: { color: C.blue2, width: 1.5 } });
    text(slide, index, 4.83, y + 0.10, 0.42, 0.16, { fontSize: 7.5, color: i === 3 ? C.white : C.blue2, bold: true, align: 'center' });
    text(slide, title, 5.52, y - 0.01, 1.05, 0.22, { fontSize: 11, color: C.navy, bold: true });
    text(slide, description, 6.62, y - 0.01, 1.55, 0.28, { fontSize: 9.4, color: C.muted });
  });

  panel(slide, 8.83, 1.98, 3.85, 4.28, '审核结果', C.orange, C.white);
  badge(slide, '风险提示', 9.13, 2.82, 0.96, C.softOrange, C.orange);
  text(slide, '让审核结果可读、可追溯、可复核', 9.13, 3.27, 3.10, 0.48, { fontSize: 13.5, color: C.navy, bold: true, valign: 'mid', margin: 0 });
  statusRow(slide, 9.13, 3.92, 3.22, '尽调', '形成报告章节与问题清单', C.purple, C.softPurple);
  statusRow(slide, 9.13, 4.58, 3.22, '合同', '标记风险条款与修改建议', C.orange, C.softOrange);
  statusRow(slide, 9.13, 5.24, 3.22, '输出', '沉淀为投委会决策材料', C.blue, C.softBlue);
  footer(slide, 3);
}

function addSlideFive() {
  const slide = pptx.addSlide();
  pageHeader(slide, 5, '投后风控决策', '持续监测企业变化，把风险预警、估值建议和管理动作闭环到投后', C.red);
  panel(slide, 0.65, 1.98, 12.03, 1.24, '投后监测闭环', C.red, C.white);
  text(slide, '从数据变化到管理决策，形成持续迭代的投后工作机制', 0.95, 2.82, 5.0, 0.20, { fontSize: 10.5, color: C.muted });
  const steps = ['数据采集', '变化识别', '风险分级', '责任处置', '决策复盘'];
  steps.forEach((label, index) => {
    const x = 6.10 + index * 1.18;
    flowNode(slide, x, 2.20, 1.18, label, index + 1, C.red, index === 2);
    if (index < steps.length - 1) arrow(slide, x + 0.58, 2.29, 0.33, C.red);
  });

  panel(slide, 0.65, 3.48, 7.02, 2.68, '风险监测与管理动作', C.red, C.softRed);
  badge(slide, '实时感知', 0.95, 4.29, 0.96, C.softRed, C.red);
  text(slide, '企业画像指标发生变化后，系统自动进入风险处理流程', 2.12, 4.30, 4.90, 0.21, { fontSize: 10.7, color: C.muted });
  const riskRows = [
    ['经营与财务', '识别趋势变化，提示经营质量关注项'],
    ['司法与舆情', '发现外部风险，形成预警和跟踪任务'],
    ['技术与人才', '监测核心能力变化，支持投后判断'],
  ];
  riskRows.forEach(([title, description], index) => statusRow(slide, 0.95, 4.78 + index * 0.43, 6.42, title, description, index === 1 ? C.orange : C.red, index === 1 ? C.softOrange : C.softRed));

  panel(slide, 7.95, 3.48, 4.73, 2.68, '决策输出', C.orange, C.white);
  badge(slide, '可行动', 8.25, 4.29, 0.84, C.softOrange, C.orange);
  text(slide, '风险不是终点，处置结果继续服务下一轮投资', 9.32, 4.30, 2.95, 0.36, { fontSize: 12.5, color: C.navy, bold: true });
  const actions = [
    ['估值建议', '结合经营变化和同业信息提供参考'],
    ['管理动作', '分派责任、跟踪处置并形成闭环'],
    ['经验沉淀', '将投后结果回流投资风格和推荐模型'],
  ];
  actions.forEach(([title, description], index) => {
    const y = 4.87 + index * 0.38;
    dot(slide, 8.27, y + 0.07, C.orange, 0.08);
    text(slide, title, 8.49, y, 0.82, 0.20, { fontSize: 10.3, color: C.ink, bold: true });
    text(slide, description, 9.38, y, 2.86, 0.20, { fontSize: 9.1, color: C.muted });
  });
  footer(slide, 4);
}

addSlideOne();
addSlideTwo();
addSlideThree();
addSlideFour();
addSlideFive();

await pptx.writeFile({ fileName: 'docs/AI+产业招投平台五步业务路径演示.pptx' });
