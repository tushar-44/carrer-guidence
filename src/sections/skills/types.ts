export interface Skill {
    name: string;
    icon: React.ReactNode;
  }
  
  export interface SkillCardProps {
    skill: Skill;
    index: number;
  }