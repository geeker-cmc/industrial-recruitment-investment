import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  MessageOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PlusOutlined,
  RobotOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  Upload,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildReportFactoryReply,
  type ReportFactoryAttachment,
  type ReportFactoryConversation,
  type ReportFactoryMessage,
  type ReportFactorySkill,
} from '../../mock/reportFactory';
import { useReportFactoryStore } from '../../stores/useReportFactoryStore';

type SkillFormValues = {
  name: string;
  description: string;
  prompt: string;
  inputTypes: string[];
  outputFormats: string[];
  contextTypes: string[];
};

const skillInputOptions = ['企业名称', '项目名称', '产业名称', '区域名称', '上传资料', '自然语言问题'];
const skillOutputOptions = ['摘要', '风险清单', '分析结论', '建议清单', '问题清单', '结构化表格'];
const skillContextOptions = ['企业画像', '项目管理', '产业洞察', '产业链图谱', '区域数据', '用户上传资料'];

export default function ReportFactoryPage() {
  const view = useReportFactoryStore((state) => state.view);
  const conversations = useReportFactoryStore((state) => state.conversations);
  const skills = useReportFactoryStore((state) => state.skills);
  const currentConversationId = useReportFactoryStore((state) => state.currentConversationId);
  const setView = useReportFactoryStore((state) => state.setView);
  const createConversation = useReportFactoryStore((state) => state.createConversation);
  const selectConversation = useReportFactoryStore((state) => state.selectConversation);
  const renameConversation = useReportFactoryStore((state) => state.renameConversation);
  const archiveConversation = useReportFactoryStore((state) => state.archiveConversation);
  const deleteConversation = useReportFactoryStore((state) => state.deleteConversation);

  const [renameTarget, setRenameTarget] = useState<ReportFactoryConversation | null>(null);
  const [renameForm] = Form.useForm<{ title: string }>();

  const activeConversations = useMemo(
    () => conversations.filter((conversation) => conversation.status === 'active'),
    [conversations],
  );
  const archivedConversations = useMemo(
    () => conversations.filter((conversation) => conversation.status === 'archived'),
    [conversations],
  );

  const startNewConversation = (skillId?: string) => {
    createConversation({ skillId });
  };

  const confirmDelete = (conversation: ReportFactoryConversation) => {
    Modal.confirm({
      title: '删除历史对话',
      content: `确认删除“${conversation.title}”吗？删除后无法恢复。`,
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        deleteConversation(conversation.id);
        message.success('历史对话已删除');
      },
    });
  };

  const confirmArchive = (conversation: ReportFactoryConversation) => {
    archiveConversation(conversation.id);
    message.success('对话已归档');
  };

  const openRename = (conversation: ReportFactoryConversation) => {
    setRenameTarget(conversation);
    renameForm.setFieldsValue({ title: conversation.title });
  };

  return (
    <main className="report-factory-page">
      <section className="report-factory-shell">
        <aside className="report-factory-sidebar">
          <div className="report-factory-sidebar__brand">
            <div className="report-factory-sidebar__brand-icon">
              <RobotOutlined />
            </div>
            <div>
              <strong>skill合集</strong>
              <span>智能体工作台</span>
            </div>
          </div>

          <div className="report-factory-sidebar__actions">
            <Button block icon={<PlusOutlined />} onClick={() => startNewConversation()} type="primary">
              新建任务
            </Button>
            <Button
              block
              className={view === 'skills' ? 'is-active' : ''}
              icon={<AppstoreOutlined />}
              onClick={() => setView('skills')}
              type="text"
            >
              技能
            </Button>
          </div>

          <div className="report-factory-history">
            <div className="report-factory-sidebar__section-title">
              <span>历史对话</span>
              <Tag>{activeConversations.length}</Tag>
            </div>
            <ConversationList
              conversations={activeConversations}
              currentConversationId={currentConversationId}
              onArchive={confirmArchive}
              onDelete={confirmDelete}
              onRename={openRename}
              onSelect={selectConversation}
            />

            {archivedConversations.length > 0 && (
              <div className="report-factory-history__archived">
                <div className="report-factory-sidebar__section-title">
                  <span>已归档</span>
                  <Tag>{archivedConversations.length}</Tag>
                </div>
                <ConversationList
                  conversations={archivedConversations}
                  currentConversationId={currentConversationId}
                  onArchive={confirmArchive}
                  onDelete={confirmDelete}
                  onRename={openRename}
                  onSelect={selectConversation}
                />
              </div>
            )}
          </div>

          <div className="report-factory-sidebar__footer">
            <FileTextOutlined />
            <span>对话内容保存在当前浏览器</span>
          </div>
        </aside>

        <section className="report-factory-content">
          {view === 'skills' ? (
            <SkillManagement
              onUseSkill={(skillId) => {
                startNewConversation(skillId);
              }}
            />
          ) : (
            <ConversationWorkspace conversations={conversations} skills={skills} />
          )}
        </section>
      </section>

      <Modal
        destroyOnHidden
        onCancel={() => setRenameTarget(null)}
        onOk={() => renameForm.submit()}
        open={Boolean(renameTarget)}
        title="重命名历史对话"
      >
        <Form
          form={renameForm}
          layout="vertical"
          onFinish={(values: { title: string }) => {
            if (!renameTarget) return;
            renameConversation(renameTarget.id, values.title);
            setRenameTarget(null);
            message.success('对话名称已更新');
          }}
        >
          <Form.Item label="对话名称" name="title" rules={[{ required: true, message: '请输入对话名称' }]}>
            <Input maxLength={40} placeholder="请输入对话名称" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}

function ConversationList({
  conversations,
  currentConversationId,
  onSelect,
  onRename,
  onArchive,
  onDelete,
}: {
  conversations: ReportFactoryConversation[];
  currentConversationId: string;
  onSelect: (conversationId: string) => void;
  onRename: (conversation: ReportFactoryConversation) => void;
  onArchive: (conversation: ReportFactoryConversation) => void;
  onDelete: (conversation: ReportFactoryConversation) => void;
}) {
  if (!conversations.length) {
    return <p className="report-factory-history__empty">还没有对话记录</p>;
  }

  return (
    <div className="report-factory-history__list">
      {conversations.map((conversation) => {
        const menuItems: MenuProps['items'] = [
          { key: 'rename', icon: <EditOutlined />, label: '重命名' },
          ...(conversation.status === 'active'
            ? [{ key: 'archive', icon: <InboxOutlined />, label: '归档' }]
            : []),
          { key: 'delete', danger: true, icon: <DeleteOutlined />, label: '删除' },
        ];
        return (
          <div
            className={`report-factory-history__item ${currentConversationId === conversation.id ? 'is-active' : ''}`}
            key={conversation.id}
          >
            <button onClick={() => onSelect(conversation.id)} type="button">
              <MessageOutlined />
              <span>
                <strong>{conversation.title}</strong>
                <small>{conversation.summary}</small>
              </span>
            </button>
            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ key }) => {
                  if (key === 'rename') onRename(conversation);
                  if (key === 'archive') onArchive(conversation);
                  if (key === 'delete') onDelete(conversation);
                },
              }}
              trigger={['click']}
            >
              <Button aria-label={`管理${conversation.title}`} icon={<MoreOutlined />} type="text" />
            </Dropdown>
          </div>
        );
      })}
    </div>
  );
}

function ConversationWorkspace({
  conversations,
  skills,
}: {
  conversations: ReportFactoryConversation[];
  skills: ReportFactorySkill[];
}) {
  const currentConversationId = useReportFactoryStore((state) => state.currentConversationId);
  const appendMessage = useReportFactoryStore((state) => state.appendMessage);
  const updateConversation = useReportFactoryStore((state) => state.updateConversation);
  const conversation = conversations.find((item) => item.id === currentConversationId) ?? null;
  const skill = skills.find((item) => item.id === conversation?.skillId) ?? skills[0];
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<ReportFactoryAttachment[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length, isReplying]);

  useEffect(() => {
    setInput('');
    setAttachments([]);
    setIsReplying(false);
  }, [conversation?.id]);

  if (!conversation || !skill) {
    return (
      <section className="report-factory-empty-state">
        <RobotOutlined />
        <h1>准备开始一段新的工作</h1>
        <p>点击左侧“新建任务”，选择一个技能后开始和智能体对话。</p>
      </section>
    );
  }

  const sendMessage = () => {
    const content = input.trim();
    if (!content && attachments.length === 0) {
      message.warning('请输入问题或添加资料后再发送');
      return;
    }

    const now = new Date().toISOString();
    const userMessage: ReportFactoryMessage = {
      id: `message-${Date.now()}`,
      role: 'user',
      content: content || '请分析我上传的资料。',
      createdAt: now,
      attachments: attachments.length ? attachments : undefined,
    };
    appendMessage(conversation.id, userMessage);
    if (conversation.messages.length === 0) {
      updateConversation(conversation.id, {
        title: content.slice(0, 24) || `${skill.name}新任务`,
        summary: content || '已添加资料，等待分析',
      });
    }
    setInput('');
    setAttachments([]);
    setIsReplying(true);

    window.setTimeout(() => {
      const reply = buildReportFactoryReply(skill, content || '请分析我上传的资料。', userMessage.attachments ?? []);
      appendMessage(conversation.id, {
        ...reply,
        id: `message-${Date.now()}-reply`,
        role: 'assistant',
        createdAt: new Date().toISOString(),
      });
      setIsReplying(false);
    }, 650);
  };

  const handleUpload = ({ fileList }: { fileList: UploadFile[] }) => {
    setAttachments(
      fileList.map((file) => ({
        id: file.uid,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size || 0,
      })),
    );
  };

  return (
    <section className="report-factory-conversation">
      <header className="report-factory-conversation__header">
        <div>
          <span className="report-factory-eyebrow">AI 对话工作台</span>
          <h1>{conversation.title}</h1>
          <p>{skill.description}</p>
        </div>
        <Space align="start">
          <Tag color={skill.enabled ? 'blue' : 'default'} icon={<ToolOutlined />}>
            {skill.name}
          </Tag>
          <Tag icon={<ClockCircleOutlined />}>{formatConversationTime(conversation.updatedAt)}</Tag>
        </Space>
      </header>

      <div className="report-factory-conversation__body">
        {conversation.messages.length === 0 ? (
          <ConversationWelcome skill={skill} />
        ) : (
          <div className="report-factory-message-list">
            {conversation.messages.map((item) => (
              <MessageBubble key={item.id} message={item} />
            ))}
            {isReplying && (
              <div className="report-factory-message report-factory-message--assistant">
                <div className="report-factory-message__avatar">
                  <RobotOutlined />
                </div>
                <div className="report-factory-message__content report-factory-message__content--typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="report-factory-composer">
        {attachments.length > 0 && (
          <div className="report-factory-composer__attachments">
            {attachments.map((attachment) => (
              <Tag
                closable
                icon={<PaperClipOutlined />}
                key={attachment.id}
                onClose={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))}
              >
                {attachment.name}
              </Tag>
            ))}
          </div>
        )}
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 7 }}
          onChange={(event) => setInput(event.target.value)}
          onPressEnter={(event) => {
            if (!event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder={`围绕${skill.name.replace(' Skill', '')}输入你的问题，或上传资料让智能体分析`}
          value={input}
        />
        <div className="report-factory-composer__footer">
          <Space>
            <Upload
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              beforeUpload={() => false}
              multiple
              onChange={handleUpload}
              showUploadList={false}
            >
              <Button icon={<PaperClipOutlined />} type="text">
                添加资料
              </Button>
            </Upload>
            <Tag color="blue" icon={<ToolOutlined />}>
              {skill.name}
            </Tag>
          </Space>
          <Button
            aria-label="发送消息"
            disabled={isReplying}
            icon={<SendOutlined />}
            onClick={sendMessage}
            shape="circle"
            type="primary"
          />
        </div>
        <div className="report-factory-composer__hint">对话内容只保存在当前工作区，不会修改其他业务模块。</div>
      </div>
    </section>
  );
}

function ConversationWelcome({ skill }: { skill: ReportFactorySkill }) {
  return (
    <div className="report-factory-welcome">
      <div className="report-factory-welcome__icon" style={{ color: skill.accent }}>
        <RobotOutlined />
      </div>
      <h2>开始使用 {skill.name}</h2>
      <p>{skill.description}</p>
      <div className="report-factory-welcome__suggestions">
        {skill.outputFormats.slice(0, 3).map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
      <span>可以直接输入问题，也可以添加资料作为当前对话上下文。</span>
    </div>
  );
}

function MessageBubble({ message: messageItem }: { message: ReportFactoryMessage }) {
  const isUser = messageItem.role === 'user';
  return (
    <article className={`report-factory-message ${isUser ? 'report-factory-message--user' : 'report-factory-message--assistant'}`}>
      <div className="report-factory-message__avatar">{isUser ? <MessageOutlined /> : <RobotOutlined />}</div>
      <div className="report-factory-message__body">
        <div className="report-factory-message__meta">
          <strong>{isUser ? '我' : 'skill合集智能体'}</strong>
          <span>{formatConversationTime(messageItem.createdAt)}</span>
        </div>
        <div className="report-factory-message__content">
          <p>{messageItem.content}</p>
          {messageItem.attachments?.length ? (
            <div className="report-factory-message__attachments">
              {messageItem.attachments.map((attachment) => (
                <Tag icon={<PaperClipOutlined />} key={attachment.id}>
                  {attachment.name}
                </Tag>
              ))}
            </div>
          ) : null}
          {messageItem.blocks?.map((block) => (
            <div className="report-factory-message__block" key={block.title}>
              <strong>{block.title}</strong>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function SkillManagement({ onUseSkill }: { onUseSkill: (skillId: string) => void }) {
  const skills = useReportFactoryStore((state) => state.skills);
  const toggleSkill = useReportFactoryStore((state) => state.toggleSkill);
  const addSkill = useReportFactoryStore((state) => state.addSkill);
  const updateSkill = useReportFactoryStore((state) => state.updateSkill);
  const deleteSkill = useReportFactoryStore((state) => state.deleteSkill);
  const [search, setSearch] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.id ?? '');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ReportFactorySkill | null>(null);
  const [form] = Form.useForm<SkillFormValues>();

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) => `${skill.name}${skill.description}`.toLowerCase().includes(search.toLowerCase().trim())),
    [search, skills],
  );
  const builtinSkills = filteredSkills.filter((skill) => skill.builtin);
  const customSkills = filteredSkills.filter((skill) => !skill.builtin);
  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? filteredSkills[0] ?? null;

  useEffect(() => {
    if (!selectedSkill && filteredSkills[0]) setSelectedSkillId(filteredSkills[0].id);
  }, [filteredSkills, selectedSkill]);

  const openAddSkill = () => {
    setEditingSkill(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditSkill = (skill: ReportFactorySkill) => {
    setEditingSkill(skill);
    form.setFieldsValue({
      name: skill.name,
      description: skill.description,
      prompt: skill.prompt,
      inputTypes: skill.inputTypes,
      outputFormats: skill.outputFormats,
      contextTypes: skill.contextTypes,
    });
    setModalOpen(true);
  };

  const saveSkill = (values: SkillFormValues) => {
    if (editingSkill) {
      updateSkill(editingSkill.id, values);
      message.success('技能配置已更新');
    } else {
      const skill: ReportFactorySkill = {
        id: `custom-skill-${Date.now()}`,
        ...values,
        enabled: true,
        builtin: false,
        accent: '#1677ff',
      };
      addSkill(skill);
      setSelectedSkillId(skill.id);
      message.success('自定义技能已添加并启用');
    }
    setModalOpen(false);
  };

  return (
    <section className="report-factory-skills">
      <header className="report-factory-skills__header">
        <div>
          <span className="report-factory-eyebrow">AI 工具配置</span>
          <h1>技能管理</h1>
          <p>选择适合当前工作的技能，也可以配置属于团队的专属技能。</p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openAddSkill} type="primary">
          添加技能
        </Button>
      </header>

      <div className="report-factory-skills__toolbar">
        <Input
          allowClear
          onChange={(event) => setSearch(event.target.value)}
          prefix={<SearchOutlined />}
          placeholder="搜索技能名称或用途"
          value={search}
        />
        <Tag icon={<SettingOutlined />}>{skills.length} 个技能</Tag>
      </div>

      <div className="report-factory-skills__layout">
        <div className="report-factory-skill-library">
          <SkillGroup
            emptyText="没有匹配的系统技能"
            onSelect={setSelectedSkillId}
            selectedSkillId={selectedSkillId}
            skills={builtinSkills}
            title="系统技能"
            onToggle={toggleSkill}
            onUse={onUseSkill}
          />
          <SkillGroup
            emptyText="还没有自定义技能"
            onEdit={openEditSkill}
            onDelete={(skill) => {
              Modal.confirm({
                title: '删除自定义技能',
                content: `确认删除“${skill.name}”吗？历史对话不会受到影响。`,
                okText: '删除',
                okButtonProps: { danger: true },
                cancelText: '取消',
                onOk: () => {
                  deleteSkill(skill.id);
                  if (selectedSkillId === skill.id) setSelectedSkillId(builtinSkills[0]?.id ?? '');
                  message.success('自定义技能已删除');
                },
              });
            }}
            onSelect={setSelectedSkillId}
            selectedSkillId={selectedSkillId}
            skills={customSkills}
            title="自定义技能"
            onToggle={toggleSkill}
            onUse={onUseSkill}
          />
        </div>

        <SkillDetail
          onEdit={selectedSkill && !selectedSkill.builtin ? openEditSkill : undefined}
          onToggle={toggleSkill}
          onUse={onUseSkill}
          skill={selectedSkill}
        />
      </div>

      <Modal
        destroyOnHidden
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        open={modalOpen}
        title={editingSkill ? '编辑自定义技能' : '添加自定义技能'}
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={saveSkill} requiredMark={false}>
          <div className="report-factory-skill-form-grid">
            <Form.Item label="技能名称" name="name" rules={[{ required: true, message: '请输入技能名称' }]}>
              <Input placeholder="例如：招商项目初筛 Skill" />
            </Form.Item>
            <Form.Item label="技能描述" name="description" rules={[{ required: true, message: '请输入技能描述' }]}>
              <Input placeholder="简要说明该技能可以解决什么问题" />
            </Form.Item>
          </div>
          <Form.Item label="提示词" name="prompt">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="描述智能体应该如何工作" />
          </Form.Item>
          <Form.Item label="支持输入" name="inputTypes">
            <Checkbox.Group options={skillInputOptions} />
          </Form.Item>
          <Form.Item label="输出格式" name="outputFormats">
            <Checkbox.Group options={skillOutputOptions} />
          </Form.Item>
          <Form.Item label="可用上下文" name="contextTypes">
            <Checkbox.Group options={skillContextOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

function SkillGroup({
  title,
  skills,
  selectedSkillId,
  onSelect,
  onToggle,
  onUse,
  onEdit,
  onDelete,
  emptyText,
}: {
  title: string;
  skills: ReportFactorySkill[];
  selectedSkillId: string;
  onSelect: (skillId: string) => void;
  onToggle: (skillId: string) => void;
  onUse: (skillId: string) => void;
  onEdit?: (skill: ReportFactorySkill) => void;
  onDelete?: (skill: ReportFactorySkill) => void;
  emptyText: string;
}) {
  return (
    <section className="report-factory-skill-group">
      <div className="report-factory-skill-group__title">
        <h2>{title}</h2>
        <span>{skills.length} 项</span>
      </div>
      {!skills.length ? (
        <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="report-factory-skill-list">
          {skills.map((skill) => (
            <article
              className={`report-factory-skill-card ${selectedSkillId === skill.id ? 'is-selected' : ''}`}
              key={skill.id}
              onClick={() => onSelect(skill.id)}
            >
              <div className="report-factory-skill-card__icon" style={{ color: skill.accent }}>
                <ToolOutlined />
              </div>
              <div className="report-factory-skill-card__content">
                <div className="report-factory-skill-card__title">
                  <strong>{skill.name}</strong>
                  <Switch
                    checked={skill.enabled}
                    onChange={() => onToggle(skill.id)}
                    onClick={(_, event) => event.stopPropagation()}
                    size="small"
                  />
                </div>
                <p>{skill.description}</p>
                <div className="report-factory-skill-card__footer">
                  <Button
                    disabled={!skill.enabled}
                    onClick={(event) => {
                      event.stopPropagation();
                      onUse(skill.id);
                    }}
                    size="small"
                    type="link"
                  >
                    使用技能
                  </Button>
                  {!skill.builtin && (
                    <Space size={0}>
                      <Button
                        aria-label={`编辑${skill.name}`}
                        icon={<EditOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit?.(skill);
                        }}
                        size="small"
                        type="text"
                      />
                      <Button
                        aria-label={`删除${skill.name}`}
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete?.(skill);
                        }}
                        size="small"
                        type="text"
                      />
                    </Space>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SkillDetail({
  skill,
  onToggle,
  onUse,
  onEdit,
}: {
  skill: ReportFactorySkill | null;
  onToggle: (skillId: string) => void;
  onUse: (skillId: string) => void;
  onEdit?: (skill: ReportFactorySkill) => void;
}) {
  if (!skill) {
    return <aside className="report-factory-skill-detail"><Empty description="选择技能查看详情" /></aside>;
  }

  return (
    <aside className="report-factory-skill-detail">
      <div className="report-factory-skill-detail__heading">
        <div className="report-factory-skill-card__icon" style={{ color: skill.accent }}>
          <ToolOutlined />
        </div>
        <div>
          <span className="report-factory-eyebrow">{skill.builtin ? '系统技能' : '自定义技能'}</span>
          <h2>{skill.name}</h2>
        </div>
      </div>
      <p className="report-factory-skill-detail__description">{skill.description}</p>
      <div className="report-factory-skill-detail__actions">
        <Button disabled={!skill.enabled} icon={<MessageOutlined />} onClick={() => onUse(skill.id)} type="primary">
          使用技能
        </Button>
        <Switch checked={skill.enabled} onChange={() => onToggle(skill.id)} checkedChildren="启用" unCheckedChildren="停用" />
        {onEdit && <Button icon={<EditOutlined />} onClick={() => onEdit(skill)}>编辑</Button>}
      </div>
      <SkillDetailSection label="技能提示词">
        <p className="report-factory-skill-detail__prompt">{skill.prompt}</p>
      </SkillDetailSection>
      <SkillDetailSection label="支持输入">
        <div className="report-factory-chip-list">{skill.inputTypes.map((item) => <Tag key={item}>{item}</Tag>)}</div>
      </SkillDetailSection>
      <SkillDetailSection label="输出格式">
        <div className="report-factory-chip-list">{skill.outputFormats.map((item) => <Tag color="blue" key={item}>{item}</Tag>)}</div>
      </SkillDetailSection>
      <SkillDetailSection label="可用上下文">
        <div className="report-factory-chip-list">{skill.contextTypes.map((item) => <Tag color="cyan" key={item}>{item}</Tag>)}</div>
      </SkillDetailSection>
    </aside>
  );
}

function SkillDetailSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="report-factory-skill-detail__section">
      <h3>{label}</h3>
      {children}
    </section>
  );
}

function formatConversationTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
