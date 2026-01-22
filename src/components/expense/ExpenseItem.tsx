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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const handleDelete = async () => {
    const success = await onDelete(expense.id)
    if (success) {
      setIsDeleteConfirmOpen(false)
      onUpdate()
    } else {
      alert('削除に失敗しました')
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
            className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded"
          >
            編集
          </button>
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded"
          >
            削除
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
        />
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        maxWidth="max-w-xs"
      >
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">削除確認</h3>
          <p className="text-sm mb-4">この支出データを削除しますか？</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}