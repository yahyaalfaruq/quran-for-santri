'use client';
interface HighlightTextProps {
  text: string;
  highlight: string;
}

export default function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight) {
    return (
      <span className="leading-loose text-right text-black text-2xl md:text-3xl">
        {text}
      </span>
    );
  }
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span className="leading-loose text-right text-black text-2xl md:text-3xl">
      {parts.map((part, index) => (
        <span key={index}>
          {part}
        </span>
      ))}
    </span>
  );
}
