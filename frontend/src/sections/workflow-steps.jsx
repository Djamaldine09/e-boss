import { motion } from "framer-motion";
import SectionTitle from "../components/section-title";
import { 
  SearchIcon, 
  ShieldIcon, 
  BrainIcon, 
  GraduationCapIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Analyse & Détection IA",
        description: "Notre intelligence artificielle scanne automatiquement le contenu éducatif pour identifier la désinformation et les fake news en temps réel.",
        icon: SearchIcon,
        color: "from-purple-500 to-pink-500",
        features: [
            "Analyse en temps réel",
            "Détection de 99% de précision",
            "Base de données mise à jour quotidiennement"
        ]
    },
    {
        id: 2,
        title: "Filtrage & Sécurité",
        description: "Filtrage intelligent du contenu toxique et sécurisation des environnements d'apprentissage pour les étudiants.",
        icon: ShieldIcon,
        color: "from-blue-500 to-cyan-500",
        features: [
            "Détection de langage inapproprié",
            "Protection contre le harcèlement",
            "Environnement éducatif sécurisé"
        ]
    },
    {
        id: 3,
        title: "Examen & Intégrité",
        description: "Système Safe Exam avancé qui garantit l'intégrité académique pendant les évaluations en ligne.",
        icon: GraduationCapIcon,
        color: "from-green-500 to-emerald-500",
        features: [
            "Surveillance intelligente",
            "Détection de tricherie",
            "Rapports d'intégrité automatisés"
        ]
    },
    {
        id: 4,
        title: "Scoring & Recommandations",
        description: "Évaluation automatisée de la fiabilité des sources et recommandations personnalisées pour chaque étudiant.",
        icon: BrainIcon,
        color: "from-orange-500 to-amber-500",
        features: [
            "Scoring de crédibilité",
            "Recommandations adaptatives",
            "Suivi des progrès personnalisé"
        ]
    }
];

export default function WorkflowSteps() {
    return (
        <section className="mt-32 relative" id="workflow">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <SectionTitle
                title="Le processus d'apprentissage intelligent"
                description="De la détection de désinformation à l'évaluation personnalisée, notre plateforme transforme l'éducation en toute sécurité."
            />

            <motion.div className="relative space-y-20 md:space-y-30 mt-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {/* Timeline Line - Desktop */}
                <div className="flex-col items-center hidden md:flex absolute left-1/2 -translate-x-1/2 h-full">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center">
                            {/* Step Number */}
                            <div className={`flex items-center justify-center font-bold text-white my-8 aspect-square w-14 h-14 rounded-full bg-gradient-to-r ${step.color} p-1 shadow-lg`}>
                                <div className="flex items-center justify-center w-full h-full rounded-full bg-black/20 backdrop-blur-sm">
                                    {step.id}
                                </div>
                            </div>
                            
                            {/* Vertical Line (except for last step) */}
                            {index < steps.length - 1 && (
                                <div className="h-40 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Steps Content */}
                {steps.map((step, index) => (
                    <motion.div 
                        key={index} 
                        className={`flex items-center justify-center gap-8 md:gap-20 ${
                            index % 2 !== 0 ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'
                        }`}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                            delay: index * 0.15, 
                            type: "spring", 
                            stiffness: 320, 
                            damping: 70, 
                            mass: 1 
                        }}
                    >
                        {/* Step Visual */}
                        <div className="flex-1 relative max-w-sm">
                            {/* Icon Container */}
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                                
                                <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:border-white/20 transition-all duration-300">
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} mb-6`}>
                                        <step.icon className="size-8 text-white" />
                                    </div>
                                    
                                    <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                                    
                                    {/* Features List */}
                                    <ul className="space-y-3">
                                        {step.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                <CheckCircleIcon className="size-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Step Number for Mobile */}
                            <div className="md:hidden absolute -top-4 -left-4">
                                <div className={`flex items-center justify-center font-bold text-white aspect-square w-12 h-12 rounded-full bg-gradient-to-r ${step.color} p-1 shadow-lg`}>
                                    <div className="flex items-center justify-center w-full h-full rounded-full bg-black/20 backdrop-blur-sm">
                                        {step.id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step Description */}
                        <div className="flex-1 flex flex-col gap-6 md:px-6 max-w-md">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${step.color}`} />
                                <span className="text-sm font-medium text-gray-400">Étape {step.id}</span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {step.title}
                            </h3>
                            
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {step.description}
                            </p>
                            
                            {/* Status Indicator */}
                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm text-green-400">Système actif</span>
                                </div>
                                <div className="h-4 w-px bg-gray-700" />
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="size-4 text-yellow-500" />
                                    <span className="text-sm text-yellow-400">Surveillance 24/7</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Stats Banner */}
            <motion.div 
                className="mt-32 max-w-5xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
            >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
                    
                    <div className="relative p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "10K+", label: "Étudiants protégés", color: "text-purple-400" },
                                { value: "99%", label: "Précision de détection", color: "text-green-400" },
                                { value: "0.2s", label: "Temps de réponse", color: "text-blue-400" },
                                { value: "100%", label: "Examens sécurisés", color: "text-cyan-400" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center space-y-2">
                                    <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}