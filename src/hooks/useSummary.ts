import { useMemo } from 'react'
import { useContextSelector } from 'use-context-selector'

import { TransactionsContext } from '../contexts/TransactionsContext'

export function useSummary() {
  const transactions = useContextSelector(
    TransactionsContext,
    (context) => context.transactions,
  )

  const summary = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.income += transaction.amount
            acc.total += transaction.amount
          } else {
            acc.expenses += transaction.amount
            acc.total -= transaction.amount
          }

          return acc
        },
        {
          income: 0,
          expenses: 0,
          total: 0,
        },
      ),
    [transactions],
  )

  return {
    summary,
  }
}
