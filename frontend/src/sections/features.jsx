import SectionTitle from "../components/section-title";
import { ShieldIcon, AlertTriangleIcon, BrainIcon, ZapIcon, SearchIcon, BarChartIcon } from "lucide-react";
import { FrostCard } from "../themeNoel/FrostCard";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Features() {
    const refs = useRef([]);

    const featuresData = [
        {
            icon: ShieldIcon,
            title: "Détection Intelligente",
            description: "Notre IA analyse et détecte la désinformation en temps réel avec une précision de 99%.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: AlertTriangleIcon,
            title: "Analyse de Contenu Toxique",
            description: "Identification automatique du langage inapproprié, haineux ou discriminatoire dans l'environnement éducatif.",
            gradient: "from-red-500 to-orange-500"
        },
        {
            icon: BrainIcon,
            title: "Safe Exam Intégré",
            description: "Système de surveillance intelligent garantissant l'intégrité académique pendant les examens.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: ZapIcon,
            title: "Scoring de Fiabilité",
            description: "Évaluation automatisée de la crédibilité des sources et contenus pédagogiques.",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: SearchIcon,
            title: "Recherche Sécurisée",
            description: "Moteur de recherche éducatif qui filtre automatiquement les sources non fiables.",
            gradient: "from-indigo-500 to-purple-500"
        },
        {
            icon: BarChartIcon,
            title: "Analytics Avancés",
            description: "Tableaux de bord détaillés pour suivre les progrès et identifier les difficultés des étudiants.",
            gradient: "from-yellow-500 to-amber-500"
        }
    ];

    return (
        <section className="mt-32 relative" id="features">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
            </div>

            <SectionTitle
                title="Fonctionnalités Intelligentes"
                description="Notre plateforme éducative transforme l'apprentissage avec des outils IA avancés pour détecter la désinformation, analyser le contenu toxique, sécuriser les examens et évaluer la fiabilité."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4 max-w-7xl mx-auto">
                {featuresData.map((feature, index) => (
                    <motion.div
                        key={index}
                        ref={(el) => (refs.current[index] = el)}
                        className="group relative"
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 1
                        }}
                        onAnimationComplete={() => {
                            const card = refs.current[index];
                            if (card) {
                                card.classList.add("transition", "duration-300");
                            }
                        }}
                    >
                        <FrostCard className="h-full p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/10 group-hover:border-white/20">
                            {/* Icon with gradient background */}
                            <div className={`mb-6 inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.gradient}`}>
                                    <feature.icon className="size-6 text-white" />
                                </div>
                            </div>

                            {/* Feature Content */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold tracking-tight">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Indicator */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors duration-300">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                                        <span>Détection en temps réel</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
                        </FrostCard>

                        {/* Decorative element */}
                        <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                    </motion.div>
                ))}
            </div>

            {/* Stats Section */}
            <motion.div
                className="mt-20 max-w-4xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
            >
                <FrostCard className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "99%", label: "Précision de détection" },
                            { value: "0.2s", label: "Temps de réponse" },
                            { value: "1M+", label: "Sources analysées" },
                            { value: "24/7", label: "Surveillance active" }
                        ].map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </FrostCard>
            </motion.div>
        </section>
    );
}