import { useChristmas } from "../context/christmas-context";

export default function ChristmasWrapper({ children }) {
    const { isChristmasMode } = useChristmas();

    return (
        <div className={`min-h-screen transition-all duration-500 ${isChristmasMode ? 'christmas-mode' : ''}`}>
            {/* Effet de neige */}
            {isChristmasMode && (
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: Math.random() * 0.5 + 0.3,
                                animationDuration: `${Math.random() * 10 + 10}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Overlay de lumière de Noël */}
            {isChristmasMode && (
                <div className="fixed inset-0 pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/5 to-green-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-green-500/5 to-red-500/5 rounded-full blur-3xl" />
                </div>
            )}

            {children}
        </div>
    );
}