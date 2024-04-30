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
        // Verify if the request body is an array or a single object
        const categoriesInput = Array.isArray(req.body) ? req.body : [req.body]

        // Map incoming category details to the format expected by the Prisma createMany
        const categoryData = categoriesInput.map(cat => ({
          id: cat.category,
          deleted: cat.deleted
        }))

        // Use Prisma's createMany to insert multiple categories
        const newCategories = await prisma.category.createMany({
          data: categoryData,
          skipDuplicates: true // Optional: skips entries that would cause duplicate ID errors
        })

        res.status(201).json(newCategories)
      } catch (error) {
        console.error('Failed to create categories:', error)
        res.status(400).json({ error: 'Failed to create categories' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
