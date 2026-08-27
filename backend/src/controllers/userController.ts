import { Request, Response } from "express"
import { db } from "../database/database"
import { sendTwoFactorEmail } from "../utils/mailer"

export function registerUser(req: Request, res: Response) {
    
    console.log(req.body)

  const { username, email, password, role } = req.body

  db.run(
    `
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
    `,
    [username, email, password, role],

    function (err) {

      if (err) {

  console.log(err)

  return res.status(500).json({
    error: err.message
  })

      }

      return res.status(201).json({
        message: "Usuário criado",
        userId: this.lastID
      })
    }
  )
}
export function loginUser(req: Request, res: Response) {

  const { email, password } = req.body

  db.get(
    `
    SELECT * FROM users
    WHERE email = ? AND password = ?
    `,
    [email, password],

    async (err, user: any) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        })
      }

      if (!user) {
        return res.status(401).json({
          message: "Email ou senha inválidos"
        })
      }

      // admin pula a verificação em duas etapas e já entra direto
      if (user.isAdmin === 1) {
        return res.json({
          message: "Login realizado",
          user
        })
      }

      // gera código de 6 dígitos, válido por 10 minutos
      const code = String(Math.floor(100000 + Math.random() * 900000))
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

      db.run(
        `UPDATE users SET two_factor_code = ?, two_factor_expires = ? WHERE id = ?`,
        [code, expires, user.id],
        async (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message })
          }

          try {
            await sendTwoFactorEmail(user.email, code)
          } catch (mailError) {
            console.error("Erro ao enviar email de 2FA:", mailError)
            return res.status(500).json({ error: "Não foi possível enviar o código por email" })
          }

          return res.json({
            message: "Código enviado por email",
            requiresTwoFactor: true,
            userId: user.id
          })
        }
      )
    }
  )
}

// VERIFICAR CÓDIGO DE DUAS ETAPAS
export function verifyTwoFactor(req: Request, res: Response) {

  const { userId, code } = req.body

  db.get(
    `SELECT * FROM users WHERE id = ?`,
    [userId],

    (err, user: any) => {

      if (err) return res.status(500).json({ error: err.message })

      if (!user || user.two_factor_code !== code) {
        return res.status(401).json({ message: "Código inválido" })
      }

      if (!user.two_factor_expires || new Date(user.two_factor_expires) < new Date()) {
        return res.status(401).json({ message: "Código expirado, faça login novamente" })
      }

      // código usado, limpa pra não poder ser reaproveitado
      db.run(
        `UPDATE users SET two_factor_code = NULL, two_factor_expires = NULL WHERE id = ?`,
        [user.id],
        (clearErr) => {
          if (clearErr) return res.status(500).json({ error: clearErr.message })

          delete user.two_factor_code
          delete user.two_factor_expires

          return res.json({
            message: "Login realizado",
            user
          })
        }
      )
    }
  )
}
export function deleteUser(req: Request, res: Response) {
  const { id } = req.params

  db.run(
    `DELETE FROM users WHERE id = ?`,
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      return res.json({ message: "Usuário deletado" })
    }
  )
}

export function getUsers(req: Request, res: Response) {
  db.all(
    `
    SELECT
      users.id, users.username, users.email, users.isAdmin, users.role,
      COALESCE(course_reports.cnt, 0) + COALESCE(review_reports.cnt, 0) as total_reports
    FROM users
    LEFT JOIN (
      SELECT courses.created_by as user_id, COUNT(reports.id) as cnt
      FROM reports
      JOIN courses ON courses.id = reports.target_id
      WHERE reports.target_type = 'course'
      GROUP BY courses.created_by
    ) course_reports ON course_reports.user_id = users.id
    LEFT JOIN (
      SELECT reviews.user_id as user_id, COUNT(reports.id) as cnt
      FROM reports
      JOIN reviews ON reviews.id = reports.target_id
      WHERE reports.target_type = 'review'
      GROUP BY reviews.user_id
    ) review_reports ON review_reports.user_id = users.id
    ORDER BY total_reports DESC
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows)
    }
  )
}

// ATUALIZAR PERFIL
export function updateUser(req: Request, res: Response) {
  const { id } = req.params
  const { username, email } = req.body
  const file = req.file as any

  const fields: string[] = []
  const values: any[] = []

  if (username) { fields.push("username = ?"); values.push(username) }
  if (email) { fields.push("email = ?"); values.push(email) }
  if (file) { fields.push("photo_url = ?"); values.push(`/uploads/${file.filename}`) }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Nada para atualizar" })
  }

  values.push(id)

  db.run(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err.message })

      db.get(
        `SELECT id, username, email, isAdmin, role, photo_url FROM users WHERE id = ?`,
        [id],
        (err2, row) => {
          if (err2) return res.status(500).json({ error: err2.message })
          return res.json({ message: "Perfil atualizado", user: row })
        }
      )
    }
  )
}

// TROCAR SENHA
export function changePassword(req: Request, res: Response) {
  const { id } = req.params
  const { currentPassword, newPassword } = req.body

  db.get(
    `SELECT password FROM users WHERE id = ?`,
    [id],
    (err, row: any) => {
      if (err) return res.status(500).json({ error: err.message })

      if (!row || row.password !== currentPassword) {
        return res.status(401).json({ error: "Senha atual incorreta" })
      }

      db.run(
        `UPDATE users SET password = ? WHERE id = ?`,
        [newPassword, id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message })
          return res.json({ message: "Senha alterada" })
        }
      )
    }
  )
}