import { useState } from 'react'
import type { Task } from '../types'
import { formatDue, isOverdue, isToday } from '../lib/date'

interface Props {
  task: Task
  onToggle: (id: string) => void
  onUpdate: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
  allTags: string[]
}

export default function TaskItem({ task, onToggle, onUpdate, onDelete, allTags }: Props) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const overdue = task.dueDate && !task.done && isOverdue(task.dueDate)
  const dueToday = task.dueDate && !task.done && isToday(task.dueDate)
  const dueClass = overdue ? 'overdue' : dueToday ? 'today' : ''

  function toggleNote() {
    setOpen(o => !o)
    setConfirming(false)
  }

  return (
    <li className={open ? 'task open' : 'task'}>
      <div className="task-main">
        <button
          className={task.done ? 'checkbox checked' : 'checkbox'}
          onClick={() => onToggle(task.id)}
          aria-pressed={task.done}
          aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
        >
          {task.done && <span className="check-mark">✓</span>}
        </button>

        <div className="task-body">
          <button className="task-title-btn" onClick={toggleNote} aria-expanded={open}>
            <span className={task.done ? 'title done' : 'title'}>{task.title}</span>
            <span className="chevron" aria-hidden>
              {open ? '▾' : '▸'}
            </span>
          </button>
          <div className="meta">
            <span className={`chip prio ${task.priority}`}>{task.priority}</span>
            {task.dueDate && (
              <span className={`chip due ${dueClass}`}>📅 {formatDue(task.dueDate)}</span>
            )}
            {task.tags.map(t => (
              <span key={t} className="chip tag">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <div className="task-actions">
          <button
            className="icon-btn"
            onClick={toggleNote}
            aria-label={open ? 'Hide note' : 'Show note'}
          >
            📝
          </button>
          <button
            className="icon-btn"
            onClick={() => setConfirming(c => !c)}
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {open && (
        <div className="task-note">
          <label className="note-label" htmlFor={`note-${task.id}`}>
            Note
          </label>
          <textarea
            id={`note-${task.id}`}
            className="field"
            value={task.note}
            onChange={e => onUpdate(task.id, { note: e.target.value })}
            rows={4}
            placeholder="Add details, links, context…"
          />
          <div className="edit-row">
            <input
              type="date"
              className="field"
              value={task.dueDate ?? ''}
              onChange={e => onUpdate(task.id, { dueDate: e.target.value || undefined })}
              aria-label="Edit due date"
            />
            <select
              className="field"
              value={task.priority}
              onChange={e => onUpdate(task.id, { priority: e.target.value as Task['priority'] })}
              aria-label="Edit priority"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              className="field grow"
              value={task.tags.join(', ')}
              onChange={e =>
                onUpdate(task.id, {
                  tags: e.target.value
                    .split(',')
                    .map(t => t.trim().toLowerCase().replace(/^#/, ''))
                    .filter(Boolean),
                })
              }
              placeholder="Tags (comma-separated)"
              aria-label="Edit tags"
            />
          </div>
          {confirming ? (
            <div className="confirm-row">
              <span>Delete this task?</span>
              <button
                className="btn danger"
                onClick={() => {
                  onDelete(task.id)
                  setConfirming(false)
                }}
              >
                Delete
              </button>
              <button className="btn ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          ) : null}
          <div className="note-hint">
            {allTags.length > 0 && (
              <span className="hint-text">Existing tags: {allTags.slice(0, 8).map(t => `#${t}`).join(' ')}</span>
            )}
          </div>
          <div className="edit-title-row">
            <input
              className="field grow"
              value={task.title}
              onChange={e => onUpdate(task.id, { title: e.target.value })}
              aria-label="Edit title"
            />
          </div>
        </div>
      )}
    </li>
  )
}
