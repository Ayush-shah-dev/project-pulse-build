
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  name: string;
  level?: 'beginner' | 'intermediate' | 'expert';
  className?: string;
}

const SkillBadge = ({ name, level = 'intermediate', className }: SkillBadgeProps) => {
  const getBadgeColor = () => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
      getBadgeColor(),
      className
    )}>
      {name}
    </span>
  );
};

export default SkillBadge;
