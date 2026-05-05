import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'HEAD', 'POST'].includes(req.method || '')) {
    res.setHeader('Allow', 'GET, HEAD, POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (req.method === 'HEAD') {
    res.status(200).end()
    return
  }

  res.status(200).json({ ok: true })
}
