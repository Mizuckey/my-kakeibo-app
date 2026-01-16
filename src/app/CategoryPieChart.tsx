'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { supabase } from '@/lib/supabaseClient'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CategoryPieChart({ items }: { items: any[] }) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('categories').select('id, name')
      setCategories(data ?? [])
    }
    fetch()
  }, [])

  const { labels, data } = useMemo(() => {
    const map = new Map<number | string, number>()
    for (const it of items) {
      const cid = it.category_id ?? '未分類'
      map.set(cid, (map.get(cid) ?? 0) + Number(it.amount ?? 0))
    }

    const entries = Array.from(map.entries()).sort((a, b) => (b[1] as number) - (a[1] as number))
    const labels = entries.map(([cid]) => {
      if (typeof cid === 'number') {
        const found = categories.find((c) => c.id === cid)
        return found ? found.name : `カテゴリ ${cid}`
      }
      return String(cid)
    })
    const data = entries.map(([, v]) => v as number)

    return { labels, data }
  }, [items, categories])

  if (labels.length === 0) {
    return <div className="text-sm text-gray-500">カテゴリデータがありません</div>
  }

  // くすみトーンのパレット（低彩度・中明度）
  const bgColors = labels.map((_, i) =>
    `hsl(${(i * 47) % 360} 25% 58%)`
  )

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColors,
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="w-full max-w-xs">
      <h3 className="text-sm font-medium mb-2">カテゴリ別割合</h3>
      <Pie data={chartData} />
      <div className="mt-3 text-left text-lg font-bold text-gray-900 dark:text-gray-100">
        合計 ¥{data.reduce((s, v) => s + Number(v), 0)}
      </div>
    </div>
  )
}