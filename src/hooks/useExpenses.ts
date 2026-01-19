'use client'

import { useEffect, useState, useCallback } from 'react'
import { Expense } from '@/types/expense'
import { fetchExpenses } from '@/lib/expenses'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchExpenses()
    setExpenses(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    expenses,
    loading,
    reload: load,
  }
}