import { ITransaction } from '@/types/index'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/monthly_transactions/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const monthlyTransaction = await prisma.monthlyTransaction.findUnique({
          where: { id: Number(id) },
        });
        if (monthlyTransaction) {
          res.status(200).json(monthlyTransaction);
        } else {
          res.status(404).json({ message: 'Monthly transaction not found' });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve monthly transaction', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const monthlyTransaction = await prisma.monthlyTransaction.update({
          where: { id: Number(id) },
          data: req.body,
        });
        res.status(200).json(monthlyTransaction);
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Monthly transaction not found' });
        } else {
          res.status(500).json({ message: 'Failed to update monthly transaction', error: error.message });
        }
      }
      break;

    case 'DELETE':
      try {
        await prisma.monthlyTransaction.delete({
          where: { id: Number(id) },
        });
        res.status(204).end();
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Monthly transaction not found' });
        } else {
          res.status(500).json({ message: 'Failed to delete monthly transaction', error: error.message });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}