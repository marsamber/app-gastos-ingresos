import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// pages/api/monthly_transactions/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        // Retrieve monthlyTransactions from the database
        const monthlyTransactions = await prisma.monthlyTransaction.findMany()
        res.status(200).json(monthlyTransactions)
      } catch (error) {
        console.error('Failed to retrieve monthly_transactions:', error)
        res.status(500).json({ error: 'Failed to retrieve monthly_transactions' })
      }
      break

    case 'POST':
      try {
        // Extract monthly transaction details from request body
        const { title, amount, category } = req.body

        // Create a new monthly transaction in the database
        const newMonthlyTransaction = await prisma.monthlyTransaction.create({
          data: {
            amount,
            title,
            category,
            type: amount < 0 ? 'EXPENSE' : 'INCOME'
          }
        })

        res.status(201).json(newMonthlyTransaction)
      } catch (error) {
        console.error('Failed to create monthly transaction:', error)
        res.status(400).json({ error: 'Failed to create monthly transaction' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
