const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const DATE_PREFIX_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/

function parseDateOnly(value: string): Date {
  const match = DATE_PREFIX_PATTERN.exec(value)
  if (!match) {
    throw new Error(`Expected a calendar date, received: ${value}`)
  }

  const [, year, month, day] = match
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
}

export function formatDateOnly(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(parseDateOnly(value))
}

export function getMonthKey(value: string): string {
  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(value)
  if (dateOnlyMatch) {
    return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-01`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Expected a valid date or timestamp, received: ${value}`)
  }

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`
}
