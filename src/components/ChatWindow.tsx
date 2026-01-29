'use client';

import { useState, useEffect, useRef } from 'react';
import { UserData } from '@/lib/admin-types';

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

interface ChatWindowProps {
  currentUser: UserData;
  recipient: UserData;
  initialMessages?: Message[];
  onClose: () => void;
}

export default function ChatWindow({ currentUser, recipient, initialMessages = [], onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 生成对话ID
  const conversationId = [currentUser._id, recipient._id].sort().join('-');

  // 连接WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      // 注册用户
      ws.send(JSON.stringify({
        type: 'register',
        userId: currentUser._id
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'newMessage':
          setMessages(prev => [...prev, data.message]);
          break;
        case 'typing':
          if (data.senderId === recipient._id) {
            setRecipientTyping(data.isTyping);
            // 3秒后自动取消输入状态
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setRecipientTyping(false);
            }, 3000);
          }
          break;
        case 'messagesRead':
          setMessages(prev => 
            prev.map(msg => 
              msg.conversationId === data.conversationId && msg.receiverId === currentUser._id
                ? { ...msg, status: 'read' }
                : msg
            )
          );
          break;
        default:
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentUser._id, recipient._id]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket) return;

    const message = {
      type: 'sendMessage',
      conversationId,
      senderId: currentUser._id,
      receiverId: recipient._id,
      content: inputValue.trim(),
      contentType: 'text' as const
    };

    socket.send(JSON.stringify(message));
    setInputValue('');
    setIsTyping(false);

    // 立即在本地显示消息
    const localMessage: Message = {
      _id: `temp-${Date.now()}`,
      conversationId,
      senderId: currentUser._id,
      receiverId: recipient._id,
      content: inputValue.trim(),
      type: 'text',
      status: 'sent',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, localMessage]);

    // 发送停止输入状态
    socket.send(JSON.stringify({
      type: 'typing',
      senderId: currentUser._id,
      receiverId: recipient._id,
      isTyping: false
    }));
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // 发送输入状态
    if (socket) {
      socket.send(JSON.stringify({
        type: 'typing',
        senderId: currentUser._id,
        receiverId: recipient._id,
        isTyping: e.target.value.length > 0
      }));
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      {/* 聊天窗口头部 */}
      <div className="flex justify-between items-center p-3 bg-primary text-white rounded-t-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-medium mr-2">
            {recipient.realName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium">{recipient.realName}</h3>
            <p className="text-xs opacity-90">{recipient.role === 'customer_service' ? '客服' : '用户'}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 聊天消息列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            开始聊天吧！
          </div>
        ) : (
          messages.map((message) => {
            const isSentByCurrentUser = message.senderId === currentUser._id;
            return (
              <div 
                key={message._id}
                className={`mb-4 flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${isSentByCurrentUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  <p>{message.content}</p>
                  <div className="flex items-center mt-1 justify-end">
                    <span className="text-xs opacity-75">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isSentByCurrentUser && (
                      <span className={`ml-1 text-xs ${message.status === 'read' ? 'opacity-100' : 'opacity-50'}`}>
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {recipientTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 text-gray-800">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 聊天输入框 */}
      <div className="border-t p-3">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-1 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
