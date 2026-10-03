import { MenuIcon, XIcon, SunIcon, MoonIcon, UserIcon, ChevronDownIcon, TreePineIcon, SnowflakeIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/theme-context";
import { useChristmas } from "../context/christmas-context";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

// Animation des Lumières de Noël
const ChristmasLights = ({ isActive }) => {
    if (!isActive) return null;
    
    return (
        <div className="absolute top-0 left-0 w-full flex justify-around pointer-events-none z-[60] h-1">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1.5 h-2.5 rounded-b-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    animate={{
                        backgroundColor: i % 3 === 0 ? ["#ff4d4d", "#b30000", "#ff4d4d"] : 
                                        i % 3 === 1 ? ["#4dff4d", "#00b300", "#4dff4d"] : 
                                                    ["#ffd700", "#b8860b", "#ffd700"],
                        boxShadow: [
                            "0 0 5px currentColor",
                            "0 0 15px currentColor",
                            "0 0 5px currentColor"
                        ]
                    }}
                    transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.1
                    }}
                    style={{ color: i % 3 === 0 ? '#ff4d4d' : i % 3 === 1 ? '#4dff4d' : '#ffd700' }}
                />
            ))}
        </div>
    );
};

// Composant Confetti Lottie
const ConfettiAnimation = ({ trigger }) => {
    const confettiRef = useRef(null);
    const [confettiData, setConfettiData] = useState(null);

    useEffect(() => {
        // Charger l'animation confetti Lottie
        const loadConfetti = async () => {
            try {
                // Essayer de charger depuis le fichier local
                const confettiModule = await import("../animation/confeti.json");
                setConfettiData(confettiModule.default);
            } catch (error) {
                // Fallback vers une URL en ligne
                fetch("https://assets9.lottiefiles.com/packages/lf20_obhph3sh.json")
                    .then(res => res.json())
                    .then(data => setConfettiData(data))
                    .catch(console.error);
            }
        };
        loadConfetti();
    }, []);

    useEffect(() => {
        if (trigger && confettiRef.current && confettiData) {
            // Réinitialiser et jouer l'animation
            confettiRef.current.goToAndPlay(0, true);
        }
    }, [trigger, confettiData]);

    if (!confettiData) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            <Lottie
                lottieRef={confettiRef}
                animationData={confettiData}
                loop={false}
                autoplay={false}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isChristmasDropdownOpen, setIsChristmasDropdownOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    
    const { theme, toggleTheme } = useTheme();
    const { isChristmasMode, toggleChristmasMode, enableChristmasMode } = useChristmas();
    const navigate = useNavigate();

    const links = [
        { name: "Accueil", href: "/" },
        { name: "Contact", href: "/contact" },
        { name: "Support", href: "/support" },
        { name: "A propos", href: "/apropos" },
    ];

    

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        if (href.startsWith("#") && window.location.pathname === "/") {
            const targetId = href.replace("#", "");
            const elem = document.getElementById(targetId);
            if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
            setIsOpen(false);
        } else {
            navigate(href);
            setIsOpen(false);
        }
    };

    const handleChristmasModeToggle = () => {
        const newMode = !isChristmasMode;
        toggleChristmasMode();
        
        // Lancer l'animation confetti seulement quand on active le mode Noël
        if (newMode) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000); // Disparaît après 3 secondes
        }
    };

    const handleChristmasThemeSelect = (themeId) => {
        enableChristmasMode();
        setIsChristmasDropdownOpen(false);
        localStorage.setItem('selectedChristmasTheme', themeId);
        
        // Lancer l'animation confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    return (
        <>
            {/* Animation Confetti */}
            <ConfettiAnimation trigger={showConfetti} />
            
            <motion.nav
                className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3.5 md:px-16 lg:px-24 transition-all glass backdrop-blur-lg border-b border-white/10 ${
                    isChristmasMode ? 'christmas-nav' : ''
                }`}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <ChristmasLights isActive={isChristmasMode} />
                
                <a href="#home" onClick={(e) => scrollToSection(e, "#home")}>
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {isChristmasMode ? (
                            // Logo spécial Noël avec animation
                            <div className="flex items-center gap-2">
                                <motion.img 
                                    src="/assets/Noel1.png" 
                                    alt="logo Noël" 
                                    className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                                    
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                
                            </div>
                        ) : (
                            // Logo normal
                            <img 
                                src="/assets/Nc.png" 
                                alt="logo" 
                                className="h-8.5 w-auto"
                            />
                        )}
                        
                        {/* Badge "Noël" animé */}
                        {isChristmasMode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="ml-2 px-2 py-0.5 bg-gradient-to-r from-red-500 text-white text-xs font-bold rounded-full shadow-lg"
                            >
                                NOËL
                            </motion.div>
                        )}
                    </motion.div>
                </a>

                <div className="hidden items-center space-x-4 md:flex">
                    {links.map((link) => (
                        <Link key={link.name} to={link.href}
                            className={`text-sm font-medium transition hover:opacity-70 ${
                                theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                            } ${isChristmasMode ? 'hover:text-red-400' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Bouton thème Noël */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsChristmasDropdownOpen(!isChristmasDropdownOpen)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg glass transition-all duration-300 hover:scale-105 ${
                                isChristmasMode ? 'shadow-lg shadow-red-500/20 border border-red-500/30' : ''
                            }`}
                        >
                            <div className={`p-1.5 rounded-md ${
                                isChristmasMode ? 'bg-gradient-to-r from-red-500 to-green-500' : 'bg-white/10'
                            }`}>
                                {isChristmasMode ? (
                                    <TreePineIcon className="size-4 text-white" />
                                ) : (
                                    <TreePineIcon className="size-4" />
                                )}
                            </div>
                            <span className="text-sm font-medium">
                                {isChristmasMode ? '🎄' : 'Noël'}
                            </span>
                            <ChevronDownIcon className="size-3" />
                        </button>
                        
                        <AnimatePresence>
                            {isChristmasDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-56 glass rounded-lg shadow-lg border border-white/10 backdrop-blur-lg"
                                >
                                    <div className="p-3 border-b border-white/10">
                                        <h4 className="text-sm font-semibold text-white/90">Mode Noël</h4>
                                        <p className="text-xs text-white/60 mt-1">Activez la magie de Noël</p>
                                    </div>
                                    
                                    
                                    
                                    {/* Bouton toggle avec animation prometteuse */}
                                    <div className="p-2 border-t border-white/10">
                                        <button
                                            onClick={handleChristmasModeToggle}
                                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg transition-all duration-300 ${
                                                    isChristmasMode 
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' 
                                                        : 'bg-gray-500/20 group-hover:bg-red-500/20'
                                                }`}>
                                                    {isChristmasMode ? (
                                                        <motion.span 
                                                            className="text-white text-sm"
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            ON
                                                        </motion.span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">OFF</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {isChristmasMode ? 'Mode Noël Actif' : 'Mode Noël Inactif'}
                                                    </div>
                                                    <div className="text-xs text-white/60">
                                                        Cliquez pour {isChristmasMode ? 'désactiver' : 'activer'}
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                className={`w-2 h-2 rounded-full ${
                                                    isChristmasMode ? 'bg-green-500' : 'bg-gray-500'
                                                }`}
                                                animate={isChristmasMode ? { 
                                                    scale: [1, 1.5, 1],
                                                    boxShadow: ['0 0 0px #10b981', '0 0 10px #10b981', '0 0 0px #10b981']
                                                } : {}}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bouton thème sombre/clair */}
                    <button 
                        onClick={toggleTheme} 
                        className={`p-2 rounded-full glass transition hover:scale-105 ${
                            isChristmasMode ? 'hover:border-red-500/30' : ''
                        }`}
                    >
                        {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
                    </button>

                    {/* Dropdown utilisateur */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            className={`flex items-center space-x-1 p-2 rounded-full glass transition hover:scale-105 ${
                                isChristmasMode ? 'hover:border-red-500/30' : ''
                            }`}
                        >
                            <UserIcon className="size-5" />
                            <ChevronDownIcon className="size-4" />
                        </button>
                        
                        <AnimatePresence>
                            {isUserDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg border border-white/10"
                                >
                                    <Link 
                                        to="/login" 
                                        className={`block px-4 py-2 text-sm hover:bg-white/10 rounded-t-lg ${
                                            theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                                        }`}
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        Connexion
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className={`block px-4 py-2 text-sm hover:bg-white/10 rounded-b-lg ${
                                            theme === 'dark' ? 'text-white/80 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                                        }`}
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        Inscription
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <button 
                    onClick={() => setIsOpen(true)} 
                    className={`md:hidden ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>

            {/* Mobile Menu avec Noël */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className={`relative mx-4 w-full max-w-sm rounded-2xl glass border p-6 ${
                                isChristmasMode ? 'border-red-500/30 bg-gradient-to-b from-gray-900/90 to-red-900/20' : 'border-white/10'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 p-2"
                            >
                                <XIcon className="size-5" />
                            </button>

                            {/* Logo dans le menu mobile */}
                            <div className="flex justify-center mb-6">
                                <a href="#home" onClick={(e) => {
                                    scrollToSection(e, "#home");
                                    setIsOpen(false);
                                }}>
                                    {isChristmasMode ? (
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src="/assets/Nc.png" 
                                                alt="logo Noël" 
                                                className="h-10 w-auto filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                                            />
                                            <span className="text-xl">🎄</span>
                                        </div>
                                    ) : (
                                        <img 
                                            src="/assets/Nc.png" 
                                            alt="logo" 
                                            className="h-10 w-auto"
                                        />
                                    )}
                                </a>
                            </div>

                            <div className="mt-4 space-y-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`block rounded-lg px-4 py-3 text-lg font-medium hover:bg-white/10 ${
                                            isChristmasMode ? 'hover:text-red-300' : ''
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {/* Bouton thème Noël mobile avec effet confetti */}
                                <div className="border-t border-white/10 pt-4">
                                    <button
                                        onClick={() => {
                                            handleChristmasModeToggle();
                                            setIsOpen(false);
                                        }}
                                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 hover:bg-white/10 group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${
                                                isChristmasMode 
                                                    ? 'bg-gradient-to-r from-red-500 to-green-500 animate-pulse' 
                                                    : 'bg-white/10 group-hover:bg-red-500/20'
                                            }`}>
                                                <TreePineIcon className="size-5" />
                                            </div>
                                            <span>Mode Noël {isChristmasMode ? '🎄 ON' : 'OFF'}</span>
                                        </div>
                                        <div className={`w-3 h-3 rounded-full ${
                                            isChristmasMode ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                                        }`} />
                                    </button>
                                </div>

                                {/* Bouton thème mobile */}
                                <button
                                    onClick={toggleTheme}
                                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 hover:bg-white/10"
                                >
                                    <span>Thème {theme === "dark" ? "Clair" : "Sombre"}</span>
                                    {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
                                </button>

                                {/* Login/Register mobile */}
                                <div className="space-y-2 pt-4 border-t border-white/10">
                                    <Link
                                        to="/login"
                                        className="block rounded-lg bg-white/10 px-4 py-3 text-center hover:bg-white/20"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={`block rounded-lg px-4 py-3 text-center ${
                                            isChristmasMode 
                                                ? 'bg-gradient-to-r from-red-600 to-green-600 hover:opacity-90' 
                                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Inscription
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}