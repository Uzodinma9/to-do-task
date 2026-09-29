export type Priority = 'low' | 'medium' | 'high'

export type StatusFilter = 'all' | 'active' | 'completed'

export type SortKey = 'created' | 'due' | 'priority'

export interface Task {
  id: string
  title: string
  note: string
  done: boolean
  priority: Priority
  dueDate?: string // ISO date (YYYY-MM-DD)
  tags: string[]
  createdAt: number
  completedAt?: number
}

export interface Note {
  id: string
  title: string
  body: string
  pinned: boolean
  updatedAt: number
}
