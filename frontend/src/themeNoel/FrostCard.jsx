import { motion } from "framer-motion";

export function FrostCard({ children, className = "", onClick }) {
    return (
        <motion.div
            className={`
                relative overflow-hidden rounded-xl backdrop-blur-md
                border border-white/20 bg-gradient-to-br from-white/10 to-white/5
                shadow-lg shadow-red-900/10
                before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-red-500/5 before:via-green-500/5 before:to-white/5
                before:border before:border-white/10
                ${className}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
        >
            {/* Effet de lumière de Noël */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-green-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-white/20 rounded-full blur-3xl" />
            
            {/* Effet de neige */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-fall"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random() * 0.5 + 0.3
                        }}
                    />
                ))}
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}