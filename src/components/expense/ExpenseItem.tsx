import { Expense } from '@/types/expense'

type Props = {
  expense: Expense
  index: number
}

export default function ExpenseItem({ expense, index }: Props) {
  return (
    <li
      className="
        w-full flex items-center justify-between gap-3
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        px-3 py-2 rounded text-sm
        animate-list-item
      "
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-sm text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
          {expense.date}
        </div>

        <div className="font-medium truncate min-w-0">
          {expense.title ?? '（タイトルなし）'}
        </div>
      </div>

      <div className="text-right font-semibold text-sm">
        ¥{expense.amount}
      </div>
    </li>
  )
}