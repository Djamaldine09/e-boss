import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../../../services/dashboardAPI';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('en-cours');
  const [courses, setCourses] = useState({
    'en-cours': [],
    'termines': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'recent',
    difficulty: ''
  });

  // Récupérer les cours depuis l'API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Données de test pour vérifier l'affichage
        const mockCourses = {
          'en-cours': [
            {
              id: 1,
              title: 'React Hooks Avancés',
              description: 'Maîtrisez les hooks avancés comme useCallback, useMemo et useReducer',
              level: 'intermediate',
              total_lessons: 20,
              progress: 75,
              completed_lessons: 15,
              icon: '⚛️',
              color: '#3B82F6',
              started_at: '2024-01-01T10:00:00Z',
              last_accessed: '2024-12-17T14:30:00Z'
            },
            {
              id: 2,
              title: 'Node.js Backend',
              description: 'Créez des API REST robustes avec Node.js et Express',
              level: 'intermediate',
              total_lessons: 25,
              progress: 60,
              completed_lessons: 15,
              icon: '🟢',
              color: '#10B981',
              started_at: '2024-01-05T09:00:00Z',
              last_accessed: '2024-12-15T16:20:00Z'
            },
            {
              id: 3,
              title: 'TypeScript Expert',
              description: 'Approfondissez vos connaissances en TypeScript',
              level: 'advanced',
              total_lessons: 30,
              progress: 45,
              completed_lessons: 13,
              icon: '📘',
              color: '#8B5CF6',
              started_at: '2024-01-10T11:00:00Z',
              last_accessed: '2024-12-18T10:15:00Z'
            }
          ],
          'termines': [
            {
              id: 4,
              title: 'HTML & CSS Fundamentals',
              description: 'Les bases du développement web',
              level: 'beginner',
              total_lessons: 15,
              progress: 100,
              completed_lessons: 15,
              icon: '🌐',
              color: '#F59E0B',
              started_at: '2023-12-01T08:00:00Z',
              completed_at: '2024-12-10T09:00:00Z',
              last_accessed: '2024-12-10T09:00:00Z'
            },
            {
              id: 5,
              title: 'JavaScript ES6+',
              description: 'Les features modernes de JavaScript',
              level: 'intermediate',
              total_lessons: 18,
              progress: 100,
              completed_lessons: 18,
              icon: '⚡',
              color: '#EF4444',
              started_at: '2023-11-15T14:00:00Z',
              completed_at: '2024-12-05T11:30:00Z',
              last_accessed: '2024-12-05T11:30:00Z'
            }
          ]
        };
        
        // Utiliser les données de test directement pour l'instant
        setCourses(mockCourses);
      } catch (err) {
        console.error('Erreur lors du chargement des cours:', err);
        // Utiliser les données de test en cas d'erreur
        setCourses({
          'en-cours': [],
          'termines': []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrer et trier les cours
  const getFilteredCourses = () => {
    let filtered = [...courses[activeTab]];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term) ||
        course.category?.toLowerCase().includes(term)
      );
    }
    
    // Filtrer par catégorie
    if (filters.category) {
      filtered = filtered.filter(course => 
        course.category === filters.category
      );
    }
    
    // Filtrer par difficulté
    if (filters.difficulty) {
      filtered = filtered.filter(course => 
        course.difficulty === filters.difficulty
      );
    }
    
    // Trier
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const filteredCourses = getFilteredCourses();
  
  // Récupérer les catégories uniques pour les filtres
  const categories = [...new Set(courses['en-cours'].concat(courses['termines']).map(c => c.category).filter(Boolean))];

  const formatDuration = (minutes) => {
    if (!minutes) return 'Durée inconnue';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="glass p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-2">Chargement des cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-6">
        <div className="text-red-500 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="glass p-6 overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Mes Cours
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'en-cours' 
                ? 'Reprenez là où vous vous êtes arrêté'
                : 'Revoyez vos cours terminés'}
            </p>
          </div>
          
          <Link 
            to="/catalogue"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau cours
          </Link>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('en-cours')}
          className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'en-cours' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          En cours
          {courses['en-cours'].length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              {courses['en-cours'].length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('termines')}
          className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'termines' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Terminés
          {courses['termines'].length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
              {courses['termines'].length}
            </span>
          )}
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un cours..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="recent">Récent</option>
                <option value="progress">Progression</option>
                <option value="title">Titre (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            
            {categories.length > 0 && (
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">Toutes catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des cours */}
      <div className="p-4 md:p-6">
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="md:flex flex-1">
                  <div className="md:flex-shrink-0 md:w-48 h-40 bg-gray-200 relative">
                    {course.imageUrl ? (
                      <img 
                        className="w-full h-full object-cover" 
                        src={course.imageUrl} 
                        alt={course.title} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
                        <BookOpen className="w-10 h-10 text-indigo-400" />
                      </div>
                    )}
                    {course.category && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                        {course.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {course.description || 'Aucune description disponible'}
                          </p>
                          
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatDuration(course.durationMinutes)}
                            </div>
                            
                            {course.lessonsCount > 0 && (
                              <div>
                                {course.completedLessons || 0} / {course.lessonsCount} leçons
                              </div>
                            )}
                            
                            {course.difficulty && (
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                course.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                                course.difficulty === 'Intermédiaire' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {course.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Link 
                          to={`/cours/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-800 ml-2 flex-shrink-0"
                          title="Voir le cours"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    
                    {activeTab === 'en-cours' ? (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span className="font-medium">{course.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                        {course.lastAccessed && (
                          <p className="mt-1 text-xs text-gray-500">
                            Dernière session: {formatDate(course.lastAccessed)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>Terminé le {formatDate(course.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t px-4 py-3 bg-gray-50 flex justify-end">
                  <Link 
                    to={`/cours/${course.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    {activeTab === 'en-cours' ? 'Continuer' : 'Revoir'}
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm || filters.category || filters.difficulty
                ? 'Aucun cours ne correspond à vos critères'
                : activeTab === 'en-cours'
                  ? 'Vous ne suivez aucun cours pour le moment'
                  : 'Vous n\'avez terminé aucun cours'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filters.category || filters.difficulty
                ? 'Essayez de modifier vos filtres de recherche.'
                : activeTab === 'en-cours'
                  ? 'Commencez par explorer notre catalogue de cours.'
                  : 'Consultez vos cours en cours pour continuer votre apprentissage.'}
            </p>
            <div className="mt-6">
              <Link
                to="/catalogue"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BookOpen className="-ml-1 mr-2 h-5 w-5" />
                {activeTab === 'en-cours' ? 'Parcourir les cours' : 'Découvrir des cours'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;