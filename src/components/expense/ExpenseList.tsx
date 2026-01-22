import { Expense } from '@/types/expense'
import ExpenseItem from './ExpenseItem'

type Props = {
  expenses: Expense[]
  onUpdate: () => void
  onDelete: (id: number) => Promise<boolean>
}

export default function ExpenseList({ expenses, onUpdate, onDelete }: Props) {
  if (expenses.length === 0) {
    return <div className="text-gray-500">データがありません</div>
  }

  return (
    <ul className="w-full space-y-2">
      {expenses.map((e, idx) => (
        <ExpenseItem
          key={e.id}
          expense={e}
          index={idx}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}