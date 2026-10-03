import React, { useState, useEffect } from 'react';
import { BarChart3, Target, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { dashboardAPI } from '../../../../services/dashboardAPI';
import { Link } from 'react-router-dom';

const Progress = () => {
  const [progressData, setProgressData] = useState({
    overall: 0,
    weeklyGoal: 70, // Valeur par défaut, sera écrasée par les données du serveur
    weeklyProgress: 0,
    courses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        
        // Données de test en cas d'erreur API
        const mockData = {
          overall: 0,
          weeklyGoal: 70,
          weeklyProgress: 0,
          courses: []
        };
        
        // Récupérer la progression globale
        const [overallProgress, coursesProgress] = await Promise.all([
          dashboardAPI.getProgress().catch(() => ({ totalProgress: mockData.overall, weeklyGoal: mockData.weeklyGoal })),
          dashboardAPI.getCourses().catch(() => mockData.courses)
        ]);
        
        // Calculer la progression hebdomadaire
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Dimanche dernier
        
        const weeklyProgress = coursesProgress.reduce((acc, course) => {
          if (new Date(course.lastAccessed) >= startOfWeek) {
            return acc + (course.progress || 0);
          }
          return acc;
        }, 0) / (coursesProgress.length || 1);

        setProgressData({
          overall: overallProgress.totalProgress || mockData.overall,
          weeklyGoal: overallProgress.weeklyGoal || mockData.weeklyGoal,
          weeklyProgress: Math.round(weeklyProgress) || mockData.weeklyProgress,
          courses: coursesProgress.map(course => ({
            id: course.id,
            name: course.title || course.name,
            progress: course.progress || 0,
            lastAccessed: course.lastAccessed
          }))
        });
      } catch (err) {
        console.error('Erreur lors du chargement de la progression:', err);
        // Utiliser les données de test en cas d'erreur
        setProgressData({
          overall: 0,
          weeklyGoal: 70,
          weeklyProgress: 0,
          courses: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLastAccessed = (dateString) => {
    if (!dateString) return 'Jamais';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Le ${date.toLocaleDateString('fr-FR')}`;
  };

  if (loading) {
    return (
      <div className="glass p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Chargement de la progression...</span>
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
      </div>
    );
  }

  return (
    <div className="glass p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          Ma Progression
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <Target className="w-4 h-4 mr-1" />
          Objectif: {progressData.weeklyGoal}%
        </div>
      </div>

      {/* Progression de la semaine */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm mb-1">
          <span>Cette semaine</span>
          <span className="font-medium">
            {progressData.weeklyProgress}% de l'objectif
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div 
            className={`h-2.5 rounded-full ${getProgressColor(progressData.weeklyProgress)}`}
            style={{ 
              width: `${Math.min(progressData.weeklyProgress, 100)}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progressData.weeklyProgress >= progressData.weeklyGoal 
            ? 'Objectif hebdomadaire atteint !' 
            : `${progressData.weeklyGoal - progressData.weeklyProgress}% restants pour atteindre votre objectif`}
        </p>
      </div>

      {/* Barre de progression globale */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span>Progression globale</span>
          <span className="font-medium">{progressData.overall}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getProgressColor(progressData.overall)}`}
            style={{ 
              width: `${progressData.overall}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
      </div>

      {/* Progression par cours */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Progression par cours</h3>
        <Link 
          to="/mes-cours" 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          Voir tout <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {progressData.courses.length > 0 ? (
          progressData.courses.slice(0, 3).map((course) => (
            <div key={course.id} className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{course.name}</span>
                <span className="text-gray-500 text-xs">
                  {formatLastAccessed(course.lastAccessed)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                  style={{ 
                    width: `${course.progress}%`,
                    transition: 'width 0.5s ease-in-out'
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {course.progress}% complété
                </span>
                <Link 
                  to={`/cours/${course.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Continuer <ArrowRight className="w-3 h-3 inline ml-0.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Aucun cours suivi pour le moment.
          </div>
        )}
      </div>

      {progressData.courses.length > 0 && (
        <Link 
          to="/mes-cours"
          className="mt-6 block w-full py-2 border border-blue-500 text-blue-600 text-center rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors"
        >
          Voir tous mes cours
        </Link>
      )}
    </div>
  );
};

export default Progress;