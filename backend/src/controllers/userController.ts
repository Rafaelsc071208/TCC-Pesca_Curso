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