import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useTheme } from '../context/theme-context';
import { useChristmas } from '../context/christmas-context';

const SupportView = () => {
  const { theme } = useTheme();
  const { isChristmasMode } = useChristmas();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'Comment créer un compte ?',
      answer: 'Pour créer un compte, cliquez sur le bouton "Register" dans le menu utilisateur et remplissez le formulaire d\'inscription.'
    },
    {
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions envoyées par email.'
    },
    {
      question: 'Quels sont les tarifs ?',
      answer: 'Nous proposons plusieurs plans tarifaires adaptés à vos besoins. Consultez notre page "A propos" pour plus de détails.'
    },
    {
      question: 'Comment contacter le support technique ?',
      answer: 'Vous pouvez nous contacter via le formulaire de contact ou par email à support@entreprise.com.'
    },
    {
      question: 'Quelles sont les heures de support ?',
      answer: 'Notre support technique est disponible du lundi au vendredi de 9h à 18h.'
    }
  ];

  const supportCategories = [
    {
      title: 'Compte et Profil',
      icon: '👤',
      topics: ['Création de compte', 'Connexion', 'Mot de passe', 'Paramètres du profil']
    },
    {
      title: 'Facturation',
      icon: '💳',
      topics: ['Paiement', 'Factures', 'Remboursements', 'Abonnements']
    },
    {
      title: 'Technique',
      icon: '🔧',
      topics: ['Connexion', 'Navigation', 'Erreurs', 'Performance']
    },
    {
      title: 'Sécurité',
      icon: '🔒',
      topics: ['Protection des données', 'Authentification', 'Confidentialité']
    }
  ];

  return (
    <Layout>
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              Centre de Support
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Trouvez des réponses à vos questions ou contactez notre équipe
            </p>
          </div>

          <div className="glass p-6 mb-8">
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Catégories d'aide
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Contacter le support
              </button>
            </div>

            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6">
                  Questions fréquentes
                </h2>
                {faqs.map((faq, index) => (
                  <div key={index} className="glass">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}">
                        {faq.question}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {expandedFaq === index ? '−' : '+'}
                      </span>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6">
                  Catégories d'aide
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {supportCategories.map((category, index) => (
                    <div key={index} className="glass p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">{category.icon}</span>
                        <h3 className="text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}">
                          {category.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {category.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            • {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h2 className="text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6">
                  Contacter le support
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4">
                      Envoyez-nous un message
                    </h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sujet
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Décrivez votre problème..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Décrivez votre problème en détail..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Envoyer
                      </button>
                    </form>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4">
                      Autres options de contact
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          📧
                        </div>
                        <div>
                          <p className="font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}">Email</p>
                          <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">support@entreprise.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          📱
                        </div>
                        <div>
                          <p className="font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}">Téléphone</p>
                          <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">+33 1 23 45 67 89</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          💬
                        </div>
                        <div>
                          <p className="font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}">Chat en direct</p>
                          <p className="${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">Disponible 9h-18h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SupportView;
