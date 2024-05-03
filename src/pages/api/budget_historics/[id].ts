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
        const budgetHistoric = await prisma.budgetHistoric.findUnique({
          where: { id: Number(id) },
        });
        if (budgetHistoric) {
          res.status(200).json(budgetHistoric);
        } else {
          res.status(404).json({ message: 'Budget historic not found' });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve budget historic', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const budgetHistoric = await prisma.budgetHistoric.update({
          where: { id: Number(id) },
          data: req.body,
        });
        res.status(200).json(budgetHistoric);
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Budget historic not found' });
        } else {
          res.status(500).json({ message: 'Failed to update budget historic', error: error.message });
        }
      }
      break;

    case 'DELETE':
      try {
        await prisma.budgetHistoric.delete({
          where: { id: Number(id) },
        });
        res.status(204).end();
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Budget historic not found' });
        } else {
          res.status(500).json({ message: 'Failed to delete budget historic', error: error.message });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}