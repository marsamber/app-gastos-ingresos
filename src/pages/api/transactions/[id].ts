import { ITransaction } from '@/types/index'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/transactions/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const transaction: ITransaction | null = await prisma.transaction.findUnique({
          where: { id: Number(id) },
        });
        if (transaction) {
          res.status(200).json(transaction);
        } else {
          res.status(404).json({ message: 'Transaction not found' });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve transaction', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const transaction = await prisma.transaction.update({
          where: { id: Number(id) },
          data: 
          {
            title: req.body.title,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            type: req.body.amount < 0 ? 'EXPENSE' : 'INCOME',
          },
        });
        res.status(200).json(transaction);
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Transaction not found' });
        } else {
          res.status(500).json({ message: 'Failed to update transaction', error: error.message });
        }
      }
      break;

    case 'DELETE':
      try {
        await prisma.transaction.delete({
          where: { id: Number(id) },
        });
        res.status(204).end();
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ message: 'Transaction not found' });
        } else {
          res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}