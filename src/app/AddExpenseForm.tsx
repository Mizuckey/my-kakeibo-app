// 登録フォーム
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AmountCalculator from './AmountCalculator'

export default function AddExpenseForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void
  onClose?: () => void
}) {
  const [date, setDate] = useState('')
  const [expression, setExpression] = useState('')
  const [title, setTitle] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([])

  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [paymentMethodId, setPaymentMethodId] = useState<number | ''>('')

  const maxTitleLength = 40

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('expenses').insert([
      {
        date,
        category_id: categoryId,
        payment_method_id: paymentMethodId,
        amount: Number(expression),
        title,
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    setSuccessMessage('登録しました')
    setDate('')
    setCategoryId('')
    setExpression('')
    setPaymentMethodId('')
    setTitle('')

    setTimeout(onSuccess, 800)
  }

  useEffect(() => {
    const fetchMasters = async () => {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('sort_order')

      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('id, name')
        .order('sort_order')

      setCategories(categories ?? [])
      setPaymentMethods(paymentMethods ?? [])
    }

    fetchMasters()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* ヘッダー：左上にタイトル、右上に閉じるボタン */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">支出登録</h3>
      </div>

      <div className="max-h-[60vh] overflow-auto pr-2 space-y-3">
        {successMessage && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="日付"
          className="w-full border p-2 rounded bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* タイトル入力：小さめ、高さ調整、文字数制限とカウント */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, maxTitleLength))}
            placeholder="タイトル（例：昼食代）"
            maxLength={maxTitleLength}
            className="w-full border p-2 rounded h-9 text-sm bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}/{maxTitleLength}
          </div>
        </div>

        <select
          value={categoryId === '' ? '' : String(categoryId)}
          onChange={(e) =>
            setCategoryId(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="
            w-full border p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
          "
          required
        >
          <option value="">カテゴリを選択</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={paymentMethodId === '' ? '' : String(paymentMethodId)}
          onChange={(e) =>
            setPaymentMethodId(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="
            w-full border p-2 rounded
            bg-white text-gray-900
            dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
          "
          required
        >
          <option value="">支払い方法を選択</option>
          {paymentMethods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          inputMode="numeric"
          value={expression}
          onChange={(e) =>
            setExpression(e.target.value.replace(/[^0-9+\-*/.]/g, ''))
          }
          placeholder="金額"
          className="w-full border p-2 rounded text-right text-xl bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AmountCalculator value={expression} onChange={setExpression} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        登録する
      </button>
    </form>
  )
}
