import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle, 
  Play, 
  Plus, 
  Loader2, 
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  CheckCheck,
  Calendar as CalendarIcon
} from 'lucide-react';
import { dashboardAPI } from '../../../../services/dashboardAPI';
import { format, addDays, isBefore, isAfter, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

const Sprint = () => {
  const [sprints, setSprints] = useState([]);
  const [activeSprintIndex, setActiveSprintIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTab, setActiveTab] = useState('taches'); // 'taches' ou 'details'

  // Charger les sprints depuis l'API
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        setLoading(true);
        
        // Données de test pour vérifier l'affichage
        const mockSprints = [
          {
            id: 1,
            title: 'Sprint React Hooks',
            description: 'Maîtrisez les hooks avancés de React',
            startDate: '2024-12-15T09:00:00Z',
            endDate: '2024-12-22T18:00:00Z',
            status: 'in-progress',
            points: 100,
            duration_days: 7,
            completed: 8,
            total: 12,
            tasks: [
              { id: 1, title: 'Compléter le cours sur useEffect', completed: true },
              { id: 2, title: 'Pratiquer avec 5 exercices', completed: true },
              { id: 3, title: 'Créer un projet personnalisé', completed: false },
              { id: 4, title: 'Revoir les concepts avancés', completed: false },
              { id: 5, title: 'Préparer la présentation', completed: false }
            ]
          },
          {
            id: 2,
            title: 'Sprint Node.js',
            description: 'Créez des API REST avec Node.js et Express',
            startDate: '2024-12-08T09:00:00Z',
            endDate: '2024-12-15T18:00:00Z',
            status: 'completed',
            points: 80,
            duration_days: 5,
            completed: 10,
            total: 10,
            tasks: [
              { id: 6, title: 'Installer Node.js', completed: true },
              { id: 7, title: 'Créer un serveur simple', completed: true },
              { id: 8, title: 'Apprendre Express.js', completed: true }
            ]
          }
        ];
        
        // Utiliser les données de test directement pour l'instant
        setSprints(mockSprints);
        
        // Trouver l'index du sprint actif (en cours ou le prochain à venir)
        const today = new Date();
        const activeIndex = mockSprints.findIndex(sprint => 
          (new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today) ||
          (new Date(sprint.startDate) > today)
        );
        
        setActiveSprintIndex(activeIndex >= 0 ? activeIndex : 0);
      } catch (err) {
        console.error('Erreur lors du chargement des sprints:', err);
        // Utiliser les données de test en cas d'erreur
        const mockSprints = [];
        
        const sortedSprints = mockSprints.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setSprints(sortedSprints);
        
        const today = new Date();
        const activeIndex = sortedSprints.findIndex(sprint => 
          (new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today) ||
          (new Date(sprint.startDate) > today)
        );
        
        setActiveSprintIndex(activeIndex >= 0 ? activeIndex : 0);
      } finally {
        setLoading(false);
      }
    };

    fetchSprints();
  }, []);

  // Fonctions utilitaires
  const calculateProgress = (sprint) => {
    if (!sprint || !sprint.tasks || sprint.tasks.length === 0) return 0;
    const completedTasks = sprint.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / sprint.tasks.length) * 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSprintStatus = (sprint) => {
    if (!sprint) return 'upcoming';
    if (sprint.status === 'completed') return 'completed';
    if (sprint.status === 'in-progress') return 'en-cours';
    return 'upcoming';
  };

  // Formater une date en français
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'd MMM yyyy', { locale: fr });
  };

  // Gérer l'ajout d'une nouvelle tâche
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    try {
      const currentSprint = sprints[activeSprintIndex];
      const newTask = {
        id: Date.now(), // ID temporaire qui sera remplacé par le backend
        title: newTaskText.trim(),
        completed: false,
        isNew: true // Pour le style visuel
      };
      
      // Mise à jour optimiste de l'UI
      const updatedSprints = [...sprints];
      updatedSprints[activeSprintIndex] = {
        ...currentSprint,
        tasks: [...(currentSprint.tasks || []), newTask]
      };
      setSprints(updatedSprints);
      
      // Réinitialiser le champ de saisie
      setNewTaskText('');
      setIsAddingTask(false);
      
      // Envoyer la tâche au backend
      await dashboardAPI.addTaskToSprint(currentSprint.id, {
        title: newTask.title
      });
      
      // Recharger les données pour s'assurer qu'elles sont à jour
      const updatedSprint = await dashboardAPI.getSprint(currentSprint.id);
      
      // Mettre à jour l'état avec les données fraîches du serveur
      const updatedSprintsList = [...sprints];
      updatedSprintsList[activeSprintIndex] = updatedSprint;
      setSprints(updatedSprintsList);
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche:', err);
      // Annuler la mise à jour optimiste en cas d'erreur
      const updatedSprints = [...sprints];
      updatedSprints[activeSprintIndex] = {
        ...sprints[activeSprintIndex],
        tasks: sprints[activeSprintIndex].tasks.filter(t => !t.isNew)
      };
      setSprints(updatedSprints);
      
      setError('Impossible d\'ajouter la tâche. Veuillez réessayer.');
    }
  };

  // Basculer l'état d'une tâche (complétée/non complétée)
  const toggleTaskStatus = async (taskId) => {
    try {
      const currentSprint = sprints[activeSprintIndex];
      const task = currentSprint.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Mise à jour optimiste de l'UI
      const updatedSprints = [...sprints];
      updatedSprints[activeSprintIndex] = {
        ...currentSprint,
        tasks: currentSprint.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      };
      setSprints(updatedSprints);
      
      // Mettre à jour la tâche côté serveur
      await dashboardAPI.updateTaskStatus(taskId, !task.completed);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la tâche:', err);
      setError('Impossible de mettre à jour la tâche. Veuillez réessayer.');
      
      // Annuler la mise à jour optimiste en cas d'erreur
      const updatedSprints = [...sprints];
      updatedSprints[activeSprintIndex] = {
        ...sprints[activeSprintIndex],
        tasks: sprints[activeSprintIndex].tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      };
      setSprints(updatedSprints);
    }
  };

  // Marquer un sprint comme terminé
  const completeSprint = async (sprintId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir marquer ce sprint comme terminé ?')) {
      return;
    }
    
    try {
      await dashboardAPI.completeSprint(sprintId);
      
      // Recharger les données
      const updatedSprint = await dashboardAPI.getSprint(sprintId);
      
      // Mettre à jour l'état avec les données fraîches du serveur
      const updatedSprints = sprints.map(sprint => 
        sprint.id === sprintId ? updatedSprint : sprint
      );
      setSprints(updatedSprints);
      
    } catch (err) {
      console.error('Erreur lors de la finalisation du sprint:', err);
      setError('Impossible de finaliser le sprint. Veuillez réessayer.');
    }
  };

  // Fonction utilitaire pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            À venir
          </span>
        );
      default:
        return null;
    }
  };

  // Afficher un indicateur de chargement
  if (loading && sprints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Chargement des sprints...</span>
      </div>
    );
  }

  // Afficher un message d'erreur s'il y en a un
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un message si aucun sprint n'est disponible
  if (sprints.length === 0) {
    return (
      <div className="text-center py-12">
        <Flag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun sprint trouvé</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer votre premier sprint.</p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Nouveau sprint
          </button>
        </div>
      </div>
    );
  }

  const currentSprint = sprints[activeSprintIndex];
  const progress = calculateProgress(currentSprint);
  const progressColor = getProgressColor(progress);
  const status = getSprintStatus(currentSprint);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Mon Sprint Actuel</h2>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(currentSprint.startDate)} - {formatDate(currentSprint.endDate)}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
              {getStatusLabel(status)}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${progressColor}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Tâches du sprint</h3>
          <button 
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            {isAddingTask ? 'Annuler' : 'Ajouter une tâche'}
          </button>
        </div>

        {/* Formulaire d'ajout de tâche */}
        {isAddingTask && (
          <form onSubmit={handleAddTask} className="mb-6">
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 py-2 sm:text-sm border-gray-300 rounded-l-md"
                  placeholder="Nom de la tâche"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ajouter
              </button>
            </div>
          </form>
        )}

        {/* Liste des tâches */}
        {currentSprint.tasks && currentSprint.tasks.length > 0 ? (
          <div className="space-y-3">
            {currentSprint.tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center p-3 rounded-md ${
                  task.completed ? 'bg-gray-50' : 'bg-white border border-gray-200 hover:border-indigo-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                    task.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'border-2 border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {task.completed && <CheckCheck className="h-3 w-3" />}
                </button>
                <span 
                  className={`ml-3 text-sm ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </span>
                {task.isNew && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Nouveau
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Aucune tâche pour ce sprint. Ajoutez-en une !</p>
          </div>
        )}

        {/* Bouton de complétion du sprint */}
        {status === 'en-cours' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => completeSprint(currentSprint.id)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Marquer ce sprint comme terminé
            </button>
          </div>
        )}
      </div>

      {/* Sélecteur de sprint */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sélectionner un sprint</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sprints.map((sprint, index) => {
            const sprintStatus = getSprintStatus(sprint);
            const isActive = index === activeSprintIndex;
            return (
              <button
                key={sprint.id}
                type="button"
                onClick={() => setActiveSprintIndex(index)}
                className={`text-left p-3 rounded-md border ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {sprint.title}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    getStatusBadgeClass(sprintStatus)
                  }`}>
                    {getStatusLabel(sprintStatus)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{calculateProgress(sprint)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        getProgressColor(calculateProgress(sprint))
                      }`} 
                      style={{ width: `${calculateProgress(sprint)}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sprint;