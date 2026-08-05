import { Request, Response } from "express"
import { db } from "../database/database"

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

    (err, user) => {

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

      return res.json({
        message: "Login realizado",
        user
      })
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
    `SELECT id, username, email, isAdmin, role FROM users`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows)
    }
  )
}