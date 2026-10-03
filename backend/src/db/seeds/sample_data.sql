-- Sample data for testing the dashboard functionality
-- This file contains sample data for all tables to ensure the dashboard displays properly

-- First, let's create a sample user (assuming user with ID 1 exists)
-- You may need to adjust user_id based on your actual user data

-- Insert sample courses
INSERT IGNORE INTO courses (id, title, description, level, total_lessons, icon, color, is_active) VALUES
(1, 'React Hooks Avancés', 'Maîtrisez les hooks avancés comme useCallback, useMemo et useReducer', 'intermediate', 20, '⚛️', '#3B82F6', TRUE),
(2, 'Node.js Backend', 'Créez des API REST robustes avec Node.js et Express', 'intermediate', 25, '🟢', '#10B981', TRUE),
(3, 'TypeScript Expert', 'Approfondissez vos connaissances en TypeScript', 'advanced', 30, '📘', '#8B5CF6', TRUE),
(4, 'HTML & CSS Fundamentals', 'Les bases du développement web', 'beginner', 15, '🌐', '#F59E0B', TRUE),
(5, 'JavaScript ES6+', 'Les features modernes de JavaScript', 'intermediate', 18, '⚡', '#EF4444', TRUE);

-- Insert sample user course progress
INSERT IGNORE INTO user_courses (user_id, course_id, progress, completed_lessons, started_at, last_accessed) VALUES
(1, 1, 75, 15, '2024-01-01 10:00:00', '2024-12-17 14:30:00'),
(1, 2, 60, 15, '2024-01-05 09:00:00', '2024-12-15 16:20:00'),
(1, 3, 45, 13, '2024-01-10 11:00:00', '2024-12-18 10:15:00'),
(1, 4, 100, 15, '2023-12-01 08:00:00', '2024-12-10 09:00:00'),
(1, 5, 100, 18, '2023-11-15 14:00:00', '2024-12-05 11:30:00');

-- Insert sample sprints
INSERT IGNORE INTO sprints (id, title, description, duration_days, points, is_active) VALUES
(1, 'Sprint React Hooks', 'Maîtrisez les hooks avancés de React', 7, 100, TRUE),
(2, 'Sprint Node.js Backend', 'Créez des API REST robustes avec Node.js', 5, 80, FALSE),
(3, 'Sprint TypeScript Expert', 'Approfondissez vos connaissances en TypeScript', 7, 120, FALSE);

-- Insert sample sprint tasks
INSERT IGNORE INTO sprint_tasks (id, sprint_id, title, description, order_index) VALUES
(1, 1, 'Compléter le cours sur useEffect', 'Étudier en détail le hook useEffect', 1),
(2, 1, 'Pratiquer avec 5 exercices', 'Faire 5 exercices pratiques sur les hooks', 2),
(3, 1, 'Créer un projet personnalisé', 'Créer un projet utilisant les hooks avancés', 3),
(4, 1, 'Revoir les concepts avancés', 'Réviser les concepts complexes', 4),
(5, 1, 'Préparer la présentation', 'Préparer une présentation sur les hooks', 5),
(6, 2, 'Installer Node.js', 'Installer et configurer Node.js', 1),
(7, 2, 'Créer un serveur simple', 'Créer un premier serveur HTTP', 2),
(8, 2, 'Apprendre Express.js', 'Étudier le framework Express.js', 3),
(9, 3, 'Réviser les bases de TypeScript', 'Réviser les fondamentaux de TypeScript', 1),
(10, 3, 'Maîtriser les génériques', 'Apprendre les types génériques', 2),
(11, 3, 'Créer des types avancés', 'Créer des types complexes', 3);

-- Insert sample user sprint progress
INSERT IGNORE INTO user_sprints (user_id, sprint_id, completed_tasks, total_tasks, is_active, started_at) VALUES
(1, 1, 2, 5, TRUE, '2024-12-15 09:00:00'),
(1, 2, 3, 3, FALSE, '2024-12-01 09:00:00'),
(1, 3, 0, 3, FALSE, NULL);

-- Insert sample user sprint task completion
INSERT IGNORE INTO user_sprint_tasks (user_sprint_id, task_id, is_completed, completed_at) VALUES
-- Sprint 1 (React Hooks) - 2 tasks completed
(1, 1, TRUE, '2024-12-16 10:00:00'),
(1, 2, TRUE, '2024-12-17 15:30:00'),
(1, 3, FALSE, NULL),
(1, 4, FALSE, NULL),
(1, 5, FALSE, NULL),
-- Sprint 2 (Node.js) - All tasks completed
(2, 6, TRUE, '2024-12-02 10:00:00'),
(2, 7, TRUE, '2024-12-03 14:00:00'),
(2, 8, TRUE, '2024-12-05 16:00:00');

-- Insert sample achievements
INSERT IGNORE INTO achievements (id, title, description, icon, badge_color, points, requirement_type, requirement_value, is_active) VALUES
(1, 'Premiers Pas', 'Complétez votre premier cours', '🎯', '#10B981', 50, 'course_completion', 1, TRUE),
(2, 'Développeur React', 'Maîtrisez les bases de React', '⚛️', '#3B82F6', 100, 'course_completion', 1, TRUE),
(3, 'Expert TypeScript', 'Terminez le cours TypeScript Expert', '📘', '#8B5CF6', 150, 'course_completion', 1, TRUE),
(4, 'Backend Master', 'Créez votre première API REST', '🔧', '#F59E0B', 120, 'sprint_completion', 1, TRUE),
(5, 'Code Reviewer', 'Participez à 5 sessions de code review', '👥', '#EF4444', 80, 'custom', 5, TRUE),
(6, 'Sprint Champion', 'Complétez 3 sprints avec succès', '🏆', '#F59E0B', 200, 'sprint_completion', 3, TRUE);

-- Insert sample user achievements
INSERT IGNORE INTO user_achievements (user_id, achievement_id, unlocked_at, progress, is_completed) VALUES
(1, 1, '2024-12-10 10:00:00', 100, TRUE),
(1, 2, '2024-12-15 14:00:00', 100, TRUE),
(1, 3, NULL, 45, FALSE),
(1, 4, NULL, 60, FALSE),
(1, 5, NULL, 20, FALSE),
(1, 6, NULL, 33, FALSE);

-- Insert sample calendar events
INSERT IGNORE INTO calendar_events (user_id, title, description, event_date, event_time, location, is_all_day, event_type, status) VALUES
(1, 'Révision React Hooks', 'Révision des hooks avancés : useCallback, useMemo, useReducer', '2024-12-19', '14:00:00', 'Salle de study', FALSE, 'study', 'scheduled'),
(1, 'Session de code Node.js', 'Pratique des API REST avec Express.js', '2024-12-20', '10:00:00', 'Online', FALSE, 'study', 'scheduled'),
(1, 'Workshop TypeScript', 'Atelier sur les types avancés et les génériques', '2024-12-22', '16:00:00', 'Salle B', FALSE, 'meeting', 'scheduled'),
(1, 'Code Review Session', 'Revue de code du projet React', '2024-12-26', '11:00:00', 'Online', FALSE, 'meeting', 'scheduled'),
(1, 'Deadline Sprint React', 'Date limite pour soumettre le projet React', '2024-12-23', '23:59:00', NULL, FALSE, 'deadline', 'scheduled');

-- Insert sample study sessions
INSERT IGNORE INTO study_sessions (user_id, course_id, duration_seconds, session_type, notes, started_at, ended_at) VALUES
(1, 1, 3600, 'study', 'Étude des hooks useCallback et useMemo', '2024-12-17 09:00:00', '2024-12-17 10:00:00'),
(1, 2, 2700, 'study', 'Création d''API REST avec Express', '2024-12-16 14:00:00', '2024-12-16 14:45:00'),
(1, 3, 1800, 'study', 'Types génériques en TypeScript', '2024-12-18 10:00:00', '2024-12-18 10:30:00'),
(1, 1, 900, 'quiz', 'Quiz sur les hooks React', '2024-12-17 10:30:00', '2024-12-17 10:45:00'),
(1, 2, 1200, 'tutor', 'Tutorat sur Node.js avancé', '2024-12-15 16:00:00', '2024-12-15 16:20:00');

-- Insert sample notifications
INSERT IGNORE INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id, is_read, created_at) VALUES
(1, 'Nouveau sprint disponible', 'Un nouveau sprint React Hooks est maintenant disponible', 'info', 'sprint', 1, FALSE, '2024-12-15 09:00:00'),
(1, 'Sprint terminé !', 'Félicitations ! Vous avez terminé le sprint Node.js', 'success', 'sprint', 2, FALSE, '2024-12-05 17:00:00'),
(1, 'Objectif hebdomadaire', 'Vous avez atteint 70% de votre objectif hebdomadaire', 'success', 'user', 1, TRUE, '2024-12-17 18:00:00'),
(1, 'Rappel de deadline', 'Le sprint React Hooks doit être terminé dans 2 jours', 'warning', 'sprint', 1, FALSE, '2024-12-21 09:00:00');
