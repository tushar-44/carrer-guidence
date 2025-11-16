import type { SkillCardProps } from "./types";

export function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <a href={`/jobs/${index + 1}`} key={index} className="bg-black hover:bg-gray-900 transition-colors cursor-pointer">
      <div className="p-6 flex flex-col items-center justify-center text-center h-[180px] w-full">
        <div className="mb-4">
          {skill.icon}
        </div>
        <span className="font-body text-sm text-foreground font-light">
          {skill.name}
        </span>
      </div>
    </a>
  );
}
