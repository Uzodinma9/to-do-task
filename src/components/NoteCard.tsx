import { useState } from 'react'
import type { Note } from '../types'
import type { ChangeEvent } from 'react'

interface Props {
  note: Note
  onUpdate: (id: string, patch: Partial<Note>) => void
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  function handleTitle(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(note.id, { title: e.target.value, updatedAt: Date.now() })
  }

  function handleBody(e: ChangeEvent<HTMLTextAreaElement>) {
    onUpdate(note.id, { body: e.target.value, updatedAt: Date.now() })
  }

  return (
    <article className={editing ? 'note-card editing' : 'note-card'}>
      <div className="note-head">
        {editing ? (
          <input className="field" value={note.title} onChange={handleTitle} placeholder="Title" />
        ) : (
          <h3 className="note-title">{note.title || 'Untitled note'}</h3>
        )}
        <button
          className={note.pinned ? 'icon-btn pinned' : 'icon-btn'}
          onClick={() => onUpdate(note.id, { pinned: !note.pinned, updatedAt: Date.now() })}
          aria-pressed={note.pinned}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
        >
          📌
        </button>
      </div>

      {editing ? (
        <textarea
          className="field note-body-edit"
          value={note.body}
          onChange={handleBody}
          rows={6}
          placeholder="Write something…"
        />
      ) : (
        <p className="note-body">{note.body || <em>Empty note — click Edit to add text.</em>}</p>
      )}

      <div className="note-foot">
        <span className="note-date">
          {new Date(note.updatedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <div className="note-actions">
          <button className="btn ghost" onClick={() => setEditing(x => !x)}>
            {editing ? 'Done' : 'Edit'}
          </button>
          {confirming ? (
            <>
              <button className="btn danger" onClick={() => onDelete(note.id)}>
                Delete
              </button>
              <button className="btn ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn ghost" onClick={() => setConfirming(true)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
