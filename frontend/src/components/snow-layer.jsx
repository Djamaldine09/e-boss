import { motion } from "framer-motion";

const SnowLayer = () => {
  const snowflakes = Array.from({ length: 40 }); // 40 flocons pour rester fluide
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((_, i) => {
        const size = Math.random() * 4 + 2; 
        const xPos = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * -20; // Délai négatif pour qu'ils soient déjà là au chargement

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-40 blur-[0.5px]"
            style={{
              width: size,
              height: size,
              left: `${xPos}%`,
              top: -10,
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: ["-15px", "15px", "-15px"],
            }}
            transition={{
              y: { duration, repeat: Infinity, ease: "linear", delay },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        );
      })}
    </div>
  );
};

export default SnowLayer;
