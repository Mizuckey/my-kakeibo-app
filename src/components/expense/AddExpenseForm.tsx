// 登録・編集フォーム
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Expense } from '@/types/expense'
import AmountCalculator from './AmountCalculator'

export default function AddExpenseForm({
  onSuccess,
  expense, // 編集時は渡す
  onDelete, // 編集時の削除
}: {
  onSuccess: () => void
  expense?: Expense
  onDelete?: () => void
}) {
  const isEdit = !!expense

  const getToday = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const [date, setDate] = useState<string>(expense?.date || getToday())
  const [expression, setExpression] = useState(expense ? String(expense.amount) : '') // 編集時は金額をセット
  const [title, setTitle] = useState(expense?.title || '')
  const [successMessage, setSuccessMessage] = useState('')

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([])

  const [categoryId, setCategoryId] = useState<number | ''>(expense?.category_id || '')
  const [paymentMethodId, setPaymentMethodId] = useState<number | ''>(expense?.payment_method_id || '')

  const maxTitleLength = 40

  // expression を安全に評価して数値を返す（入力は電卓で制限されている想定）
  const evalExpression = (expr: string) => {
    if (!expr) return NaN
    try {
      // 許可されている文字のみで構成されている前提: [0-9+\-*/().]
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${expr})`)
      const v = fn()
      return typeof v === 'number' && Number.isFinite(v) ? v : NaN
    } catch {
      return NaN
    }
  }

  const formatAmount = (n: number) => {
    if (!Number.isFinite(n)) return ''
    return n.toLocaleString('ja-JP')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountValue = evalExpression(expression)

    if (!Number.isFinite(amountValue)) {
      alert('金額が無効です。電卓で金額を入力してください。')
      return
    }

    const data = {
      date,
      category_id: categoryId,
      payment_method_id: paymentMethodId,
      amount: amountValue,
      title,
    }

    let success = false
    if (isEdit && expense) {
      // 編集
      const { error } = await supabase.from('expenses').update(data).eq('id', expense.id)
      success = !error
    } else {
      // 新規
      const { error } = await supabase.from('expenses').insert([data])
      success = !error
    }

    if (!success) {
      alert('保存に失敗しました')
      return
    }

    setSuccessMessage(isEdit ? '更新しました' : '登録しました')
    if (!isEdit) {
      setDate(getToday())
      setCategoryId('')
      setExpression('')
      setPaymentMethodId('')
      setTitle('')
    }

    setTimeout(onSuccess, 800)
  }

  useEffect(() => {
    const fetchMasters = async () => {
      const { data: cats } = await supabase
        .from('categories')
        .select('id, name')
        .order('sort_order')
      const { data: pays } = await supabase
        .from('payment_methods')
        .select('id, name')
        .order('sort_order')

      setCategories(cats ?? [])
      setPaymentMethods(pays ?? [])
    }
    fetchMasters()
  }, [])

  const evaluated = evalExpression(expression)
  const formatted = formatAmount(evaluated)

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-full box-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{isEdit ? '支出編集' : '支出登録'}</h3>
      </div>

      <div className="max-h-[60vh] overflow-auto pr-2 space-y-3">
        {successMessage && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-2 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="w-full max-w-full overflow-hidden">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="日付"
            className="w-full border p-2 rounded bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
          />
        </div>

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

        {/* 金額表示：電卓のみで操作、直接編集不可 */}
        <div className="w-full max-w-full border p-2 rounded text-right text-xl bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
          <span className="mr-2">¥</span>
          <span className="inline-block min-w-[6ch]">{Number(formatted || '0').toLocaleString('ja-JP') || '0'}</span>
        </div>

        <AmountCalculator value={expression} onChange={setExpression} />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-muted text-white px-4 py-2 rounded flex-1"
        >
          {isEdit ? '更新する' : '登録する'}
        </button>
        {isEdit && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            削除
          </button>
        )}
      </div>
    </form>
  )
}
