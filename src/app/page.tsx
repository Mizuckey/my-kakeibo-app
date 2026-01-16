'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AddExpenseForm from './AddExpenseForm'

export default function HomePage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    setExpenses(data ?? [])
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">今月の家計簿</h1>

      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500"
      >
        ＋ 登録
      </button>

      <ul className="space-y-2">
        {expenses.map((e) => (
          <li
            key={e.id}
            className="
              border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800
              p-3 rounded
            "
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {e.date}
            </div>
            <div className="font-medium">{e.title ?? '（タイトルなし）'}</div>
            <div className="text-right font-bold">¥{e.amount}</div>
          </li>
        ))}
      </ul>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded w-full max-w-md">
            <AddExpenseForm
              onSuccess={() => {
                setIsOpen(false)
                fetchExpenses()
              }}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
