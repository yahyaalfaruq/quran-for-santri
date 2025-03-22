// app/components/HighlightText.tsx
'use client';
export default function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <p className="text-lg">
      {parts.map((part, index) => (
        <span key={index} className={part.toLowerCase() === highlight.toLowerCase() ? 'bg-yellow-300' : ''}>
          {part}
        </span>
      ))}
    </p>
  );
}