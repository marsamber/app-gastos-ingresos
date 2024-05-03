import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// pages/api/budgets/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const budget = await prisma.budget.findUnique({
          where: { id: Number(id) },
        });
        if (budget) {
          res.status(200).json(budget);
        } else {
          res.status(404).json({ message: 'Budget not found' });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve budget', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const budget = await prisma.budget.update({
          where: { id: Number(id) },
          data: req.body,
        });
        res.status(200).json(budget);
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Budget not found' });
        } else {
          res.status(500).json({ message: 'Failed to update budget', error: error.message });
        }
      }
      break;

    case 'DELETE':
      try {
        await prisma.budget.delete({
          where: { id: Number(id) },
        });
        res.status(204).end();
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Budget not found' });
        } else {
          res.status(500).json({ message: 'Failed to delete budget', error: error.message });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}