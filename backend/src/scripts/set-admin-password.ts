import bcrypt from "bcrypt"
import { db } from "../database/database"

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error("Defina ADMIN_EMAIL e ADMIN_PASSWORD como variáveis de ambiente antes de rodar este script.")
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  db.get(`SELECT id FROM users WHERE email = ?`, [email], (err, user: any) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    if (user) {
      // conta já existe: só atualiza a senha (já em hash) e marca como admin
      db.run(
        `UPDATE users SET password = ?, isAdmin = 1 WHERE id = ?`,
        [hashedPassword, user.id],
        (updateErr) => {
          if (updateErr) {
            console.error(updateErr)
            process.exit(1)
          }
          console.log(`Conta ${email} atualizada e marcada como administradora.`)
          process.exit(0)
        }
      )
    } else {
      // conta não existe: cria uma nova, já com hash e isAdmin = 1
      db.run(
        `INSERT INTO users (username, email, password, isAdmin, role) VALUES (?, ?, ?, 1, 'institution')`,
        ["Administrador", email, hashedPassword],
        (insertErr) => {
          if (insertErr) {
            console.error(insertErr)
            process.exit(1)
          }
          console.log(`Conta administradora ${email} criada com sucesso.`)
          process.exit(0)
        }
      )
    }
  })
}

main()