import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    EggIcon, 
    RabbitIcon, 
    FlowerIcon,
    SproutIcon,
    CloudIcon,
    SparklesIcon
} from "lucide-react";

export function PaqueThemeDropdown() {
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    
    const paqueThemes = [
        {
            id: "spring",
            name: "Printanier",
            icon: FlowerIcon,
            colors: "from-green-400 to-yellow-300",
            description: "Fleurs et verdure"
        },
        {
            id: "eggs",
            name: "Œufs Colorés",
            icon: EggIcon,
            colors: "from-purple-400 to-pink-300",
            description: "Couleurs pastel"
        },
        {
            id: "bunny",
            name: "Lapin de Pâques",
            icon: RabbitIcon,
            colors: "from-blue-300 to-cyan-200",
            description: "Douceur et légèreté"
        },
        {
            id: "sunshine",
            name: "Rayon de Soleil",
            icon: SparklesIcon,
            colors: "from-amber-400 to-yellow-200",
            description: "Lumière et chaleur"
        }
    ];

    const [selectedTheme, setSelectedTheme] = useState(paqueThemes[0]);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg glass transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedTheme.colors}`}>
                    <selectedTheme.icon className="size-5 text-white" />
                </div>
                <span className="text-sm font-medium">Thème Pâques</span>
                <div className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-purple-400 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-pink-300 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-yellow-300 mx-0.5" />
                </div>
            </button>
            
            <AnimatePresence>
                {isThemeDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 glass rounded-xl shadow-xl shadow-purple-900/20 border border-white/20 backdrop-blur-lg"
                    >
                        <div className="p-3 border-b border-white/10">
                            <h4 className="text-sm font-semibold text-white/90">Thèmes de Pâques</h4>
                            <p className="text-xs text-white/60 mt-1">Choisissez votre ambiance printanière</p>
                        </div>
                        
                        <div className="p-2 space-y-1">
                            {paqueThemes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        setSelectedTheme(theme);
                                        setIsThemeDropdownOpen(false);
                                        // Ici vous pouvez dispatcher une action pour changer le thème global
                                    }}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                        selectedTheme.id === theme.id 
                                            ? 'bg-white/10 border border-white/20' 
                                            : 'hover:bg-white/5'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.colors}`}>
                                        <theme.icon className="size-4 text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-white">
                                            {theme.name}
                                        </div>
                                        <div className="text-xs text-white/60">
                                            {theme.description}
                                        </div>
                                    </div>
                                    {selectedTheme.id === theme.id && (
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.colors}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        {/* Footer avec effet de Pâques */}
                        <div className="p-3 border-t border-white/10 bg-gradient-to-r from-purple-900/10 to-pink-900/10 rounded-b-xl">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span>🐣 Joyeuses Pâques !</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-purple-400" />
                                    <div className="w-1 h-1 rounded-full bg-pink-300" />
                                    <div className="w-1 h-1 rounded-full bg-yellow-300" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}