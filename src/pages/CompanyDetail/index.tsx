import {
  ArrowLeftOutlined,
  CloudDownloadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Descriptions,
  Space,
  Tabs,
  Tag,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompanyById } from '../../mock/industry';
import { useCompanyStore } from '../../stores/useCompanyStore';

type CompanyParams = {
  companyId: string;
};

const primaryTabs = [
  '基本信息',
  '资本市场',
  '经营信息',
  '经营风险',
  '司法风险',
  '行业信息',
  '知识产权',
  '企业资讯',
  '图谱中心',
  '企业评价',
  '同业分析',
  '电商详情',
];

const secondaryTabs = [
  '企业基本信息',
  '股东信息',
  '主要人员',
  '工商变更',
  '股权投资',
  '受益所有人',
  '分支机构',
  '工商年报',
];

export default function CompanyDetailPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<CompanyParams>();
  const company = getCompanyById(companyId);
  const setCurrentCompanyId = useCompanyStore((state) => state.setCurrentCompanyId);
  const [primaryTab, setPrimaryTab] = useState(primaryTabs[0]);
  const [secondaryTab, setSecondaryTab] = useState(secondaryTabs[0]);
  const [followed, setFollowed] = useState(false);

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
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            返回
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
          activeKey={primaryTab}
          className="company-primary-tabs"
          items={primaryTabs.map((tab) => ({ key: tab, label: tab }))}
          onChange={setPrimaryTab}
        />
        {primaryTab === '基本信息' ? (
          <Tabs
            activeKey={secondaryTab}
            className="company-secondary-tabs"
            items={secondaryTabs.map((tab) => ({ key: tab, label: tab }))}
            onChange={setSecondaryTab}
          />
        ) : null}
        <CompanyContent
          primaryTab={primaryTab}
          secondaryTab={secondaryTab}
          company={company}
        />
      </section>
    </main>
  );
}

function CompanyContent({
  company,
  primaryTab,
  secondaryTab,
}: {
  company: ReturnType<typeof getCompanyById>;
  primaryTab: string;
  secondaryTab: string;
}) {
  if (primaryTab === '基本信息' && secondaryTab === '企业基本信息') {
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
          <Descriptions.Item label="统一社会信用代码">
            {company.creditCode}
          </Descriptions.Item>
          <Descriptions.Item label="登记状态">{company.status}</Descriptions.Item>
          <Descriptions.Item label="成立日期">
            {company.establishedDate}
          </Descriptions.Item>
          <Descriptions.Item label="注册资本">
            {company.registeredCapital}
          </Descriptions.Item>
          <Descriptions.Item label="企业类型">{company.companyType}</Descriptions.Item>
          <Descriptions.Item label="登记机关">
            杭州市市场监督管理局
          </Descriptions.Item>
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
        <CompanyEvaluation company={company} />
      </div>
    );
  }

  return (
    <div className="company-content">
      <SectionTitle title={primaryTab === '基本信息' ? secondaryTab : primaryTab} />
      <div className="company-module-placeholder">
        <h3>{primaryTab === '基本信息' ? secondaryTab : primaryTab}</h3>
        <p>
          该模块已接入公司详情页结构，后续可对接接口数据展示列表、图表或分析报告。
        </p>
      </div>
    </div>
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

function CompanyEvaluation({ company }: { company: ReturnType<typeof getCompanyById> }) {
  return (
    <section className="company-evaluation">
      <SectionTitle title="企业综合评价" />
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
    </section>
  );
}
