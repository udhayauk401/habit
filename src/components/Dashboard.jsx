import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { habitsAPI } from '../services/api';
import HabitTable from './HabitTable';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState('');
  const [habitToDelete, setHabitToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadHabits();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const response = await habitsAPI.getHabits();
      if (response.success) {
        setHabits(response.habits || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error loading habits:', err);
      setError(err.message);
      if (err.message.includes('401')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const addHabit = useCallback(async () => {
    if (newHabit.trim()) {
      try {
        const response = await habitsAPI.createHabit({ name: newHabit });
        if (response.success) {
          setHabits(prev => [...prev, response.habit]);
          setNewHabit('');
          setShowForm(false);
          setToast('Habit added');
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  }, [newHabit]);

  const requestDeleteHabit = useCallback((habitId) => {
    setHabitToDelete(habitId);
  }, []);

  const deleteHabit = useCallback(async () => {
    if (!habitToDelete) return;
    try {
      const response = await habitsAPI.deleteHabit(habitToDelete);
      if (response.success) {
        setHabits(prev => prev.filter(h => h._id !== habitToDelete));
        setToast('Habit removed');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setHabitToDelete(null);
    }
  }, [habitToDelete]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const filteredHabits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return habits;
    return habits.filter(habit => habit.name.toLowerCase().includes(query));
  }, [habits, searchQuery]);

  const overviewCards = [
    { label: 'Overall completion', value: habits.length ? '78%' : '0%', hint: 'Across tracked habits' },
    { label: 'Current streak', value: `${Math.min(habits.length, 12)} days`, hint: 'Consistency score' },
    { label: 'Total habits', value: `${habits.length}`, hint: 'Active routines' },
    { label: 'Today’s progress', value: habits.length ? 'On track' : 'Ready', hint: 'Focus for today' }
  ];

  if (loading) {
    return (
      <div className={`dashboard-shell ${darkMode ? 'dark' : ''}`}>
        <div className="dashboard-page">
          <header className="topbar">
            <div className="brand-group">
              <div className="brand-mark">◎</div>
              <div>
                <p className="eyebrow">Productivity OS</p>
                <h1>Daily Routine & Attendance Tracker</h1>
              </div>
            </div>
          </header>
          <div className="loading-grid">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="skeleton-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-shell ${darkMode ? 'dark' : ''}`}>
      <div className="dashboard-page">
        <header className="topbar">
          <div className="brand-group">
            <div className="brand-mark">◎</div>
            <div>
              <p className="eyebrow">Productivity OS</p>
              <h1>Daily Routine & Attendance Tracker</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => setDarkMode(value => !value)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="icon-btn">🔔</button>
            <button onClick={handleLogout} className="primary-btn slim">
              Logout
            </button>
          </div>
        </header>

        <section className="hero-card">
          <div>
            <p className="eyebrow">Today’s focus</p>
            <h2>Turn consistency into a calm, premium routine.</h2>
            <p>Track habits, celebrate progress, and make every day feel effortless.</p>
          </div>
          <div className="hero-pill">Live • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        </section>

        <section className="stats-grid">
          {overviewCards.map(card => (
            <article key={card.label} className="stat-card">
              <p className="stat-label">{card.label}</p>
              <h3>{card.value}</h3>
              <span>{card.hint}</span>
            </article>
          ))}
        </section>

        <section className="toolbar-card">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits"
            />
          </div>
          <button className="ghost-btn" onClick={() => setShowForm(true)}>
            + Add Habit
          </button>
        </section>

        {error && <div className="inline-alert">{error}</div>}

        {habits.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-illustration">✦</div>
            <h3>Create your first routine</h3>
            <p>Add a habit to start building momentum and seeing your attendance bloom.</p>
            <button className="primary-btn" onClick={() => setShowForm(true)}>
              Create Habit
            </button>
          </div>
        ) : (
          <HabitTable habits={filteredHabits} onDeleteHabit={requestDeleteHabit} darkMode={darkMode} />
        )}

        {showForm && (
          <div className="sheet-backdrop" onClick={() => setShowForm(false)}>
            <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-header">
                <div>
                  <p className="eyebrow">Quick add</p>
                  <h3>Add a new habit</h3>
                </div>
                <button className="icon-btn" onClick={() => setShowForm(false)}>×</button>
              </div>
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Enter habit name"
                autoFocus
                className="habit-input"
              />
              <div className="form-actions">
                <button className="ghost-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={addHabit}>
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        )}

        <button className="floating-add-btn" onClick={() => setShowForm(true)}>
          +
        </button>

        {habitToDelete && (
          <div className="modal-backdrop" onClick={() => setHabitToDelete(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Delete habit?</h3>
              <p>This will remove the habit and its attendance history from the current view.</p>
              <div className="modal-actions">
                <button className="ghost-btn" onClick={() => setHabitToDelete(null)}>
                  Cancel
                </button>
                <button className="primary-btn danger" onClick={deleteHabit}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}
