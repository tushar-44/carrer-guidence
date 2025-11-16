import { Brain, Users, Briefcase, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "Assessments",
    description: "Stop guessing your future. Our data-driven tests analyze your true aptitude, personality, and interests to find high-match career paths."
  },
  {
    icon: <Users className="w-8 h-8 text-green-500" />,
    title: "Mentors",
    description: "Bridge your skill gap. Connect with professionals who are working in your ideal industry right now for real-world guidance."
  },
  {
    icon: <Briefcase className="w-8 h-8 text-purple-500" />,
    title: "Jobs",
    description: "Land your dream role. Access exclusive job listings and get matched with opportunities that align with your career goals."
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
    title: "Community Hub",
    description: "Grow together. Join peers and experts in discussions, workshops, and events that accelerate your career development."
  }
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-16 py-12">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="font-heading text-lg text-foreground mb-2">
            {feature.title}
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
