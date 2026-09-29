import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initial()
      return JSON.parse(raw) as T
    } catch {
      // Corrupted or unreadable data: fall back to a fresh seed.
      try {
        localStorage.removeItem(key)
      } catch {
        /* storage unavailable */
      }
      return initial()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota or privacy-mode failures are non-fatal for the MVP */
    }
  }, [key, value])

  return [value, setValue] as const
}
