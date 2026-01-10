/**
 * ChatMessage - 对话消息组件
 */

interface ChatMessageProps {
  type: 'ai' | 'user';
  text: string;
  timestamp?: string;
  isTyping?: boolean;
}

const ChatMessage = ({ type, text, timestamp, isTyping = false }: ChatMessageProps) => {
  return (
    <div className={`chat-message chat-message--${type}`}>
      <div className={`message-bubble message-bubble--${type}`}>
        {type === 'ai' ? <span className="message-prefix">AI: </span> : null}
        {text}
        {isTyping && <span className="typing-indicator">...</span>}
      </div>
      {timestamp && <div className="message-timestamp">{timestamp}</div>}
    </div>
  );
};

export default ChatMessage;
