import { QuizStepper } from '@/components/ui/quiz-stepper';

export function Assessment() {
  return (
    <section
      id="assessment"
      className="py-20 px-6 md:px-12 lg:px-16"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-body text-lg font-light text-foreground mb-4">
            CAREER APTITUDE ASSESSMENT
          </h2>
          <p className="font-heading text-5xl text-foreground mb-4">
            Discover your ideal career in just 3 steps!
          </p>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop guessing your future. Our data-driven tests analyze your true aptitude, personality, and interests to find high-match career paths.
          </p>
        </div>

        {/* Quiz Component */}
        <QuizStepper />
      </div>
    </section>
  );
}
