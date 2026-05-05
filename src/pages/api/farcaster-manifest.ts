import type { NextApiRequest, NextApiResponse } from 'next'

import { getMiniAppManifest } from '@app/utils/miniapp'

const getRequestOrigin = (req: NextApiRequest) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || 'https'

  if (!host) return undefined
  return `${protocol}://${Array.isArray(host) ? host[0] : host}`
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  res.status(200).json(getMiniAppManifest(getRequestOrigin(req)))
}
