import React, { useMemo } from "react";

export function FlipText({
  className = "",
  children,
  duration = 2.2,
  delay = 0,
  loop = true,
  separator = " ",
  together = false,
}) {
  const words = useMemo(
    () => children.split(separator),
    [children, separator]
  );

  const totalChars = Math.max(children.length, 1);

  const getCharIndex = (wordIndex, charIndex) => {
    let index = 0;

    for (let i = 0; i < wordIndex; i += 1) {
      index +=
        words[i].length +
        (separator === " " ? 1 : separator.length);
    }

    return index + charIndex;
  };

  return (
    <span
      className={`flip-text-wrapper inline-block align-baseline leading-none ${className}`}
      style={{ perspective: "1000px" }}
      aria-label={children}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="flip-word inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          {word.split("").map((char, charIndex) => {
            const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

            let calculatedDelay = delay;

            if (!together) {
              const normalizedIndex = currentGlobalIndex / totalChars;
              const sineValue = Math.sin(
                normalizedIndex * (Math.PI / 2)
              );
              calculatedDelay =
                sineValue * (duration * 0.25) + delay;
            }

            return (
              <span
                key={`${char}-${charIndex}`}
                className="flip-char inline-block relative"
                data-char={char}
                style={{
                  "--flip-duration": `${duration}s`,
                  "--flip-delay": `${calculatedDelay}s`,
                  "--flip-iteration": loop ? "infinite" : "1",
                }}
              >
                {char}
              </span>
            );
          })}

          {separator === " " && wordIndex < words.length - 1 && (
            <span className="inline-block" aria-hidden="true">
              &nbsp;
            </span>
          )}

          {separator !== " " && wordIndex < words.length - 1 && (
            <span className="inline-block" aria-hidden="true">
              {separator}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

export default FlipText;
