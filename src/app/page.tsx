// 一覧ページ（月毎グルーピング）
'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AddExpenseForm from './AddExpenseForm'
import CategoryPieChart from './CategoryPieChart'

type Expense = {
  id: number
  date: string
  title: string | null
  amount: number
  category_id: number | null
  payment_method_id: number | null
}

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [displayMonth, setDisplayMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

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

  const pad = (n: number) => String(n).padStart(2, '0')

  const monthKey = useMemo(() => {
    return `${displayMonth.getFullYear()}-${pad(displayMonth.getMonth() + 1)}`
  }, [displayMonth])

  const itemsForMonth = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date)
      if (isNaN(d.getTime())) return false
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
      return key === monthKey
    })
  }, [expenses, monthKey])

  const goPrev = () =>
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goNext = () =>
    setDisplayMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const label = displayMonth.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">家計簿</h1>

      {/* 上部：左に前月/翌月ボタンと中央（ボタン間）に年月（太字）、右に登録ボタン */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            aria-label="前月"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ‹
          </button>

          <div className="text-lg font-bold">{label}</div>

          <button
            onClick={goNext}
            aria-label="翌月"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {/* メイン：モバイルではグラフ上（中央配置）、リストは幅いっぱいになる */}
      <div className="flex flex-col-reverse md:flex-row gap-6 items-start w-full">
        <div className="flex-1 w-full space-y-6">
          {itemsForMonth.length === 0 && <div className="text-gray-500">データがありません</div>}

          <ul className="w-full space-y-2">
            {itemsForMonth.map((e: any, idx: number) => (
              <li
                key={e.id}
                className="w-full flex items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded text-sm animate-list-item"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-sm text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                    {e.date}
                  </div>
                  <div className="font-medium truncate min-w-0">
                    {e.title ?? '（タイトルなし）'}
                  </div>
                </div>

                <div className="text-right font-semibold text-sm">¥{e.amount}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* モバイル時に中央寄せするため flex と justify-center を追加 */}
        <div className="w-full md:w-80 flex justify-center md:justify-start">
          <div className="w-full max-w-xs md:max-w-none">
            <CategoryPieChart items={itemsForMonth} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden">
          {/* オーバーレイ（フェードイン） */}
          <div className="absolute inset-0 modal-overlay bg-black/50" />

          {/* モーダル本体：左右に余白を入れて小さい画面で横スクロールしないようにする */}
          <div className="relative z-10 w-full px-4">
            <div className="modal-content bg-white dark:bg-gray-800 p-4 rounded shadow-lg relative mx-auto w-full max-w-md box-border overflow-hidden">
              <AddExpenseForm
                onSuccess={() => {
                  setIsOpen(false)
                  fetchExpenses()
                }}
              />
              <button
                onClick={() => setIsOpen(false)}
                aria-label="閉じる"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 text-lg"
              >
                ×
              </button>
            </div>
          </div>

          {/* アニメーションは globals.css に移している場合はここを削除してもOK */}
          <style jsx>{`
            @keyframes overlayFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes popUp {
              from { opacity: 0; transform: translateY(12px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .modal-overlay {
              animation: overlayFadeIn 220ms ease-out forwards;
            }
            .modal-content {
              animation: popUp 260ms cubic-bezier(.2,.9,.3,1) forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
