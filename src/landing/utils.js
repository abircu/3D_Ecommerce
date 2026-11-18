export const ease = [0.22, 1, 0.36, 1]

export function unsplash(id, w = 900, h) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`
}

export function money(v) {
  return `$${v.toLocaleString('en-US')}`
}
