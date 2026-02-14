
import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, speed = 50, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayText}</span>;
};

export default GlitchText;
