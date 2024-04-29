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
        const transactions: ITransaction[] = await prisma.transaction.findMany()
        res.status(200).json(transactions)
      } catch (error) {
        console.error('Failed to retrieve transactions:', error)
        res.status(500).json({ error: 'Failed to retrieve transactions' })
      }
      break

    case 'POST':
      try {
        // Extract transaction details from request body
        const { title, amount, date, category } = req.body

        // Create a new transaction in the database
        const newTransaction = await prisma.transaction.create({
          data: {
            title,
            amount,
            date: new Date(date),
            category,
            type: amount < 0 ? 'EXPENSE' : 'INCOME'
          }
        })

        res.status(201).json(newTransaction)
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
