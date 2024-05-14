import { NextApiRequest, NextApiResponse } from 'next'

export default function login(req: NextApiRequest, res: NextApiResponse) {
  const { password } = req.body

  const savedPassword = process.env.API_KEY

  if (password === savedPassword) {
    res.status(200).json({ success: true })
  } else {
    res.status(401).json({ success: false })
  }
}
