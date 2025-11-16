import type { SkillPillProps } from "./types";

export function SkillPill({ icon, name }: SkillPillProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border border-[#353739] rounded-full bg-black/20 whitespace-nowrap">
      <div className="w-6 h-6 flex-shrink-0">
        {icon}
      </div>
      <span className="font-body text-sm text-[#f2f2f2]">{name}</span>
    </div>
  );
}
