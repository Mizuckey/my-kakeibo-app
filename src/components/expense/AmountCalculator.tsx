type Props = {
  value: string
  onChange: (v: string) => void
}

const calculate = (expr: string): string => {
  const safe = expr.replace(/[^0-9+\-*/.]/g, '')

  try {
    const result = Function(`"use strict"; return (${safe})`)()
    return String(Math.floor(result))
  } catch {
    return expr
  }
}

export default function Calculator({ value, onChange }: Props) {
  const buttons = [
    '7','8','9','÷',
    '4','5','6','×',
    '1','2','3','-',
    '0','00','.','+',
  ]

  const handleClick = (b: string) => {
    const map: Record<string, string> = {
      '÷': '/',
      '×': '*',
    }

    onChange(value + (map[b] ?? b))
  }

  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {buttons.map((b) => (
        <button
          key={b}
          type="button"
          onClick={() => handleClick(b)}
          className="
            border rounded p-3 text-lg
            bg-gray-100 dark:bg-gray-700
          "
        >
          {b}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange('')}
        className="col-span-2 border rounded p-3 bg-red-200 dark:bg-red-800"
      >
        C
      </button>

      <button
        type="button"
        onClick={() => onChange(calculate(value))}
        className="col-span-2 border rounded p-3 bg-blue-600 text-white"
      >
        =
      </button>
    </div>
  )
}
