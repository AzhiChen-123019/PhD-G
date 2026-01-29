import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  // 对话ID，用于标识同一对话
  conversationId: {
    type: String,
    required: true,
  },
  // 发送者ID
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // 接收者ID
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // 消息内容
  content: {
    type: String,
    required: true,
  },
  // 消息类型，如text、image、file等
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
  // 消息状态，如sent、delivered、read
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  // 消息创建时间
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // 消息更新时间
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message;
