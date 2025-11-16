export function SimpleTextCard({ text, className = "" }: { text: string, className?: string }) {
  return (
    <div className={`bento-no-min flex items-center justify-center h-36 [@media(min-width:1381px)]:h-full ${className}`}>
      <h3 className="font-heading text-2xl text-foreground text-center">
        {text}
      </h3>
    </div>
  );
}