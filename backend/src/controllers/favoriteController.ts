import { Request, Response } from "express"
import { db } from "../database/database"

export function addFavorite(req: Request, res: Response) {
  const { user_id, course_id } = req.body

  db.get(`SELECT role FROM users WHERE id = ?`, [user_id], (err, requester: any) => {
    if (err) return res.status(500).json({ error: err.message })

    if (!requester || requester.role !== "user") {
      return res.status(403).json({ error: "Apenas alunos podem favoritar cursos" })
    }

    db.run(
      `INSERT OR IGNORE INTO favorites (user_id, course_id) VALUES (?, ?)`,
      [user_id, course_id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message })
        return res.status(201).json({ message: "Curso favoritado" })
      }
    )
  })
}

export function removeFavorite(req: Request, res: Response) {
  const { userId, courseId } = req.params

  db.run(
    `DELETE FROM favorites WHERE user_id = ? AND course_id = ?`,
    [userId, courseId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      return res.json({ message: "Curso removido dos favoritos" })
    }
  )
}

// lista de IDs favoritados (usada pra pintar o coração nos cards)
export function getFavoriteIds(req: Request, res: Response) {
  const { userId } = req.params

  db.all(
    `SELECT course_id FROM favorites WHERE user_id = ?`,
    [userId],
    (err, rows: any[]) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows.map(r => r.course_id))
    }
  )
}

// cursos favoritados completos (usada na página de Favoritos)
export function getFavoritesByUser(req: Request, res: Response) {
  const { userId } = req.params

  db.all(
    `SELECT courses.* FROM favorites
     JOIN courses ON courses.id = favorites.course_id
     WHERE favorites.user_id = ?`,
    [userId],
    (err, rows: any[]) => {
      if (err) return res.status(500).json({ error: err.message })
      if (rows.length === 0) return res.json([])

      const ids = rows.map(r => r.id)
      const placeholders = ids.map(() => "?").join(",")

      db.all(
        `SELECT * FROM course_images WHERE course_id IN (${placeholders})`,
        ids,
        (err2, images: any[]) => {
          if (err2) return res.status(500).json({ error: err2.message })

          const withImages = rows.map(course => ({
            ...course,
            images: images.filter(img => img.course_id === course.id).map(img => img.image_url)
          }))

          return res.json(withImages)
        }
      )
    }
  )
}