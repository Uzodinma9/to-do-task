export function makeId(): string {
  const cryptoObj = globalThis.crypto
  if (cryptoObj && 'randomUUID' in cryptoObj) return cryptoObj.randomUUID()
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
