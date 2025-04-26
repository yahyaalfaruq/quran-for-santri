'use client';
interface HighlightTextProps {
  text: string;
  highlight: string;
}

export default function HighlightText({ text, highlight }: HighlightTextProps) {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span className="leading-loose text-right text-2xl md:text-3xl">
      {parts.map((part, index) => (
        <span key={index} className={part.toLowerCase() === highlight.toLowerCase() ? 'bg-yellow-300' : ''}>
          {part}
        </span>
      ))}
    </span>
  );
}
