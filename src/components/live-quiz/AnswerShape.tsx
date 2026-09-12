export default function AnswerShape({ shape, className }: { shape: string; className?: string }) {
  const props = { className, fill: "currentColor" };
  switch (shape) {
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M12 3l10 18H2z" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M12 2l10 10-10 10L2 12z" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <rect x="3" y="3" width="18" height="18" />
        </svg>
      );
  }
}
