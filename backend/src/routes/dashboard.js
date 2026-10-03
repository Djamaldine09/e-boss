const express = require('express');
const { dbManager } = require('../db/connect');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Helper function to get user ID (handle both authenticated and anonymous users)
const getUserId = (req) => {
  // For MVP, use user ID 1 for anonymous requests (assuming we have sample data for user 1)
  return req.user?.id === 'anonymous' ? 1 : parseInt(req.user?.id) || 1;
};

// Get user courses progress
router.get('/courses', async (req, res) => {
  try {
    const userId = getUserId(req);

    const query = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.level,
        c.total_lessons,
        c.icon,
        c.color,
        uc.progress,
        uc.completed_lessons,
        uc.started_at,
        uc.completed_at,
        uc.last_accessed
      FROM courses c
      INNER JOIN user_courses uc ON c.id = uc.course_id
      WHERE uc.user_id = ? AND c.is_active = TRUE
      ORDER BY uc.last_accessed DESC
    `;

    const [results] = await dbManager.execute(query, [userId]);
    
    // Separate in-progress and completed courses
    const inProgress = results.filter(course => course.progress < 100);
    const completed = results.filter(course => course.progress >= 100);

    res.json({
      'in-progress': inProgress,
      'completed': completed
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get user sprints
router.get('/sprints', async (req, res) => {
  try {
    const userId = getUserId(req);

    const query = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.duration_days,
        s.points,
        s.is_active,
        us.user_id,
        us.completed_tasks,
        us.total_tasks,
        us.is_active as user_sprint_active,
        us.started_at,
        us.completed_at,
        CASE 
          WHEN us.started_at IS NOT NULL THEN 
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', st.id,
                'title', st.title,
                'description', st.description,
                'order_index', st.order_index,
                'is_completed', COALESCE(ust.is_completed, FALSE),
                'completed_at', ust.completed_at
              )
            )
          ELSE NULL
        END as tasks
      FROM sprints s
      LEFT JOIN user_sprints us ON s.id = us.sprint_id AND us.user_id = ?
      LEFT JOIN sprint_tasks st ON s.id = st.sprint_id
      LEFT JOIN user_sprint_tasks ust ON us.id = ust.user_sprint_id AND st.id = ust.task_id
      WHERE s.is_active = TRUE
      GROUP BY s.id, us.id
      ORDER BY us.started_at DESC, s.created_at DESC
    `;

    const [results] = await dbManager.execute(query, [userId]);
    
    // Format the results
    const formattedResults = results.map(sprint => ({
      id: sprint.id,
      title: sprint.title,
      description: sprint.description,
      startDate: sprint.started_at || new Date().toISOString(),
      endDate: new Date(new Date(sprint.started_at).getTime() + sprint.duration_days * 24 * 60 * 60 * 1000).toISOString(),
      status: sprint.user_sprint_active ? 'in-progress' : 'upcoming',
      points: sprint.points,
      tasks: sprint.tasks || []
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching sprints:', error);
    res.status(500).json({ error: 'Failed to fetch sprints' });
  }
});

// Get single sprint with tasks
router.get('/sprints/:id', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { id } = req.params;
    
    const query = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.duration_days,
        s.points,
        us.user_id,
        us.completed_tasks,
        us.total_tasks,
        us.is_active as user_sprint_active,
        us.started_at,
        us.completed_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', st.id,
            'title', st.title,
            'description', st.description,
            'order_index', st.order_index,
            'is_completed', COALESCE(ust.is_completed, FALSE),
            'completed_at', ust.completed_at
          )
        ) as tasks
      FROM sprints s
      INNER JOIN user_sprints us ON s.id = us.sprint_id AND us.user_id = ?
      LEFT JOIN sprint_tasks st ON s.id = st.sprint_id
      LEFT JOIN user_sprint_tasks ust ON us.id = ust.user_sprint_id AND st.id = ust.task_id
      WHERE s.id = ? AND s.is_active = TRUE
      GROUP BY s.id, us.id
    `;

    const [results] = await dbManager.execute(query, [userId, id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    const sprint = results[0];
    
    res.json({
      id: sprint.id,
      title: sprint.title,
      description: sprint.description,
      startDate: sprint.started_at || new Date().toISOString(),
      endDate: new Date(new Date(sprint.started_at).getTime() + sprint.duration_days * 24 * 60 * 60 * 1000).toISOString(),
      status: sprint.user_sprint_active ? 'in-progress' : 'upcoming',
      points: sprint.points,
      tasks: sprint.tasks || []
    });
  } catch (error) {
    console.error('Error fetching sprint:', error);
    res.status(500).json({ error: 'Failed to fetch sprint' });
  }
});

// Get calendar events
router.get('/events', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        id,
        title,
        description,
        DATE(event_date) as date,
        TIME(event_time) as time,
        location,
        event_type,
        status
      FROM calendar_events
      WHERE user_id = ?
    `;
    
    const params = [userId];
    
    if (startDate && endDate) {
      query += ` AND event_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      query += ` AND event_date >= CURDATE()`;
    }
    
    query += ` ORDER BY event_date ASC, event_time ASC`;

    const [results] = await dbManager.execute(query, params);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create calendar event
router.post('/events', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { title, description, date, time, location, event_type = 'study' } = req.body;
    
    if (!title || !date || !time) {
      return res.status(400).json({ error: 'Title, date, and time are required' });
    }

    const query = `
      INSERT INTO calendar_events (user_id, title, description, event_date, event_time, location, event_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbManager.execute(query, [
      userId,
      title,
      description || null,
      date,
      time,
      location || null,
      event_type
    ]);

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      date,
      time,
      location,
      event_type,
      status: 'scheduled'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Delete calendar event
router.delete('/events/:id', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { id } = req.params;
    
    const query = `
      DELETE FROM calendar_events 
      WHERE id = ? AND user_id = ?
    `;

    await dbManager.execute(query, [id, userId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get user progress
router.get('/progress', async (req, res) => {
  try {
    const userId = getUserId(req);

    const query = `
      SELECT 
        AVG(uc.progress) as totalProgress,
        COUNT(uc.id) as courseCount,
        SUM(CASE WHEN uc.completed_at IS NOT NULL THEN 1 ELSE 0 END) as completedCourses
      FROM user_courses uc
      INNER JOIN courses c ON uc.course_id = c.id
      WHERE uc.user_id = ? AND c.is_active = TRUE
    `;

    const [results] = await dbManager.execute(query, [userId]);
    
    const progress = results[0];
    const totalProgress = Math.round(progress.totalProgress || 0);
    const weeklyGoal = 70; // Default weekly goal

    res.json({
      totalProgress,
      weeklyGoal,
      courseCount: progress.courseCount,
      completedCourses: progress.completedCourses
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get achievements
router.get('/achievements', async (req, res) => {
  try {
    const userId = getUserId(req);

    const query = `
      SELECT 
        a.id,
        a.title,
        a.description,
        a.icon,
        a.badge_color,
        a.points,
        a.requirement_type,
        a.requirement_value,
        ua.unlocked_at,
        ua.progress,
        ua.is_completed
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
      WHERE a.is_active = TRUE
      ORDER BY a.points ASC
    `;

    const [results] = await dbManager.execute(query, [userId]);
    
    const formattedResults = results.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      completed: achievement.is_completed || false,
      completedAt: achievement.unlocked_at,
      points: achievement.points,
      progress: achievement.progress || (achievement.is_completed ? 100 : 0)
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Update achievement status
router.put('/achievements/:id', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { id } = req.params;
    const { completed } = req.body;
    
    const query = `
      INSERT INTO user_achievements (user_id, achievement_id, unlocked_at, progress, is_completed)
      VALUES (?, ?, CURRENT_TIMESTAMP, 100, ?)
      ON DUPLICATE KEY UPDATE
      SET 
        unlocked_at = IF(?, CURRENT_TIMESTAMP, unlocked_at),
        progress = IF(?, 100, progress),
        is_completed = ?
    `;

    await dbManager.execute(query, [
      userId, id, completed, completed, completed, completed
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

// Add task to sprint
router.post('/sprints/:id/tasks', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // First get or create user sprint
    const userSprintQuery = `
      INSERT INTO user_sprints (user_id, sprint_id, total_tasks, is_active, started_at)
      VALUES (?, ?, 1, TRUE, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE
      SET is_active = TRUE, started_at = CURRENT_TIMESTAMP
    `;
    
    await dbManager.execute(userSprintQuery, [userId, id]);
    
    // Get the user sprint ID
    const [userSprintResult] = await dbManager.execute(
      'SELECT id FROM user_sprints WHERE user_id = ? AND sprint_id = ?',
      [userId, id]
    );
    
    const userSprintId = userSprintResult[0].id;
    
    // Add the task to sprint tasks
    const taskQuery = `
      INSERT INTO sprint_tasks (sprint_id, title, order_index)
      VALUES (?, ?, (SELECT COALESCE(MAX(order_index), 0) + 1 FROM sprint_tasks WHERE sprint_id = ?))
    `;
    
    const [taskResult] = await dbManager.execute(taskQuery, [id, title, id]);
    
    // Add task to user sprint tasks
    const userTaskQuery = `
      INSERT INTO user_sprint_tasks (user_sprint_id, task_id, is_completed)
      VALUES (?, ?, FALSE)
    `;
    
    await dbManager.execute(userTaskQuery, [userSprintId, taskResult.insertId]);
    
    res.status(201).json({
      id: taskResult.insertId,
      title,
      completed: false
    });
  } catch (error) {
    console.error('Error adding task to sprint:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update task status (support both PATCH and PUT)
router.patch('/sprints/:sprintId/tasks/:taskId', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { sprintId, taskId } = req.params;
    const { completed } = req.body;
    
    const query = `
      UPDATE user_sprint_tasks ust
      SET is_completed = ?, completed_at = IF(?, CURRENT_TIMESTAMP, NULL)
      WHERE ust.task_id = ?
    `;

    await dbManager.execute(query, [completed, completed, taskId]);
    
    // Update sprint progress
    const progressQuery = `
      UPDATE user_sprints us
      SET 
        completed_tasks = (
          SELECT COUNT(*) 
          FROM user_sprint_tasks ust 
          INNER JOIN sprint_tasks st ON ust.task_id = st.id 
          WHERE ust.user_sprint_id = us.id AND ust.is_completed = TRUE
        )
      WHERE us.id = (
        SELECT id FROM user_sprints 
        WHERE user_id = ? AND sprint_id = ?
      )
    `;
    
    await dbManager.execute(progressQuery, [userId, sprintId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// Complete sprint
router.put('/sprints/:id/complete', async (req, res) => {
  try {
    const userId = getUserId(req);

    const { id } = req.params;
    
    const query = `
      UPDATE user_sprints 
      SET is_active = FALSE, completed_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND sprint_id = ?
    `;

    await dbManager.execute(query, [userId, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing sprint:', error);
    res.status(500).json({ error: 'Failed to complete sprint' });
  }
});

module.exports = router;
