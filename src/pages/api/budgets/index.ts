import { ITransaction } from '@/types/index'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/budgets/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        // Retrieve budgets from the database
        const budgets = await prisma.budget.findMany()
        res.status(200).json(budgets)
      } catch (error) {
        console.error('Failed to retrieve budgets:', error)
        res.status(500).json({ error: 'Failed to retrieve budgets' })
      }
      break

    case 'POST':
      try {
        // Extract budgets details from request body
        const { amount, category } = req.body

        // Create a new budgets in the database
        const newBudget = await prisma.budget.create({
          data: {
            amount,
            category
          }
        })

        res.status(201).json(newBudget)
      } catch (error) {
        console.error('Failed to create newBudget:', error)
        res.status(400).json({ error: 'Failed to create newBudget' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
