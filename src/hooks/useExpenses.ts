'use client'

import { useEffect, useState, useCallback } from 'react'
import { Expense } from '@/types/expense'
import { fetchExpenses, updateExpense, deleteExpense } from '@/lib/expenses'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchExpenses()
    setExpenses(data)
    setLoading(false)
  }, [])

  const update = useCallback(async (id: number, updates: Partial<Expense>) => {
    const success = await updateExpense(id, updates)
    if (success) {
      await load() // 更新後にリロード
    }
    return success
  }, [load])

  const remove = useCallback(async (id: number) => {
    const success = await deleteExpense(id)
    if (success) {
      await load() // 削除後にリロード
    }
    return success
  }, [load])

  useEffect(() => {
    load()
  }, [load])

  return {
    expenses,
    loading,
    reload: load,
    updateExpense: update,
    deleteExpense: remove,
  }
}