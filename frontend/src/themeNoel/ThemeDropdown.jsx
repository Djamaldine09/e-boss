import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    SnowflakeIcon, 
    TreePineIcon, 
    GiftIcon,
    CandyCaneIcon,
    BellIcon,
    StarIcon
} from "lucide-react";

export function NoelThemeDropdown() {
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    
    const noelThemes = [
        {
            id: "classic",
            name: "Noël Classique",
            icon: TreePineIcon,
            colors: "from-red-500 to-green-500",
            description: "Rouge et vert traditionnel"
        },
        {
            id: "winter",
            name: "Hiver Magique",
            icon: SnowflakeIcon,
            colors: "from-blue-400 to-cyan-300",
            description: "Blanc et bleu glacé"
        },
        {
            id: "golden",
            name: "Noël Doré",
            icon: StarIcon,
            colors: "from-amber-500 to-yellow-300",
            description: "Or et lumière"
        },
        {
            id: "candy",
            name: "Bonbon",
            icon: CandyCaneIcon,
            colors: "from-pink-400 to-red-400",
            description: "Couleurs sucrées"
        }
    ];

    const [selectedTheme, setSelectedTheme] = useState(noelThemes[0]);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg glass transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedTheme.colors}`}>
                    <selectedTheme.icon className="size-5 text-white" />
                </div>
                <span className="text-sm font-medium">Thème Noël</span>
                <div className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-red-500 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-green-500 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-white mx-0.5" />
                </div>
            </button>
            
            <AnimatePresence>
                {isThemeDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 glass rounded-xl shadow-xl shadow-red-900/20 border border-white/20 backdrop-blur-lg"
                    >
                        <div className="p-3 border-b border-white/10">
                            <h4 className="text-sm font-semibold text-white/90">Thèmes de Noël</h4>
                            <p className="text-xs text-white/60 mt-1">Choisissez votre ambiance festive</p>
                        </div>
                        
                        <div className="p-2 space-y-1">
                            {noelThemes.map((theme) => (
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
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        {/* Footer avec effet de neige */}
                        <div className="p-3 border-t border-white/10 bg-gradient-to-r from-red-900/10 to-green-900/10 rounded-b-xl">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <span>🎄 Joyeux Noël !</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-red-400" />
                                    <div className="w-1 h-1 rounded-full bg-green-400" />
                                    <div className="w-1 h-1 rounded-full bg-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}