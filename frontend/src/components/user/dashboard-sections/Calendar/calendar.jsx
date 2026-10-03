import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Loader2, X } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { dashboardAPI } from '../../../../services/dashboardAPI';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    description: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Données de test pour vérifier l'affichage
        const mockEvents = [
          {
            id: 1,
            title: 'Révision React Hooks',
            description: 'Réviser les concepts avancés des hooks',
            date: '2024-12-20',
            time: '10:00',
            location: 'Bureau',
            event_type: 'study',
            status: 'scheduled'
          },
          {
            id: 2,
            title: 'Session de tutorat',
            description: 'Tutorat sur Node.js avancé',
            date: '2024-12-22',
            time: '14:00',
            location: 'En ligne',
            event_type: 'tutor',
            status: 'scheduled'
          },
          {
            id: 3,
            title: 'Quiz TypeScript',
            description: 'Test sur les types génériques',
            date: '2024-12-25',
            time: '15:30',
            location: 'Salle A',
            event_type: 'quiz',
            status: 'scheduled'
          },
          {
            id: 4,
            title: 'Deadline Sprint React',
            description: 'Soumission du projet de sprint',
            date: '2024-12-28',
            time: '23:59',
            location: 'Plateforme',
            event_type: 'deadline',
            status: 'scheduled'
          }
        ];
        
        // Utiliser les données de test directement pour l'instant
        setEvents(mockEvents);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        // Utiliser les données de test en cas d'erreur
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Aujourd\'hui';
    }
    
    if (isTomorrow(date)) {
      return 'Demain';
    }
    
    return format(date, 'EEEE d MMMM', { locale: fr });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...newEvent,
        dateTime: `${newEvent.date}T${newEvent.time}:00`
      };
      
      const createdEvent = await dashboardAPI.createEvent(eventData);
      
      setEvents(prev => [...prev, createdEvent]);
      setShowAddForm(false);
      setNewEvent({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        description: ''
      });
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
      setError('Impossible d\'ajouter l\'événement. Veuillez réessayer.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await dashboardAPI.deleteEvent(id);
        setEvents(prev => prev.filter(event => event.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'événement:', err);
        setError('Impossible de supprimer l\'événement. Veuillez réessayer.');
      }
    }
  };

  if (loading) {
    return (
      <div className="glass p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Chargement du calendrier...</span>
      </div>
    );
  }

  // Grouper les événements par date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  // Trier les dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <div className="glass p-6 overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            Calendrier
          </h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Nouvel événement</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="glass p-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Heure *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ajouter l'événement
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun événement prévu pour le moment.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un événement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {formatDate(date)}
                </h3>
                
                <div className="space-y-2">
                  {eventsByDate[date].map(event => (
                    <div 
                      key={event.id}
                      className="flex items-start p-3 border rounded-lg hover:bg-gray-50 group"
                    >
                      <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-4 text-center min-w-[60px] flex-shrink-0">
                        <div className="text-sm font-bold">
                          {format(parseISO(event.date), 'd')}
                        </div>
                        <div className="text-xs uppercase">
                          {format(parseISO(event.date), 'MMM', { locale: fr })}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {event.time} • {event.location || 'Aucun lieu spécifié'}
                        </p>
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer l'événement"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;