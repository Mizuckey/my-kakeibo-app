type Props = {
  label: string
  onPrev: () => void
  onNext: () => void
}

export default function MonthSwitcher({ label, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        aria-label="前月"
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        ‹
      </button>

      <div className="text-lg font-bold">{label}</div>

      <button
        onClick={onNext}
        aria-label="翌月"
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        ›
      </button>
    </div>
  )
}