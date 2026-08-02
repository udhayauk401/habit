import React, { useState, useEffect, useCallback, useRef } from 'react';
import { attendanceAPI } from '../services/api';
import DayColumn from './DayColumn';
import '../styles/HabitTable.css';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function HabitTable({ habits, onDeleteHabit, darkMode }) {
  const [attendance, setAttendance] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([new Date().getMonth()]);
  const frozenDailyPercentagesRef = useRef({});
  const attendanceCacheRef = useRef({});

  useEffect(() => {
    loadYearlyData();
  }, [currentYear, habits, selectedMonths]);

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const recordDateKey = (record) => {
    if (!record || !record.date) return '';
    const d = new Date(record.date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const loadYearlyData = async () => {
    if (habits.length === 0) return;

    setLoading(true);
    try {
      const attendanceMap = {};
      const monthsToFetch = Array.from(
        new Set(selectedMonths.length > 0 ? selectedMonths : [new Date().getMonth()])
      ).sort((a, b) => a - b);

      for (const habit of habits) {
        const habitCache = attendanceCacheRef.current[habit._id]?.[currentYear] || {};
        const allRecords = [];
        const monthPromises = monthsToFetch.map(async (mIdx) => {
          const monthNumber = mIdx + 1;

          if (habitCache[monthNumber]) {
            return habitCache[monthNumber];
          }

          const response = await attendanceAPI.getByMonth(habit._id, currentYear, monthNumber);
          const records = response?.records || [];
          habitCache[monthNumber] = records;
          return records;
        });

        const results = await Promise.all(monthPromises);
        results.forEach(arr => allRecords.push(...arr));
        attendanceMap[habit._id] = allRecords;

        attendanceCacheRef.current[habit._id] = attendanceCacheRef.current[habit._id] || {};
        attendanceCacheRef.current[habit._id][currentYear] = habitCache;
      }

      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = async (habitId, date) => {
    try {
      const dateKey = typeof date === 'string' ? date : formatDateKey(date);

      const response = await attendanceAPI.toggle({
        habitId,
        date: dateKey,
        completed: !isDateCompleted(habitId, dateKey)
      });

      if (response.success) {
        setAttendance(prev => {
          const existingRecords = prev[habitId] || [];
          const updatedRecords = existingRecords.filter(r => recordDateKey(r) !== dateKey);
          updatedRecords.push(response.record);
          return { ...prev, [habitId]: updatedRecords };
        });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const getMonthDays = (monthIndex) => {
    const year = currentYear;
    const month = monthIndex;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let date = 1; date <= lastDay; date++) {
      days.push(new Date(year, month, date));
    }

    return days;
  };

  const isDateCompleted = (habitId, dateOrKey) => {
    if (!dateOrKey) return false;
    const records = attendance[habitId] || [];
    const dateKey = typeof dateOrKey === 'string' ? dateOrKey : formatDateKey(dateOrKey);
    const record = records.find(r => recordDateKey(r) === dateKey);
    return !!record && !!record.completed;
  };

  const calculateMonthPercentage = (monthIndex, data = attendance) => {
    const days = getMonthDays(monthIndex);
    const todayKey = formatDateKey(new Date());
    let totalCompleted = 0;
    let totalDays = 0;

    habits.forEach(habit => {
      days.forEach(date => {
        const dateKey = formatDateKey(date);
        if (dateKey >= todayKey) return;

        const records = data[habit._id] || [];
        const record = records.find(r => recordDateKey(r) === dateKey);
        totalDays++;
        if (record?.completed) {
          totalCompleted++;
        }
      });
    });

    return totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;
  };

  const getLockedDailyValue = useCallback((monthIndex) => {
    if (frozenDailyPercentagesRef.current[monthIndex] !== undefined) {
      return frozenDailyPercentagesRef.current[monthIndex];
    }

    const value = calculateMonthPercentage(monthIndex, attendance);
    frozenDailyPercentagesRef.current[monthIndex] = value;
    return value;
  }, [attendance]);

  const toggleMonth = (monthIndex) => {
    setSelectedMonths(prev => {
      if (prev.includes(monthIndex)) {
        return prev.filter(m => m !== monthIndex);
      }
      return [...prev, monthIndex].sort((a, b) => a - b);
    });
  };

  const selectAllMonths = () => {
    setSelectedMonths(Array.from({ length: 12 }, (_, i) => i));
  };

  const clearAllMonths = () => {
    setSelectedMonths([]);
  };

  if (loading && habits.length > 0) {
    return <div className="loading">Loading attendance data...</div>;
  }

  return (
    <div className={`habit-table-container ${darkMode ? 'dark' : ''}`}>
      <div className="year-navigation">
        <button onClick={() => setCurrentYear(currentYear - 1)}>
          ← Prev Year
        </button>
        <h2>Year {currentYear}</h2>
        <button onClick={() => setCurrentYear(currentYear + 1)}>
          Next Year →
        </button>
      </div>

      <div className="month-filter-section">
        <div className="filter-header">
          <h3>Month selector</h3>
          <div className="filter-buttons">
            <button onClick={selectAllMonths} className="filter-btn select-all">Select All</button>
            <button onClick={clearAllMonths} className="filter-btn clear-all">Clear</button>
          </div>
        </div>
        <div className="month-selector">
          {MONTH_NAMES.map((name, monthIndex) => (
            <label key={monthIndex} className="month-checkbox">
              <input
                type="checkbox"
                checked={selectedMonths.includes(monthIndex)}
                onChange={() => toggleMonth(monthIndex)}
              />
              <span className={`month-label ${selectedMonths.includes(monthIndex) ? 'active' : ''}`}>
                {name.slice(0, 3)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {selectedMonths.length === 0 ? (
        <div className="no-months-message">
          <p>Select one or more months to view your progress timeline.</p>
        </div>
      ) : (
        Array.from({ length: 12 }, (_, monthIndex) => monthIndex).filter(monthIndex => selectedMonths.includes(monthIndex)).map((monthIndex) => {
          const monthDays = getMonthDays(monthIndex);
          const monthPercentage = calculateMonthPercentage(monthIndex, attendance);
          const isFit = monthPercentage >= 70;
          const selectedMonthCount = selectedMonths.length;
          const dailyValue = getLockedDailyValue(monthIndex);
          const monthlyValue = selectedMonthCount > 1
            ? Math.round((selectedMonths.reduce((sum, m) => sum + getLockedDailyValue(m), 0) / selectedMonthCount))
            : monthPercentage;
          const yearlyValue = Math.round(
            selectedMonths.reduce((sum, m) => sum + getLockedDailyValue(m), 0) / Math.max(1, selectedMonths.length)
          );

          return (
            <div key={`month-${monthIndex}`} className="month-table-section">
              <div className="month-title">
                <div>
                  <h3>{MONTH_NAMES[monthIndex]} {currentYear}</h3>
                  <p className="month-subtitle">Elegant attendance overview</p>
                </div>
                <span className={`month-percentage ${isFit ? 'fit' : 'unfit'}`}>
                  {monthPercentage}% • {isFit ? 'On track' : 'Needs focus'}
                </span>
              </div>

              <div className="progress-stack">
                <div className="progress-item">
                  <div className="progress-meta">
                    <span>Daily</span>
                    <strong>{dailyValue}%</strong>
                  </div>
                  <div className="progress-bar"><span style={{ width: `${dailyValue}%` }} /></div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <span>Monthly</span>
                    <strong>{monthlyValue}%</strong>
                  </div>
                  <div className="progress-bar"><span style={{ width: `${monthlyValue}%` }} /></div>
                </div>
                <div className="progress-item">
                  <div className="progress-meta">
                    <span>Yearly</span>
                    <strong>{yearlyValue}%</strong>
                  </div>
                  <div className="progress-bar"><span style={{ width: `${yearlyValue}%` }} /></div>
                </div>
              </div>

              <div className="month-table-wrapper">
                <table className="month-table">
                  <thead>
                    <tr>
                      <th className="habit-name-col">Habit</th>
                      {monthDays.map((date) => {
                        const dateKey = formatDateKey(date);
                        return (
                          <th key={`day-${dateKey}`} className="day-header">
                            <div className="day-number">{date.getDate()}</div>
                            <div className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit) => (
                      <tr key={habit._id} className="habit-row">
                        <td className="habit-name">
                          <span>{habit.name}</span>
                          <button onClick={() => onDeleteHabit(habit._id)} className="delete-btn" title="Remove habit">
                            ✕
                          </button>
                        </td>
                        {monthDays.map((date) => {
                          const dateKey = formatDateKey(date);
                          return (
                            <DayColumn
                              key={`${habit._id}-${dateKey}`}
                              habitId={habit._id}
                              dateKey={dateKey}
                              isDateCompleted={isDateCompleted}
                              onToggle={toggleCheckbox}
                            />
                          );
                        })}
                      </tr>
                    ))}

                    <tr className="stats-row daily-row">
                      <td className="stats-label">Daily %</td>
                      {monthDays.map((date) => {
                        let checked = 0;
                        habits.forEach(habit => {
                          if (isDateCompleted(habit._id, date)) {
                            checked++;
                          }
                        });
                        const percentage = habits.length > 0 ? Math.round((checked / habits.length) * 100) : 0;
                        return (
                          <td key={`daily-${date.getDate()}`} className="stats-cell">
                            <span className="daily-percent">{percentage}%</span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default React.memo(HabitTable);
