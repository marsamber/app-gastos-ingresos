import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// pages/api/categories/[id].js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method
  } = req

  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid query,"id" must be string' })
    return
  }

  switch (method) {
    case 'GET':
      try {
        const category = await prisma.category.findUnique({
          where: { id }
        })
        if (category) {
          res.status(200).json(category)
        } else {
          res.status(404).json({ message: 'Category not found' })
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve category', error: error.message })
      }
      break

    case 'PUT':
      try {
        const category = await prisma.category.update({
          where: { id },
          data: req.body
        })
        res.status(200).json(category)
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Category not found' })
        } else {
          res.status(500).json({ message: 'Failed to update category', error: error.message })
        }
      }
      break

    case 'DELETE':
      try {
        await prisma.category.delete({
          where: { id }
        })
        res.status(204).end()
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Category not found' })
        } else {
          res.status(500).json({ message: 'Failed to delete category', error: error.message })
        }
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
