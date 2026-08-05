import { Request, Response, NextFunction } from "express"
import { db } from "../database/database"

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  const requesterId = req.body.requesterId || req.query.requesterId

  if (!requesterId) {
    return res.status(401).json({ error: "Usuário não informado" })
  }

  db.get(
    `SELECT isAdmin FROM users WHERE id = ?`,
    [requesterId],
    (err, row: any) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!row || row.isAdmin !== 1) {
        return res.status(403).json({ error: "Acesso negado: apenas administradores" })
      }
      next()
    }
  )
}