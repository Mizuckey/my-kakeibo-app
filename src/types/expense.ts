export type Expense = {
  id: number
  date: string
  title: string | null
  amount: number
  category_id: number | null
  payment_method_id: number | null
}