import { Request, Response } from "express"
import { db } from "../database/database"

export function createReview(req: Request, res: Response) {
  const { course_id, user_id, rating, comment } = req.body

  db.run(
    `INSERT INTO reviews (course_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
    [course_id, user_id, rating, comment],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      return res.status(201).json({ message: "Avaliação enviada", reviewId: this.lastID })
    }
  )
}

export function getReviewsByCourse(req: Request, res: Response) {
  const { courseId } = req.params

  db.all(
    `SELECT reviews.*, users.username FROM reviews
     JOIN users ON users.id = reviews.user_id
     WHERE course_id = ? ORDER BY created_at DESC`,
    [courseId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows)
    }
  )
}

export function getReviewsByUser(req: Request, res: Response) {
  const { userId } = req.params

  db.all(
    `SELECT reviews.*, courses.title as course_title FROM reviews
     JOIN courses ON courses.id = reviews.course_id
     WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.json(rows)
    }
  )
}

// DELETAR AVALIAÇÃO (admin)
export function deleteReview(req: Request, res: Response) {
  const { id } = req.params

  db.run(`DELETE FROM reviews WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message })

    db.run(`DELETE FROM reports WHERE target_type = 'review' AND target_id = ?`, [id])

    return res.json({ message: "Avaliação deletada" })
  })
}