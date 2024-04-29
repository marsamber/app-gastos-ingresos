import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/categories/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        // Retrieve categories from the database
        const categories = await prisma.category.findMany()
        res.status(200).json(categories.map(category => category.id))
      } catch (error) {
        console.error('Failed to retrieve categories:', error)
        res.status(500).json({ error: 'Failed to retrieve categories' })
      }
      break

    case 'POST':
      try {
        // Extract category details from request body
        const { category, deleted } = req.body

        // Create a new category in the database
        const newCategory = await prisma.category.create({
          data: {
            id: category,
            deleted
          }
        })

        res.status(201).json(newCategory)
      } catch (error) {
        console.error('Failed to create category:', error)
        res.status(400).json({ error: 'Failed to create category' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
