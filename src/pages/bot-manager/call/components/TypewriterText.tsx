/**
 * TypewriterText - 打字机效果组件
 */

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // 每个字符的间隔时间（毫秒）
  isComplete?: boolean; // 是否完成输入
}

const TypewriterText = ({ text, speed = 30, isComplete = false }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout | null = null;

    const typeNext = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        timer = setTimeout(typeNext, speed);
      }
    };

    typeNext();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="typing-cursor">|</span>}
    </span>
  );
};

export default TypewriterText;
