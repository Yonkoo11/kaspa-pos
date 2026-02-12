import { writable } from 'svelte/store'

export type Page = 'landing' | 'terminal' | 'dashboard'

function getPage(): Page {
  const hash = window.location.hash.slice(1)
  if (hash === 'terminal' || hash === 'dashboard') return hash
  return 'landing'
}

export const page = writable<Page>(getPage())

window.addEventListener('hashchange', () => page.set(getPage()))

export function navigate(to: Page) {
  window.location.hash = to === 'landing' ? '' : to
  page.set(to)
}
