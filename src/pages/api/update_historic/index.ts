import { ITransaction } from '@/types/index'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

// pages/api/update_historic/index.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers['authorization']
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false })
  }

  try {
    const budgets = await prisma.budget.findMany()
    var d = new Date()
    d.setDate(d.getDate() - 1)
    const budgetHistorics = budgets.map(({ id, ...budget }) => ({ ...budget, date: d }))
    await prisma.budgetHistoric.createMany({
      data: budgetHistorics
    })

    const monthlyTransactions = await prisma.monthlyTransaction.findMany()
    const transactionHistorics = monthlyTransactions.map(({ id, ...monthlyTransaction }) => ({
      ...monthlyTransaction,
      date: d
    }))
    await prisma.transaction.createMany({
      data: transactionHistorics
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Failed to retrieve budgets:', error)
    res.status(500).json({ error: 'Failed to retrieve budgets' })
  }
}
