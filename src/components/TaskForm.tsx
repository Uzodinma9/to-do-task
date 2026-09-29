import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Priority } from '../types'

export interface NewTaskInput {
  title: string
  note: string
  priority: Priority
  dueDate?: string
  tags: string[]
}

interface Props {
  onAdd: (input: NewTaskInput) => void
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [tagsDraft, setTagsDraft] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({
      title: trimmed,
      note: note.trim(),
      priority,
      dueDate: dueDate || undefined,
      tags: tagsDraft
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean),
    })
    setTitle('')
    setNote('')
    setPriority('medium')
    setDueDate('')
    setTagsDraft('')
  }

  return (
    <form className="task-form card" onSubmit={submit}>
      <div className="form-row">
        <input
          className="field grow"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New task title"
        />
        <input
          type="date"
          className="field"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          aria-label="Due date"
        />
        <select
          className="field"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          aria-label="Priority"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button className="btn primary" type="submit" disabled={!title.trim()}>
          Add task
        </button>
      </div>
      <textarea
        className="field"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Optional note — details, links, context…"
        rows={2}
        aria-label="New task note"
      />
      <input
        className="field"
        value={tagsDraft}
        onChange={e => setTagsDraft(e.target.value)}
        placeholder="Tags (comma-separated, optional)"
        aria-label="New task tags"
      />
    </form>
  )
}
