import { motion } from "motion/react";

interface Props {
  category: { id: string; emoji: string; label: string };
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className="w-full bg-card border border-border rounded-2xl p-3 text-center shadow-card hover:border-primary/40 hover:bg-accent/30 transition-colors"
    >
      <div className="text-2xl mb-1.5">{category.emoji}</div>
      <div className="font-body font-semibold text-xs leading-tight">
        {category.label}
      </div>
    </motion.button>
  );
}
