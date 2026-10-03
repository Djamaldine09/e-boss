import { motion } from "framer-motion";

export function PaqueCard({ children, className = "", onClick }) {
    return (
        <motion.div
            className={`
                relative overflow-hidden rounded-xl backdrop-blur-md
                border border-white/20 bg-gradient-to-br from-white/10 to-white/5
                shadow-lg shadow-purple-900/10
                before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-purple-400/5 before:via-pink-300/5 before:to-yellow-300/5
                before:border before:border-white/10
                ${className}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
        >
            {/* Effet de lumière de Pâques */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-green-300/20 rounded-full blur-3xl" />
            
            {/* Effet d'œufs de Pâques */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random() * 0.3 + 0.1
                        }}
                    >
                        <div className={`w-3 h-4 rounded-full ${
                            i % 3 === 0 ? 'bg-purple-400/30' :
                            i % 3 === 1 ? 'bg-pink-300/30' :
                            'bg-yellow-300/30'
                        }`} />
                    </div>
                ))}
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}