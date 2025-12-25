'use client' // クライアント側で動作する（ブラウザ上で実行される）Reactコンポーネント

// フックのインポート
import { useState } from 'react' // useState: コンポーネントの状態を保つ
import { supabase } from '@/lib/supabaseClient' // Supabaseクライアントのインスタンス（API通信）
import { useRouter } from 'next/navigation'

export default function AddExpensePage() {
  const router = useRouter()

  /*
  React Hooks (useState)
  ・フォームの入力内容を一時的に保管する箱。
  ・入力が変わるたびにsetState()で状態を更新。
  ・amount: 金額は数値だが、最初は空文字でも受け取れるようにnumber | ''としておく。Number(e.target.value)で明示的に数値へ変換。
  */
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [memo, setMemo] = useState('')

  /*
  handleSubmit(フォーム送信処理)
  ・e.preventDefault(): フォーム送信時にブラウザのリロードを防止する。
  ・必須項目のチェックをした上で、supabase.from(テーブル).insert([各カラム値])で新しいデータを挿入する。
  ・成功すればrouter.push('/')でトップページに戻る。
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !category || !amount) {
      alert('日付、カテゴリ、金額は必須です')
      return
    }

    const { error } = await supabase.from('expenses').insert([
      {
        date,
        category,
        amount: Number(amount),
        payment_method: paymentMethod,
        memo,
      },
    ])

    if (error) {
      alert('保存に失敗しました')
      console.error(error)
    } else {
      router.push('/') //登録後トップページへ移動
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">支出を追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">日付</label>
          <input
            type="date"
            value={date} // 現在の入力値をdate状態にバインド
            onChange={(e) => setDate(e.target.value)} // 値が変更されたときにsetDateを使って更新
            /*
            Tailwind CSSの書き方
            ・w-full：幅100%
            ・border：枠線
            ・p-2：padding（内側の余白）
            ・rounded：角を丸くする
            ※他にも bg-blue-600, text-sm, hover:bg-blue-700 などで見た目を細かく調整できる。
            */
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">カテゴリ</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">金額</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">支払い方法</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          登録する
        </button>
      </form>
    </div>
  )
}