import { ITransaction } from '@/types/index'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/budget_historics/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        // Retrieve budget historics from the database
        const budgetHistorics = await prisma.budgetHistoric.findMany()
        res.status(200).json(budgetHistorics)
      } catch (error) {
        console.error('Failed to retrieve budget historics:', error)
        res.status(500).json({ error: 'Failed to retrieve budget historics' })
      }
      break

    case 'POST':
      try {
        // Extract budget_historics details from request body
        const { amount, category, date } = req.body

        // Create a new budget_historics in the database
        const newBudgetHistoric = await prisma.budgetHistoric.create({
          data: {
            amount,
            category,
            date: new Date(date)
          }
        })

        res.status(201).json(newBudgetHistoric)
      } catch (error) {
        console.error('Failed to create budget historic:', error)
        res.status(400).json({ error: 'Failed to create budget historic' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
