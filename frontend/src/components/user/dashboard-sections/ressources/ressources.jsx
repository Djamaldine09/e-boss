import React from 'react';
import { BookOpen, Code, Video, FileText, ExternalLink } from 'lucide-react';

const RessourcesSection = () => {
  const categories = [
    {
      title: 'Documentation',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      items: [
        {
          title: 'Documentation React',
          description: 'La documentation officielle de React',
          url: 'https://reactjs.org/docs/getting-started.html',
          type: 'lien',
        },
        {
          title: 'Guide TypeScript',
          description: 'Apprendre TypeScript de A à Z',
          url: 'https://www.typescriptlang.org/docs/',
          type: 'lien',
        },
        {
          title: 'Documentation Node.js',
          description: 'Guide complet sur Node.js',
          url: 'https://nodejs.org/en/docs/',
          type: 'lien',
        },
      ],
    },
    {
      title: 'Tutoriels',
      icon: <Video className="w-5 h-5 text-purple-500" />,
      items: [
        {
          title: 'Tutoriel React avancé',
          description: 'Maîtrisez les hooks avancés',
          url: 'https://youtube.com/playlist?list=PLN3n1USn4xlmyw3ebYuZmGqf60Q8KSMH3',
          type: 'vidéo',
        },
        {
          title: 'Apprendre Redux',
          description: 'Gestion d\'état avec Redux',
          url: 'https://youtube.com/playlist?list=PLpPqplz6dKxXICtNgHYdG8r4d7u4hWooN',
          type: 'vidéo',
        },
      ],
    },
    {
      title: 'Outils',
      icon: <Code className="w-5 h-5 text-green-500" />,
      items: [
        {
          title: 'CodeSandbox',
          description: 'Éditeur en ligne pour React',
          url: 'https://codesandbox.io/',
          type: 'outil',
        },
        {
          title: 'JSON Server',
          description: 'API REST factice pour le développement',
          url: 'https://github.com/typicode/json-server',
          type: 'outil',
        },
      ],
    },
    {
      title: 'Articles',
      icon: <FileText className="w-5 h-5 text-orange-500" />,
      items: [
        {
          title: 'Les bonnes pratiques React',
          description: '10 bonnes pratiques à suivre',
          url: 'https://example.com/bonnes-pratiques-react',
          type: 'article',
        },
        {
          title: 'Optimisation des performances',
          description: 'Améliorez les perfs de vos applications',
          url: 'https://example.com/optimisation-performances',
          type: 'article',
        },
      ],
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lien':
        return <ExternalLink className="w-4 h-4 text-gray-400" />;
      case 'vidéo':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'article':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'outil':
        return <Code className="w-4 h-4 text-green-400" />;
      default:
        return <ExternalLink className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ressources</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Retrouvez ici toutes les ressources utiles pour votre apprentissage
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {categories.map((category, index) => (
          <div key={index} className="overflow-hidden glass">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-opacity-10 bg-blue-500">
                  {category.icon}
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {category.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-3 -mx-2 transition-colors duration-150 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Vous avez une ressource à partager ?
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Envoyez-nous vos liens préférés et nous les ajouterons à la liste !
        </p>
        <div className="mt-4">
          <a
            href="mailto:contact@votresite.com"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Proposer une ressource
          </a>
        </div>
      </div>
    </div>
  );
};

export default RessourcesSection;