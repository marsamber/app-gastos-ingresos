import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

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
        // Verify if the request body is an array or a single object
        const budgetsInput = Array.isArray(req.body) ? req.body : [req.body]

        // Use a loop to create each budget and collect them
        const createdBudgets = []
        for (const budget of budgetsInput) {
          const newBudget = await prisma.budget.create({
            data: {
              amount: budget.amount,
              category: budget.category
            }
          })
          createdBudgets.push(newBudget)
        }

        // Respond with the array of created budgets
        res.status(201).json(createdBudgets)
      } catch (error) {
        console.error('Failed to create newBudget:', error)
        res.status(400).json({ error: 'Failed to create newBudget' })
      }
      break

    // case delete by category
    case 'DELETE':
      try {
        const { category } = req.body

        // Use Prisma's deleteMany to delete budgets by category
        await prisma.budget.deleteMany({
          where: {
            category
          }
        })

        res.status(204).end()
      } catch (error) {
        console.error('Failed to delete budgets:', error)
        res.status(400).json({ error: 'Failed to delete budgets' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
