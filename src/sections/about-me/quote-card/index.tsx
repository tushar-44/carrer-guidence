export function QuoteCard() {
  return (
    <div className="bento-no-min row-span-3 flex flex-col h-full">
      <h3 className="font-heading text-md [@media(min-width:414px)]:text-lg text-foreground mb-4">
        Your Career Success Story
      </h3>
      <p className="font-body text-sm text-muted-foreground font-light leading-relaxed">
        "The right career guidance can transform confusion into clarity, doubt into confidence, and potential into achievement. Every student deserves the tools to build their dream future."
      </p>
    </div>
  );
}
