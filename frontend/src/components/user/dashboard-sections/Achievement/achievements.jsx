import React, { useState, useEffect } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import { dashboardAPI } from '../../../../services/dashboardExpressAPI';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        
        // Données de test en cas d'erreur API
        const mockAchievements = [];
        
        const data = await dashboardAPI.getAchievements().catch(() => mockAchievements);
        setAchievements(data || mockAchievements);
      } catch (err) {
        console.error('Erreur lors du chargement des réalisations:', err);
        // Utiliser les données de test en cas d'erreur
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleAchievementClick = async (id, currentStatus) => {
    try {
      const updatedAchievement = await dashboardAPI.updateAchievement(id, { 
        completed: !currentStatus 
      });
      
      setAchievements(prev => 
        prev.map(ach => 
          ach.id === id ? { ...ach, ...updatedAchievement } : ach
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la réalisation:', err);
    }
  };

  if (loading) {
    return (
      <div className="glass p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Chargement des réalisations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-6">
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="glass p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Mes Réalisations
      </h2>
      
      {achievements.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Aucune réalisation pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              onClick={() => handleAchievementClick(achievement.id, achievement.completed)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                achievement.completed 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                {achievement.completed ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Obtenu
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                    En cours
                  </span>
                )}
              </div>
              {achievement.progress !== undefined && achievement.progress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {Math.round(achievement.progress)}% complété
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;