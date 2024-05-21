import prisma from '@/lib/prisma'
import { parseIntSafe } from '@/utils/utils'
import { NextApiRequest, NextApiResponse } from 'next'

// pages/api/budgets/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { page, limit, sortBy, sortOrder } = req.query

        const parsedPage = parseIntSafe(page as string)
        const parsedLimit = parseIntSafe(limit as string)

        const paginationOptions = {
          skip: parsedPage && parsedLimit ? (parsedPage - 1) * parsedLimit : undefined,
          take: parsedLimit,
          orderBy: sortBy
            ? {
                [sortBy as string]: sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : 'asc' // Default to ascending if sortOrder is incorrect
              }
            : undefined
        }

        // Fetching the total number of monthly transactions
        const totalItems = await prisma.budget.count()

        // Fetching monthly transactions with pagination and sorting options
        const budgets = await prisma.budget.findMany({
          ...paginationOptions
        })

        res.status(200).json({ totalItems, budgets })
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
