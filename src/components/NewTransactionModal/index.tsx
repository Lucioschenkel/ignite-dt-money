import { useContextSelector } from 'use-context-selector'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleUp, ArrowCircleDown, X } from 'phosphor-react'
import * as z from 'zod'

import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../contexts/TransactionsContext'

const newTransactionFormSchema = z.object({
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  type: z.enum(['income', 'expense']),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createTransaction
    },
  )

  const { register, handleSubmit, control, reset } =
    useForm<NewTransactionFormInputs>({
      resolver: zodResolver(newTransactionFormSchema),
      defaultValues: {
        type: 'income',
      },
    })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    const { amount, category, description, type } = data

    await createTransaction({
      amount,
      category,
      description,
      type,
    })
    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>New transaction</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Description"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Amount"
            required
            {...register('amount', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Category"
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <TransactionType
                onValueChange={field.onChange}
                value={field.value}
              >
                <TransactionTypeButton variant="income" value="income">
                  <ArrowCircleUp size={24} /> Income
                </TransactionTypeButton>
                <TransactionTypeButton variant="expense" value="expense">
                  <ArrowCircleDown size={24} /> Expense
                </TransactionTypeButton>
              </TransactionType>
            )}
          />
          <button type="submit">Save</button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
