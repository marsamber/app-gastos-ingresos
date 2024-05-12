import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// pages/api/budget_historics/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        // Retrieve budget historics from the database
        const { startDate, endDate } = req.query
        const budgetHistorics = await prisma.budgetHistoric.findMany({
          where: {
            date: {
              gte: startDate ? new Date(startDate as string) : undefined,
              lte: endDate ? new Date(endDate as string) : undefined
            }
          }
        })
        res.status(200).json(budgetHistorics)
      } catch (error) {
        console.error('Failed to retrieve budget historics:', error)
        res.status(500).json({ error: 'Failed to retrieve budget historics' })
      }
      break

    case 'POST':
      try {
        // Verify if the request body is an array or a single object
        const budgetHistoricsInput = Array.isArray(req.body) ? req.body : [req.body]

        // Map incoming budget_historics details to the format expected by the Prisma createMany
        const budgetHistoricData = budgetHistoricsInput.map(historic => ({
          amount: historic.amount,
          category: historic.category,
          date: historic.date
        }))

        // Use Prisma's createMany to insert multiple budget_historics
        const newBudgetHistorics = await prisma.budgetHistoric.createMany({
          data: budgetHistoricData
        })

        res.status(201).json(newBudgetHistorics)
      } catch (error) {
        console.error('Failed to create budget historic:', error)
        res.status(400).json({ error: 'Failed to create budget historic' })
      }
      break

    // case delete by category
    case 'DELETE':
      try {
        const { category } = req.body

        // Use Prisma's deleteMany to delete budgets historic by category
        await prisma.budgetHistoric.deleteMany({
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
