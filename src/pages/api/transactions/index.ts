import { ITransaction } from '@/types/index'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/transactions/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        // Retrieve transactions from the database
        const { startDate, endDate } = req.query
        const transactions: ITransaction[] = await prisma.transaction.findMany({
          where: {
            date: {
              gte: startDate ? new Date(startDate as string) : undefined,
              lte: endDate ? new Date(endDate as string) : undefined
            }
          }
        })
        res.status(200).json(transactions)
      } catch (error) {
        console.error('Failed to retrieve transactions:', error)
        res.status(500).json({ error: 'Failed to retrieve transactions' })
      }
      break

    case 'POST':
      try {
        // Verify if the request body is an array or a single object
        const transactionsInput = Array.isArray(req.body) ? req.body : [req.body]

        // Use a loop to create each transaction and collect them
        const createdTransactions = []
        for (const transaction of transactionsInput) {
          const newTransaction = await prisma.transaction.create({
            data: {
              title: transaction.title,
              amount: transaction.amount,
              date: transaction.date,
              category: transaction.category,
              type: transaction.amount < 0 ? 'EXPENSE' : 'INCOME'
            }
          })
          createdTransactions.push(newTransaction)
        }

        // Respond with the array of created transactions
        res.status(201).json(createdTransactions)
      } catch (error) {
        console.error('Failed to create transaction:', error)
        res.status(400).json({ error: 'Failed to create transaction' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
