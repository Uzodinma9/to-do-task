import { useMemo } from 'react'
import type { Note } from '../types'
import NoteCard from './NoteCard'

interface Props {
  notes: Note[]
  query: string
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Note>) => void
  onDelete: (id: string) => void
}

export default function NoteGrid({ notes, query, onAdd, onUpdate, onDelete }: Props) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? notes.filter(n => `${n.title}\n${n.body}`.toLowerCase().includes(q))
      : notes
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  }, [notes, query])

  return (
    <section className="notes-section">
      <div className="notes-head">
        <h2>Notes</h2>
        <button className="btn primary" onClick={onAdd}>
          + New note
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p className="empty-emoji">📎</p>
          <p>
            {notes.length === 0
              ? 'No notes yet — create your first one.'
              : 'No notes match your search.'}
          </p>
        </div>
      ) : (
        <div className="note-grid">
          {filtered.map(n => (
            <NoteCard key={n.id} note={n} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  )
}
