export default function WeekColumn({ weekIndex, habitId, week, isDateCompleted, onToggle, days }) {
  return (
    <div className="week-column">
      <div className="week-header">
        {days.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="week-checkboxes">
        {week.map((date, dayIndex) => {
          const isCompleted = date ? isDateCompleted(habitId, date) : false;

          return (
            <label key={dayIndex} className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => date && onToggle(habitId, date)}
                disabled={!date}
                className="habit-checkbox"
              />
              <span className="checkbox-mark">{isCompleted ? '✔' : '☐'}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
