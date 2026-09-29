interface Props {
  done: number
  total: number
  hasCompleted: boolean
  onClearCompleted: () => void
}

export default function StatsHeader({ done, total, hasCompleted, onClearCompleted }: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <header className="app-header">
      <div className="header-row">
        <h1>
          ✅ To-Do <span className="amp">+</span> Notes
        </h1>
        {hasCompleted && (
          <button className="btn ghost" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </div>
      <div className="stats">
        <span className="stats-text">
          {done} of {total} {total === 1 ? 'task' : 'tasks'} done
        </span>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="pct">{pct}%</span>
      </div>
    </header>
  )
}
