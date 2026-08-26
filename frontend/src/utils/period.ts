export function getPeriodBucket(period?: string): string | null {

  if (!period) return null

  const match = period.match(/^(\d{1,2})/)

  if (!match) return null

  const startHour = Number(match[1])

  if (startHour < 12) return "Manhã"
  if (startHour < 18) return "Tarde"

  return "Noite"
}