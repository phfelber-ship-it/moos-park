export default function FlipText({ text }: { text: string }) {
  return (
    <span className="flip-text">
      <span className="flip-face flip-front">{text}</span>
      <span className="flip-face flip-back" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
