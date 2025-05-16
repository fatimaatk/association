import { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { parse } from 'cookie'

declare module "next" {
  interface NextApiRequest {
    user?: string | JwtPayload;
  }
}
type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export function withAuth(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies.token

    if (!token) return res.status(401).json({ message: 'Non authentifié' })

    try {
      const payload = jwt.verify(token, JWT_SECRET)
      req.user = payload
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error, message: 'Token invalide' })
    }
  }
}

