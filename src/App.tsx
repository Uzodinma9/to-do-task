import { useMemo, useState } from 'react'
import type { Note, Task } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { makeId } from './lib/id'
import { seedNotes, seedTasks } from './lib/seed'
import StatsHeader from './components/StatsHeader'
import Toolbar from './components/Toolbar'
import TaskForm, { type NewTaskInput } from './components/TaskForm'
import TaskList from './components/TaskList'
import NoteGrid from './components/NoteGrid'

type Tab = 'tasks' | 'notes'

export default function App() {
  const [tab, setTab] = useState<Tab>('tasks')
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-notes/tasks', seedTasks)
  const [notes, setNotes] = useLocalStorage<Note[]>('todo-notes/notes', seedNotes)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<'created' | 'due' | 'priority'>('created')

  const doneCount = useMemo(() => tasks.filter(t => t.done).length, [tasks])
  const allTags = useMemo(
    () => [...new Set(tasks.flatMap(t => t.tags))].sort(),
    [tasks],
  )

  function addTask(input: NewTaskInput) {
    const task: Task = {
      id: makeId(),
      title: input.title,
      note: input.note,
      done: false,
      priority: input.priority,
      dueDate: input.dueDate,
      tags: input.tags,
      createdAt: Date.now(),
    }
    setTasks(prev => [task, ...prev])
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)))
  }

  function toggleTask(id: string) {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done, completedAt: t.done ? undefined : Date.now() } : t,
      ),
    )
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.done))
  }

  function addNote() {
    const note: Note = {
      id: makeId(),
      title: '',
      body: '',
      pinned: false,
      updatedAt: Date.now(),
    }
    setNotes(prev => [note, ...prev])
  }

  function updateNote(id: string, patch: Partial<Note>) {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...patch } : n)))
  }

  function deleteNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="app">
      <StatsHeader
        done={doneCount}
        total={tasks.length}
        hasCompleted={doneCount > 0}
        onClearCompleted={clearCompleted}
      />

      <nav className="tabs" role="tablist" aria-label="Sections">
        <button
          role="tab"
          aria-selected={tab === 'tasks'}
          className={tab === 'tasks' ? 'tab active' : 'tab'}
          onClick={() => setTab('tasks')}
        >
          Tasks <span className="count">{tasks.length}</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'notes'}
          className={tab === 'notes' ? 'tab active' : 'tab'}
          onClick={() => setTab('notes')}
        >
          Notes <span className="count">{notes.length}</span>
        </button>
      </nav>

      {tab === 'tasks' ? (
        <main>
          <TaskForm onAdd={addTask} />
          <Toolbar
            query={query}
            onQuery={setQuery}
            status={status}
            onStatus={setStatus}
            tags={allTags}
            activeTag={activeTag}
            onTag={setActiveTag}
            sort={sort}
            onSort={setSort}
          />
          <TaskList
            tasks={tasks}
            query={query}
            status={status}
            activeTag={activeTag}
            sort={sort}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
            allTags={allTags}
          />
        </main>
      ) : (
        <main>
          <div className="toolbar">
            <input
              className="field grow"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes…"
              aria-label="Search notes"
            />
          </div>
          <NoteGrid
            notes={notes}
            query={query}
            onAdd={addNote}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        </main>
      )}

      <footer className="app-footer">Saved locally in your browser · To-Do + Notes MVP</footer>
    </div>
  )
}
