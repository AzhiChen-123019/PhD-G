import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  // 发件人信息
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  // 收件人信息
  recipients: [{
    type: String,
    required: true,
  }],
  // 邮件主题和内容
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  // 邮件状态
  status: {
    type: String,
    enum: ['draft', 'sent', 'delivered', 'read', 'failed'],
    default: 'draft',
  },
  // 邮件类型
  type: {
    type: String,
    enum: ['internal', 'external'],
    default: 'internal',
  },
  // 外部邮件的跟踪信息
  tracking: {
    sentAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
    bounceStatus: {
      type: String,
    },
    bounceReason: {
      type: String,
    },
  },
  // 回复相关
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Email',
  },
  // 附件
  attachments: [{
    type: String,
  }],
  // 标记
  isImportant: {
    type: Boolean,
    default: false,
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
  // 文件夹
  folder: {
    type: String,
    enum: ['inbox', 'sent', 'drafts', 'trash', 'spam'],
    default: 'inbox',
  },
  // 时间戳
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.models.Email || mongoose.model('Email', EmailSchema);

export default Email;