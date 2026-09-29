import { useMemo } from 'react'
import type { SortKey, StatusFilter, Task } from '../types'
import { daysUntil } from '../lib/date'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  query: string
  status: StatusFilter
  activeTag: string | null
  sort: SortKey
  onToggle: (id: string) => void
  onUpdate: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
  allTags: string[]
}

const PRIO_RANK: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 }

export default function TaskList({
  tasks,
  query,
  status,
  activeTag,
  sort,
  onToggle,
  onUpdate,
  onDelete,
  allTags,
}: Props) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = tasks.filter(t => {
      if (status === 'active' && t.done) return false
      if (status === 'completed' && !t.done) return false
      if (activeTag && !t.tags.includes(activeTag)) return false
      if (q && !(`${t.title}\n${t.note}`.toLowerCase().includes(q))) return false
      return true
    })

    const sorted = [...list]
    if (sort === 'due') {
      sorted.sort((a, b) => {
        // No due date sinks to the bottom; overdue floats to the top.
        const da = a.dueDate ? daysUntil(a.dueDate) : Number.POSITIVE_INFINITY
        const db = b.dueDate ? daysUntil(b.dueDate) : Number.POSITIVE_INFINITY
        return da - db
      })
    } else if (sort === 'priority') {
      sorted.sort(
        (a, b) => PRIO_RANK[a.priority] - PRIO_RANK[b.priority] || b.createdAt - a.createdAt,
      )
    } else {
      sorted.sort((a, b) => b.createdAt - a.createdAt)
    }

    if (status !== 'completed') {
      sorted.sort((a, b) => Number(a.done) - Number(b.done))
    }
    return sorted
  }, [tasks, query, status, activeTag, sort])

  if (tasks.length === 0) {
    return (
      <div className="empty">
        <p className="empty-emoji">🗒️</p>
        <p>No tasks yet — add your first one above.</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="empty">
        <p className="empty-emoji">🔍</p>
        <p>Nothing matches your search or filters.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {filtered.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          allTags={allTags}
        />
      ))}
    </ul>
  )
}
