import React from 'react';
import Layout from '../components/Layout';
import { useTheme } from '../context/theme-context';
import { useChristmas } from '../context/christmas-context';

const AproposView = () => {
  const { theme } = useTheme();
  const { isChristmasMode } = useChristmas();
  const team = [
    {
      name: 'Jean Dupont',
      role: 'CEO & Fondateur',
      description: 'Visionnaire passionné par l\'innovation technologique',
      image: '👨‍💼'
    },
    {
      name: 'Marie Martin',
      role: 'CTO',
      description: 'Experte en architecture logicielle et cloud',
      image: '👩‍💻'
    },
    {
      name: 'Pierre Bernard',
      role: 'Directeur Marketing',
      description: 'Spécialiste du marketing digital et de la croissance',
      image: '👨‍💼'
    },
    {
      name: 'Sophie Laurent',
      role: 'Lead Designer',
      description: 'Créative passionnée par l\'expérience utilisateur',
      image: '👩‍🎨'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'Nous poussons les limites de la technologie pour créer des solutions révolutionnaires.',
      icon: '💡'
    },
    {
      title: 'Qualité',
      description: 'Chaque produit est conçu avec une attention méticuleuse aux détails.',
      icon: '✨'
    },
    {
      title: 'Confiance',
      description: 'Nous construisons des relations durables basées sur la transparence et l\'intégrité.',
      icon: '🤝'
    },
    {
      title: 'Excellence',
      description: 'Nous nous engageons à dépasser les attentes de nos clients.',
      icon: '🏆'
    }
  ];

  return (
    <Layout>
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6">
              À propos de nous
            </h1>
            <p className="text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto">
              Nous sommes une entreprise innovante dédiée à transformer les idées en solutions technologiques 
              exceptionnelles qui améliorent la vie de nos clients.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="glass p-8">
              <h2 className="text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4">
                Notre Mission
              </h2>
              <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">
                Démocratiser l'accès à la technologie de pointe en créant des solutions intuitives, 
                performantes et accessibles qui permettent à chacun de réaliser son plein potentiel.
              </p>
            </div>
            
            <div className="glass p-8">
              <h2 className="text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4">
                Notre Vision
              </h2>
              <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">
                Devenir le leader mondial de l'innovation technologique en créant un écosystème 
                où la technologie sert l'humanité de manière éthique et durable.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-12">
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="glass p-6 text-center hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3">
                    {value.title}
                  </h3>
                  <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Projets livrés</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Années d'expérience</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Support disponible</div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-12">
              Notre Équipe
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="glass p-6 text-center hover:shadow-xl transition-shadow">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tariffs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-12">
              Nos Tarifs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass p-8 hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2">
                  Starter
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  29€<span className="text-lg text-gray-500">/mois</span>
                </div>
                <ul className="space-y-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6">
                  <li>✓ 5 utilisateurs</li>
                  <li>✓ 10 Go de stockage</li>
                  <li>✓ Support par email</li>
                  <li>✓ Fonctionnalités de base</li>
                </ul>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Choisir ce plan
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white transform scale-105">
                <div className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAIRE
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Professional
                </h3>
                <div className="text-3xl font-bold mb-4">
                  79€<span className="text-lg opacity-80">/mois</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li>✓ 25 utilisateurs</li>
                  <li>✓ 100 Go de stockage</li>
                  <li>✓ Support prioritaire</li>
                  <li>✓ Fonctionnalités avancées</li>
                  <li>✓ API access</li>
                </ul>
                <button className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  Choisir ce plan
                </button>
              </div>
              
              <div className="glass p-8 hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2">
                  Enterprise
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  199€<span className="text-lg text-gray-500">/mois</span>
                </div>
                <ul className="space-y-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6">
                  <li>✓ Utilisateurs illimités</li>
                  <li>✓ Stockage illimité</li>
                  <li>✓ Support 24/7</li>
                  <li>✓ Toutes les fonctionnalités</li>
                  <li>✓ Solutions personnalisées</li>
                </ul>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Choisir ce plan
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à commencer votre voyage avec nous ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des centaines d'entreprises qui font déjà confiance à nos solutions
            </p>
            <div className="space-x-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                Commencer gratuitement
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
                Contacter les ventes
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AproposView;
