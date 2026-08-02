export default function MonthColumn({ monthIndex, habitId, monthDays, isDateCompleted, onToggle }) {
  return (
    <div className="month-column">
      <div className="month-header">
        <div className="month-number">M{monthIndex + 1}</div>
      </div>
      <div className="month-days-grid">
        {monthDays.map((date, dayIndex) => {
          const isCompleted = date ? isDateCompleted(habitId, date) : false;

          return (
            <label key={dayIndex} className="day-checkbox">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => date && onToggle(habitId, date)}
                disabled={!date}
                className="habit-checkbox"
              />
              <span className="day-mark">{date ? date.getDate() : ''}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
