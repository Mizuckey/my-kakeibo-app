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