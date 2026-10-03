import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/theme-context';
import { useChristmas } from "../context/christmas-context";
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

// Importez vos animations Lottie
import snowAnimation from '../animation/noel.json';





// Animation par défaut si vous n'avez pas les fichiers
const defaultSnowAnimation = {
  // JSON minimal pour la neige
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 90,
  "w": 400,
  "h": 400,
  "layers": []
};

// Composant Lottie pour la neige
const LottieSnow = () => {
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    // Essayer de charger depuis le fichier local
    if (snowAnimation) {
      setAnimationData(snowAnimation);
    } else {
      // Charger depuis URL en ligne
      fetch('https://assets9.lottiefiles.com/packages/lf20_pq7cg0rq.json')
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(() => setAnimationData(defaultSnowAnimation));
    }
  }, []);

  if (!animationData) return null;

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.6
        }}
      />
    </div>
  );
};

// Composant Lottie pour le Père Noël
const LottieSanta = () => {
  const [animationData, setAnimationData] = useState(null);
  
  

  if (!animationData) return null;

  return (
    <div className="absolute -top-20 -right-20 w-96 h-96 pointer-events-none -z-10 opacity-70">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

// Composant Lottie pour les guirlandes
const LottieChristmasLights = () => {
  const [animationData, setAnimationData] = useState(null);
  
  
  if (!animationData) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-32 pointer-events-none -z-10">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

// Composant Lottie pour les flocons de neige
const LottieSnowflakes = () => {
  const [animationData, setAnimationData] = useState(null);
  
  

  if (!animationData) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-50">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default function HeroSection() {
    const { theme } = useTheme();
    const { isChristmasMode } = useChristmas();
    
    return (
      <>
        {/* Background avec animations Lottie Noël */}
        {isChristmasMode && (
          <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
            <LottieSnow />
            <LottieSnowflakes />
            <LottieChristmasLights />
            <LottieSanta />
            
            {/* Overlay coloré pour Noël */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-green-900/10 to-transparent" />
          </div>
        )}
        
        {/* Background normal (sans Noël) */}
        {!isChristmasMode && (
          <motion.div 
            className="fixed inset-0 overflow-hidden -z-20 pointer-events-none"
            initial={{ opacity: 0.4 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={`absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
              theme === 'dark' ? 'bg-[#4C1D95]' : 'bg-[#E91E63]'
            }`} />
            <div className={`absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
              theme === 'dark' ? 'bg-[#1E3A8A]' : 'bg-[#2E08CF]'
            }`} />
            <div className={`absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
              theme === 'dark' ? 'bg-[#7C3AED]' : 'bg-[#F26A06]'
            }`} />
          </motion.div>
        )}
      
      <section className="relative py-16 md:py-24 lg:py-32">
        {/* Animation Lottie cadeaux flottants pour Noël */}
        {isChristmasMode && (
          <div className="absolute top-1/4 left-10 w-24 h-24 pointer-events-none">
            
          </div>
        )}
        
            <div className="container mx-auto max-w-6xl px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 relative">
                        {isChristmasMode && (
                          <div className="absolute -top-8 -left-8 w-32 h-32 pointer-events-none">
                            
                          </div>
                        )}
                        
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 relative z-10 ${
                          isChristmasMode 
                            ? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border border-red-500/30' 
                            : 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              isChristmasMode ? 'bg-red-500 animate-pulse' : 'bg-purple-500 animate-pulse'
                            }`}></span>
                            <span className={`text-sm font-medium ${
                              isChristmasMode 
                                ? 'text-red-600 dark:text-red-300' 
                                : 'text-purple-700 dark:text-purple-300'
                            }`}>
                                {isChristmasMode ? (
                                  <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 inline-flex">
                                      
                                    </span>
                                    Intelligence Artificielle pour l'Éducation
                                  </span>
                                ) : "Intelligence Artificielle pour l'Éducation"}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 relative z-10">
                            {isChristmasMode && (
                              <span className="absolute -left-12 -top-4 w-16 h-16">
                                
                              </span>
                            )}
                            
                            Apprendre avec{' '}
                            <span className={`bg-gradient-to-r ${
                              isChristmasMode 
                                ? 'from-red-500 via-green-500 to-yellow-500' 
                                : theme === 'dark' 
                                    ? 'from-purple-400 to-blue-400' 
                                    : 'from-purple-600 to-blue-600'
                            } bg-clip-text text-transparent`}>
                                l'IA
                            </span>
                            <br />
                            en toute sécurité
                        </h1>
                        
                        <p className={`text-xl mb-8 max-w-2xl relative z-10 ${
                          isChristmasMode 
                            ? 'text-gray-300 dark:text-gray-200' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                            Notre plateforme éducative intelligente détecte la désinformation, 
                            analyse le contenu toxique, sécurise les examens et évalue la 
                            fiabilité des sources en temps réel.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
                            <button className={`px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                              isChristmasMode 
                                ? 'bg-red-500 shadow-red-500/30 hover:shadow-red-500/50' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-600'
                            }`}>
                                {isChristmasMode && (
                                  <span className="w-6 h-6">
                                   
                                  </span>
                                )}
                                Commencer gratuitement
                            </button>
                            <button className={`px-8 py-3 border rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                              isChristmasMode 
                                ? 'border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-gray-300' 
                                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>
                                Voir la démo
                            </button>
                        </div>
                        
                        <div className={`flex items-center gap-4 text-sm relative z-10 ${
                          isChristmasMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  isChristmasMode ? 'bg-green-400 animate-pulse' : 'bg-green-500'
                                }`}></div>
                                <span>Aucune carte requise</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  isChristmasMode ? 'bg-green-400 animate-pulse' : 'bg-green-500'
                                }`}></div>
                                <span>14 jours d'essai gratuit</span>
                            </div>
                        </div>
                        
                        {/* Bannière spéciale Noël avec animation Lottie */}
                        {isChristmasMode && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 p-4 rounded-lg bg-gradient-to-r from-red-900/20 to-green-900/20 border border-red-500/20 relative overflow-hidden"
                          >
                            <div className="absolute top-2 right-2 w-12 h-12 opacity-20">
                              
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="w-10 h-10">
                                
                              </div>
                              <div>
                                <p className="font-semibold text-white">Offre spéciale Noël !</p>
                                <p className="text-sm text-gray-300">3 mois gratuits pour tout abonnement avant le 25 décembre</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                    </div>
                    
                    {/* Right Content - Dashboard Preview */}
                    
                </div>
            </div>
        </section>
        </>
    );
}