import type { SortKey, StatusFilter } from '../types'

interface Props {
  query: string
  onQuery: (q: string) => void
  status: StatusFilter
  onStatus: (s: StatusFilter) => void
  tags: string[]
  activeTag: string | null
  onTag: (t: string | null) => void
  sort: SortKey
  onSort: (s: SortKey) => void
}

const STATUSES: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
]

export default function Toolbar({
  query,
  onQuery,
  status,
  onStatus,
  tags,
  activeTag,
  onTag,
  sort,
  onSort,
}: Props) {
  return (
    <div className="toolbar">
      <input
        className="field grow"
        type="search"
        value={query}
        onChange={e => onQuery(e.target.value)}
        placeholder="Search tasks and notes…"
        aria-label="Search tasks"
      />
      <div className="segmented" role="group" aria-label="Filter by status">
        {STATUSES.map(s => (
          <button
            key={s.value}
            className={status === s.value ? 'seg active' : 'seg'}
            onClick={() => onStatus(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <select
        className="field"
        value={sort}
        onChange={e => onSort(e.target.value as SortKey)}
        aria-label="Sort tasks"
      >
        <option value="created">Newest first</option>
        <option value="due">By due date</option>
        <option value="priority">By priority</option>
      </select>
      {tags.length > 0 && (
        <div className="chips" role="group" aria-label="Filter by tag">
          <button
            className={!activeTag ? 'chip tag active' : 'chip tag'}
            onClick={() => onTag(null)}
          >
            All
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              className={activeTag === tag ? 'chip tag active' : 'chip tag'}
              onClick={() => onTag(activeTag === tag ? null : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
