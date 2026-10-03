import { motion } from "framer-motion";

export default function TrustedCompanies() {
    const logos = [
        {
            name: "Paris-Saclay",
            src: "/assets/comp1.png", // Remplacez par vos fichiers réels
            fallback: "UPS"
        },
        {
            name: "Éducation Nationale",
            src: "/assets/education-logo.svg",
            fallback: "MEN"
        },
        {
            name: "CNED",
            src: "/assets/cned-logo.svg",
            fallback: "CNED"
        },
        {
            name: "Sorbonne",
            src: "/assets/sorbonne-logo.svg",
            fallback: "SU"
        },
        {
            name: "Campus France",
            src: "/assets/campus-france-logo.svg",
            fallback: "CF"
        }
    ];

    return (
        <motion.section className="mt-14"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
        >
            <p className="py-6 mt-14 text-center text-gray-400">
                Confiance accordée par les leaders de l'éducation —
            </p>

            <div className="flex flex-wrap justify-center gap-10 max-w-5xl w-full mx-auto py-4 px-4">
                {logos.map((logo, index) => (
                    <motion.div
                        key={index}
                        className="group relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 70,
                            mass: 1
                        }}
                    >
                        {/* Logo avec fallback */}
                        <div className="h-14 w-34 flex items-center justify-center bg-white backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/20 transition-colors duration-300">
                            {logo.src ? (
                                <img 
                                    src={logo.src} 
                                    alt={logo.name}
                                    className="h-8 w-auto max-w-full"
                                    onError={(e) => {
                                        // Fallback si l'image ne charge pas
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `<span class="font-bold text-white text-sm">${logo.fallback}</span>`;
                                    }}
                                />
                            ) : (
                                <span className="font-bold text-white text-sm">{logo.fallback}</span>
                            )}
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-gray-300 whitespace-nowrap">
                                {logo.name}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}