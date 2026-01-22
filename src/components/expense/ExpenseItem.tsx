import { useState } from 'react'
import { Expense } from '@/types/expense'
import AddExpenseForm from './AddExpenseForm'
import Modal from '@/components/ui/Modal'

type Props = {
  expense: Expense
  index: number
  onUpdate: () => void
  onDelete: (id: number) => Promise<boolean>
}

export default function ExpenseItem({ expense, index, onUpdate, onDelete }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleDelete = async () => {
    if (confirm('この支出データを削除しますか？')) {
      const success = await onDelete(expense.id)
      if (success) {
        setIsEditOpen(false)
        onUpdate()
      } else {
        alert('削除に失敗しました')
      }
    }
  }

  return (
    <>
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

        <div className="flex items-center gap-2">
          <div className="text-right font-semibold text-sm">
            ¥{expense.amount}
          </div>
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
            aria-label="編集"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
      </li>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <AddExpenseForm
          expense={expense}
          onSuccess={() => {
            setIsEditOpen(false)
            onUpdate()
          }}
          onDelete={handleDelete}
        />
      </Modal>
    </>
  )
}