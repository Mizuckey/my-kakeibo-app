// 一覧ページ（月毎グルーピング）
'use client'

import { useMemo, useState } from 'react'
import AddExpenseForm from '../components/expense/AddExpenseForm'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import ExpenseList from '@/components/expense/ExpenseList'
import Modal from '@/components/ui/Modal'
import { useExpenses } from '@/hooks/useExpenses'

export default function HomePage() {
  const { expenses, loading, reload } = useExpenses()
  const [isOpen, setIsOpen] = useState(false)
  const [displayMonth, setDisplayMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const pad = (n: number) => String(n).padStart(2, '0')

  // 表示期間：前月25日 〜 当月24日
  const range = useMemo(() => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const start = new Date(year, month - 1, 25, 0, 0, 0, 0)
    const end = new Date(year, month, 24, 23, 59, 59, 999)
    return { start, end }
  }, [displayMonth])

  const itemsForMonth = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date)
      if (isNaN(d.getTime())) return false
      return d >= range.start && d <= range.end
    })
  }, [expenses, range])

  const goPrev = () =>
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goNext = () =>
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const label = displayMonth.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
  })

  const formatShort = (d: Date) =>
    `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">家計簿</h1>

      {/* 上部：左に前月/翌月ボタンと中央（ボタン間）に年月（太字）、右に登録ボタン */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            aria-label="前月"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 border md:border-0 border-gray-200 dark:border-gray-700"
          >
            ‹
          </button>

          <div className="text-lg font-bold px-2">{label}</div>

          <button
            onClick={goNext}
            aria-label="翌月"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 border md:border-0 border-gray-200 dark:border-gray-700"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="btn-muted text-white px-3 py-1 rounded"
          >
            ＋ 登録
          </button>
        </div>
      </div>

      {/* 表示期間の説明 */}
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        表示期間：{formatShort(range.start)} 〜 {formatShort(range.end)}
      </div>

      {/* メイン：モバイルではグラフ上（中央配置）、リストは幅いっぱいになる */}
      <div className="flex flex-col-reverse md:flex-row gap-6 items-start w-full">
        <div className="flex-1 w-full space-y-6">
          <ExpenseList expenses={itemsForMonth} />
        </div>

        {/* モバイル時に中央寄せするため flex と justify-center を追加 */}
        <div className="w-full md:w-80 flex justify-center md:justify-start">
          <div className="w-full max-w-xs md:max-w-none">
            <CategoryPieChart items={itemsForMonth} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        // maxWidth="max-w-sm" // 必要なら幅をさらに小さく
      >
        <AddExpenseForm
          onSuccess={() => {
            setIsOpen(false)
            reload()
          }}
        />
      </Modal>
    </div>
  )
}
