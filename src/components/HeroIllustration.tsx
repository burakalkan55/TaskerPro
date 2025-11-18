import { motion } from "@/components/motion";

export default function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
      className="mt-12 w-full flex justify-center"
    >
      <svg
        viewBox="0 0 520 260"
        className="w-[90%] max-w-[520px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="20" y="40" width="140" height="180" rx="12" fill="#ffffff" stroke="#d1d5db" />
        <rect x="200" y="40" width="140" height="180" rx="12" fill="#ffffff" stroke="#d1d5db" />
        <rect x="380" y="40" width="120" height="180" rx="12" fill="#ffffff" stroke="#d1d5db" />

        <rect x="40" y="70" width="100" height="30" rx="6" fill="#3b82f6" opacity="0.7" />
        <rect x="40" y="115" width="100" height="30" rx="6" fill="#9ca3af" opacity="0.4" />
        <rect x="40" y="160" width="100" height="30" rx="6" fill="#9ca3af" opacity="0.4" />

        <rect x="220" y="70" width="100" height="30" rx="6" fill="#9ca3af" opacity="0.4" />
        <rect x="220" y="115" width="100" height="30" rx="6" fill="#3b82f6" opacity="0.7" />
        <rect x="220" y="160" width="100" height="30" rx="6" fill="#9ca3af" opacity="0.4" />

        <rect x="400" y="70" width="80" height="30" rx="6" fill="#9ca3af" opacity="0.4" />
        <rect x="400" y="115" width="80" height="30" rx="6" fill="#9ca3af" opacity="0.4" />
        <rect x="400" y="160" width="80" height="30" rx="6" fill="#3b82f6" opacity="0.7" />
      </svg>
    </motion.div>
  );
}
