import { useEffect, useState } from 'react'

// Tiny History-API router: no dependency, works with Netlify's /* -> /index.html rewrite.
const listeners = new Set()

export function navigate(to) {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.scrollTo({ top: 0 })
  listeners.forEach((fn) => fn())
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    listeners.add(update)
    window.addEventListener('popstate', update)
    return () => {
      listeners.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return path
}
