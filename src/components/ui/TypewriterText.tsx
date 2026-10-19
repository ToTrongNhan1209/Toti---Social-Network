"use client";

/**
 * components/ui/TypewriterText.tsx
 * Premium Typewriter Text Animation with realistic typing cadence,
 * dynamic phrase cycling, glowing cursor, and zero layout shift.
 */

import React, { useState, useEffect, useRef, useMemo } from "react";

interface TypewriterTextProps {
  /** Single string or list of phrases to type through sequentially */
  texts: string | string[];
  /** Typing speed in ms per character (default: 50) */
  typingSpeed?: number;
  /** Deletion speed in ms per character when cycling (default: 30) */
  deletingSpeed?: number;
  /** Pause duration in ms at the end of each phrase (default: 2200) */
  pauseDuration?: number;
  /** Whether to loop through the texts infinitely (default: true for array) */
  loop?: boolean;
  /** Custom cursor character (default: "|") */
  cursorChar?: string;
  /** Cursor color (default: "#237A60") */
  cursorColor?: string;
  /** Extra CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Callback when full typing finishes (for single-run mode) */
  onComplete?: () => void;
}

export default function TypewriterText({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2200,
  loop = true,
  cursorChar = "|",
  cursorColor = "#237A60",
  className = "",
  style = {},
  onComplete,
}: TypewriterTextProps) {
  const phrases = useMemo(() => {
    return Array.isArray(texts) ? texts : [texts];
  }, [texts]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Typing logic
  useEffect(() => {
    const currentTargetPhrase = phrases[currentPhraseIndex] || "";

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentTargetPhrase.length) {
          setDisplayText(currentTargetPhrase.slice(0, displayText.length + 1));
          timerRef.current = setTimeout(handleTyping, typingSpeed);
        } else {
          // Finished typing this phrase
          if (phrases.length === 1 && !loop) {
            if (onComplete) onComplete();
            return;
          }
          // Pause before deleting
          timerRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else {
        // Deleting backwards
        if (displayText.length > 0) {
          setDisplayText(currentTargetPhrase.slice(0, displayText.length - 1));
          timerRef.current = setTimeout(handleTyping, deletingSpeed);
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    timerRef.current = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration, loop, onComplete]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        ...style,
      }}
      aria-label={phrases[currentPhraseIndex]}
    >
      <span>{displayText}</span>
      <span
        style={{
          display: "inline-block",
          marginLeft: "2px",
          color: cursorColor,
          fontWeight: 300,
          opacity: cursorVisible ? 1 : 0,
          transition: "opacity 0.1s ease",
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        {cursorChar}
      </span>
    </span>
  );
}
