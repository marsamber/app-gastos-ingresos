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

        // Use a loop to create each category and collect them
        const createdCategories = []
        for (const category of categoriesInput) {
          const newCategory = await prisma.category.create({
            data: {
              id: category.category,
              deleted: category.deleted
            }
          })
          createdCategories.push(newCategory)
        }

        // Respond with the array of created categories
        res.status(201).json(createdCategories)
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
