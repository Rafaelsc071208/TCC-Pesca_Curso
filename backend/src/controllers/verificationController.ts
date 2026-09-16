import { Request, Response } from "express"
import { db } from "../database/database"

// INSTITUIÇÃO PEDE VERIFICAÇÃO
export function requestVerification(req: Request, res: Response) {
  const { user_id } = req.body
  const file = req.file as any

  if (!file) {
    return res.status(400).json({ error: "Envie um documento" })
  }

  db.run(
    `INSERT INTO verification_requests (user_id, document_url) VALUES (?, ?)`,
    [user_id, `/uploads/${file.filename}`],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      return res.status(201).json({ message: "Solicitação enviada" })
    }
  )
}

// STATUS DA ÚLTIMA SOLICITAÇÃO DE UM USUÁRIO
export function getMyVerificationStatus(req: Request, res: Response) {
  const { userId } = req.params

  db.get(
    `SELECT * FROM verification_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(row || null)
    }
  )
}

// ADMIN: LISTAR PENDENTES
export function getPendingVerifications(req: Request, res: Response) {
  db.all(
    `
    SELECT verification_requests.*, users.username, users.email
    FROM verification_requests
    JOIN users ON users.id = verification_requests.user_id
    WHERE status = 'pending'
    ORDER BY created_at ASC
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows)
    }
  )
}

// ADMIN: APROVAR
export function approveVerification(req: Request, res: Response) {
  const { id } = req.params

  db.get(`SELECT user_id FROM verification_requests WHERE id = ?`, [id], (err, request: any) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!request) return res.status(404).json({ error: "Solicitação não encontrada" })

    db.run(`UPDATE verification_requests SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP WHERE id = ?`, [id])
    db.run(`UPDATE users SET is_verified = 1 WHERE id = ?`, [request.user_id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message })
      return res.json({ message: "Instituição verificada" })
    })
  })
}

// ADMIN: REJEITAR
export function rejectVerification(req: Request, res: Response) {
  const { id } = req.params

  db.run(
    `UPDATE verification_requests SET status = 'rejected', reviewed_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json({ message: "Solicitação rejeitada" })
    }
  )
}