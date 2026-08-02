import React, { useEffect, useState } from 'react';

function getStatus(isCompleted, dateKey, todayKey) {
  if (isCompleted) return 'completed';
  if (dateKey < todayKey) return 'absent';
  return 'pending';
}

function DayColumn({ habitId, dateKey, isDateCompleted, onToggle }) {
  if (!dateKey) return <td className="empty-day-cell"></td>;

  const isCompleted = isDateCompleted(habitId, dateKey);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [displayStatus, setDisplayStatus] = useState(() => getStatus(isCompleted, dateKey, todayKey));

  useEffect(() => {
    const nextStatus = getStatus(isCompleted, dateKey, todayKey);
    if (displayStatus === 'completed' || displayStatus === 'absent') {
      return;
    }
    setDisplayStatus(nextStatus);
  }, [displayStatus, isCompleted, dateKey, todayKey]);

  const status = displayStatus;
  const isInteractive = dateKey === todayKey && !isCompleted;
  const isLocked = !isInteractive;

  return (
    <td className="day-cell">
      <label className="day-checkbox-wrapper" title={status === 'completed' ? 'Completed' : status === 'absent' ? 'Absent' : dateKey === todayKey ? 'Today' : 'Locked'}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => {
            if (isInteractive) onToggle(habitId, dateKey);
          }}
          className="habit-checkbox"
          disabled={isLocked}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        />
        <span className={`day-checkbox-mark ${status}`} />
      </label>
    </td>
  );
}

export default React.memo(DayColumn);
