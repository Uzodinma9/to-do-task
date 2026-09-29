import type { Note, Task } from '../types'
import { toIso, todayIso } from './date'

export function seedTasks(): Task[] {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 6)

  return [
    {
      id: 't1',
      title: 'Welcome to your to-do list',
      note: 'Click a task to expand its note. Everything you type here is saved automatically to your browser — no account needed.\n\nTip: use tags like #work or #home, then filter by tag from the bar above.',
      done: false,
      priority: 'medium',
      dueDate: todayIso(),
      tags: ['getting-started'],
      createdAt: Date.now() - 2_000,
    },
    {
      id: 't2',
      title: 'Draft project brief',
      note: 'Outline goals, scope and deadlines. Attach links and meeting notes here so nothing lives in three different places.',
      done: false,
      priority: 'high',
      dueDate: toIso(tomorrow),
      tags: ['work'],
      createdAt: Date.now() - 1_000,
    },
    {
      id: 't3',
      title: 'Plan weekend groceries',
      note: 'Milk, eggs, coffee beans, spinach, olive oil.',
      done: false,
      priority: 'low',
      tags: ['home'],
      createdAt: Date.now(),
    },
    {
      id: 't4',
      title: 'Set up project board',
      note: 'This one is already done — tick your own tasks with the checkbox on the left.',
      done: true,
      priority: 'low',
      tags: ['work'],
      createdAt: Date.now() - 5_000,
      completedAt: Date.now() - 4_000,
    },
  ]
}

export function seedNotes(): Note[] {
  return [
    {
      id: 'n1',
      title: 'Meeting notes — kickoff',
      body: 'Discussed scope for Q4.\n- Demo due end of October\n- Marketing needs a landing page\n- Follow up with design team on Friday',
      pinned: true,
      updatedAt: Date.now(),
    },
    {
      id: 'n2',
      title: 'Reading list',
      body: '1. The Pragmatic Programmer\n2. Designing Data-Intensive Applications\n3. Refactoring UI',
      pinned: false,
      updatedAt: Date.now() - 1_000,
    },
  ]
}
