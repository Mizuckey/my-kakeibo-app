import { supabase } from '@/lib/supabaseClient'
import { Expense } from '@/types/expense'

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}

export const updateExpense = async (id: number, updates: Partial<Expense>): Promise<boolean> => {
  const { error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error(error)
    return false
  }

  return true
}

export const deleteExpense = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return false
  }

  return true
}