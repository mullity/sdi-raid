import { useState, useEffect } from 'react';
import TaskDetailModal from '../components/TaskDetailModal';
import './ViewerDashboard.css';

function ViewerDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMOSTasks();
  }, [user]);

  const fetchMOSTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/tasks/mos/${user?.mos || '11B'}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching MOS tasks:', err);
      setError(err.message);
      // Fallback to sample data if API fails
      setTasks([
        {
          id: 100,
          number: '350-1-0001',
          title: 'Move as a Member of a Fire Team',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 101,
          number: '350-1-0002',
          title: 'React to Direct Fire Contact',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 102,
          number: '350-1-0003',
          title: 'React to Indirect Fire',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 103,
          number: '350-1-0004',
          title: 'Move Under Direct Fire',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 104,
          number: '350-1-0005',
          title: 'Perform Individual Movement Techniques',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 105,
          number: '350-1-0006',
          title: 'Engage Targets with M4 Rifle',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 106,
          number: '350-1-0007',
          title: 'Maintain M4 Rifle',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        },
        {
          id: 107,
          number: '350-1-0008',
          title: 'Navigate from One Point to Another',
          level: 'individual',
          mos: '11B',
          date_last_completed: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (task) => {
    if (!task.date_last_completed) {
      return <span className="status-badge not-completed">Not Completed</span>;
    }

    const completedDate = new Date(task.date_last_completed);
    const now = new Date();
    const monthsAgo = (now - completedDate) / (1000 * 60 * 60 * 24 * 30);

    if (monthsAgo > 12) {
      return <span className="status-badge expired">Expired</span>;
    } else if (monthsAgo > 6) {
      return <span className="status-badge due-soon">Due Soon</span>;
    } else {
      return <span className="status-badge current">Current</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task.number);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="viewer-dashboard">
        <div className="loading">Loading your training tasks...</div>
      </div>
    );
  }

  return (
    <div className="viewer-dashboard">
      <div className="dashboard-header">
        <h2>Soldier Training Tasks</h2>
        <div className="mos-info">
          <span className="mos-badge">MOS: {user?.mos || '11B'}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Note: Using sample data due to connection issue</p>
        </div>
      )}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No training tasks found for your MOS.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card" onClick={() => handleTaskClick(task)}>
                <div className="task-header">
                  <h3 className="task-number">{task.number}</h3>
                  {getStatusBadge(task)}
                </div>
                <h4 className="task-title">{task.title}</h4>
                <div className="task-details">
                  <div className="task-level">
                    <span className="label">Level:</span>
                    <span className={`level-badge ${task.level}`}>
                      {task.level.charAt(0).toUpperCase() + task.level.slice(1)}
                    </span>
                  </div>
                  <div className="task-completed">
                    <span className="label">Last Completed:</span>
                    <span className="date">{formatDate(task.date_last_completed)}</span>
                  </div>
                </div>
                <div className="task-actions-overlay">
                  <span className="view-details-text">Click to view details</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskNumber={selectedTask}
      />
    </div>
  );
}

export default ViewerDashboard;