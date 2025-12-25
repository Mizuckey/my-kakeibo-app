'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AddExpenseForm from './AddExpenseForm'

export default function HomePage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchExpenses = async () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        date,
        amount,
        title,
        categories (
          id,
          name
        ),
        payment_methods (
          id,
          name
        )
      `)
      .order('date', { ascending: false })

    if (!error) {
      setExpenses(data ?? [])
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="
      min-h-screen
      bg-gray-100 text-gray-900
      dark:bg-gray-900 dark:text-gray-100
      p-4"
    >
      <h1 className="text-xl font-bold mb-4">今月の家計簿</h1>

      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        ＋ 登録
      </button>

      <ul className="space-y-2">
        {expenses.map((e) => (
          <li key={e.id} className="border p-2 rounded">
            {e.date} / {e.category_id} / ¥{e.amount}
          </li>
        ))}
      </ul>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-full max-w-md">
            <AddExpenseForm
              onSuccess={() => {
                setIsOpen(false)
                fetchExpenses()
              }}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 text-sm text-gray-500"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
