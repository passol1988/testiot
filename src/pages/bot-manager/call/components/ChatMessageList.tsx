/**
 * ChatMessageList - 对话消息列表组件
 * 与 bot-manager 的消息事件兼容
 */

import { useState, useEffect, useRef, type MutableRefObject } from 'react';
import { type WsChatClient, WsChatEventNames, type WsChatEventData, ClientEventType, type AudioSentencePlaybackStartEvent } from '@coze/api/ws-tools';
import { WebsocketsEventType, type ConversationAudioTranscriptCompletedEvent } from '@coze/api';

interface Message {
  type: 'ai' | 'user';
  content: string;
  timestamp: number;
  isComplete?: boolean;
  sentences?: string[];
  activeSentenceIndex?: number;
}

interface ChatMessageListProps {
  clientRef: MutableRefObject<WsChatClient | undefined>;
}

const ChatMessageList = ({ clientRef }: ChatMessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const isFirstDeltaRef = useRef(true);
  const isFirstSentenceRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!clientRef.current) return;

    const handleMessageEvent = (eventName: string, event: WsChatEventData) => {
      if (eventName === WsChatEventNames.CONNECTED) {
        setMessages([]);
        setIsAiTyping(false);
        isFirstDeltaRef.current = true;
        isFirstSentenceRef.current = true;
        return;
      }
      if (!event) return;

      switch (event.event_type) {

        // 流式模式事件
        case WebsocketsEventType.CONVERSATION_AUDIO_TRANSCRIPT_COMPLETED: {
          const { content } = (event as ConversationAudioTranscriptCompletedEvent).data;
          const timestamp = Date.now();
          setMessages(prev => [...prev, { type: 'user', content, timestamp, isComplete: true }]);
          break;
        }

        case WebsocketsEventType.CONVERSATION_MESSAGE_DELTA: {
          if (event.data.content) {
            setIsAiTyping(true);
            if (isFirstDeltaRef.current) {
              // 创建新的 AI 消息
              setMessages(prev => [
                ...prev,
                {
                  type: 'ai',
                  content: event.data.content,
                  timestamp: Date.now(),
                  isComplete: false,
                },
              ]);
              isFirstDeltaRef.current = false;
            } else {
              // 追加到最后一条 AI 消息
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.type === 'ai' && !lastMessage.isComplete) {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMessage,
                      content: lastMessage.content + event.data.content,
                    },
                  ];
                }
                return prev;
              });
            }
          }
          break;
        }

        case WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED: {
          // 标记最后一条 AI 消息完成
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.type === 'ai') {
              return [...prev.slice(0, -1), { ...lastMessage, isComplete: true }];
            }
            return prev;
          });
          setIsAiTyping(false);
          isFirstDeltaRef.current = true;
          break;
        }

        // 音字同步模式事件
        case ClientEventType.AUDIO_SENTENCE_PLAYBACK_START: {
          const { content } = (event as AudioSentencePlaybackStartEvent).data;
          setIsAiTyping(true);
          if (isFirstSentenceRef.current) {
            // 创建新的 AI 消息
            setMessages(prev => [
              ...prev,
              {
                type: 'ai',
                timestamp: Date.now(),
                content,
                isComplete: false,
                sentences: [content],
                activeSentenceIndex: 0,
              },
            ]);
            isFirstSentenceRef.current = false;
          } else {
            // 追加句子
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage && lastMessage.type === 'ai' && !lastMessage.isComplete) {
                const sentences = [...(lastMessage.sentences || []), content];
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    content: lastMessage.content + content,
                    sentences,
                    activeSentenceIndex: sentences.length - 1,
                  },
                ];
              }
              return prev;
            });
          }
          break;
        }

        case ClientEventType.AUDIO_SENTENCE_PLAYBACK_ENDED: {
          // 标记最后一条 AI 消息完成
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.type === 'ai') {
              return [...prev.slice(0, -1), { ...lastMessage, isComplete: true }];
            }
            return prev;
          });
          setIsAiTyping(false);
          isFirstSentenceRef.current = true;
          break;
        }

        default:
          break;
      }
    };

    clientRef.current.on(WsChatEventNames.ALL, handleMessageEvent);

    return () => {
      clientRef.current?.off(WsChatEventNames.ALL, handleMessageEvent);
    };
  }, [clientRef.current]);

  // 格式化时间戳
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message chat-message--${msg.type}`}>
          <div className={`message-bubble message-bubble--${msg.type}`}>
            {msg.content}
          </div>
          <div className="message-timestamp">{formatTime(msg.timestamp)}</div>
        </div>
      ))}

      {/* AI 正在输入指示器 */}
      {isAiTyping && (
        <div className="chat-message chat-message--ai">
          <div className="message-bubble message-bubble--ai">
            <span className="typing-indicator">...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
