import { Request, Response } from "express"
import { db } from "../database/database"

export function getInstitutionProfile(req: Request, res: Response) {
  const { id } = req.params

  db.get(
    `SELECT id, username, email, is_verified FROM users WHERE id = ? AND role = 'institution'`,
    [id],
    (err, institution: any) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!institution) return res.status(404).json({ error: "Instituição não encontrada" })

      db.all(
        `SELECT * FROM courses WHERE created_by = ?`,
        [id],
        (err2, courses: any[]) => {
          if (err2) return res.status(500).json({ error: err2.message })

          if (courses.length === 0) {
            return res.json({ ...institution, courses: [], averageRating: 0 })
          }

          const courseIds = courses.map(c => c.id)
          const placeholders = courseIds.map(() => "?").join(",")

          db.get(
            `SELECT AVG(rating) as avg FROM reviews WHERE course_id IN (${placeholders})`,
            courseIds,
            (err3, ratingRow: any) => {
              if (err3) return res.status(500).json({ error: err3.message })

              return res.json({
                ...institution,
                courses,
                averageRating: ratingRow?.avg || 0
              })
            }
          )
        }
      )
    }
  )
}

export function searchInstitutions(req: Request, res: Response) {
  const search = req.query.search || ""

  db.all(
    `SELECT id, username, is_verified FROM users WHERE role = 'institution' AND username LIKE ?`,
    [`%${search}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows)
    }
  )
}