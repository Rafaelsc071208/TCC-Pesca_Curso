import { Request, Response } from "express"
import { db } from "../database/database"

// CRIAR DENÚNCIA
export function createReport(req: Request, res: Response) {
  const { target_type, target_id, user_id, reason, description } = req.body

  if (target_type !== "course" && target_type !== "review") {
    return res.status(400).json({ error: "Tipo de denúncia inválido" })
  }

  db.run(
    `INSERT INTO reports (target_type, target_id, user_id, reason, description) VALUES (?, ?, ?, ?, ?)`,
    [target_type, target_id, user_id, reason, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      return res.status(201).json({ message: "Denúncia enviada" })
    }
  )
}

// CURSOS DENUNCIADOS, ORDENADOS POR QUANTIDADE DE DENÚNCIAS
export function getCourseReports(req: Request, res: Response) {
  db.all(
    `
    SELECT courses.id as course_id, courses.title, COUNT(reports.id) as report_count
    FROM reports
    JOIN courses ON courses.id = reports.target_id
    WHERE reports.target_type = 'course'
    GROUP BY courses.id
    ORDER BY report_count DESC
    `,
    [],
    (err, courseRows: any[]) => {
      if (err) return res.status(500).json({ error: err.message })
      if (courseRows.length === 0) return res.json([])

      db.all(
        `SELECT reports.*, users.username FROM reports
         JOIN users ON users.id = reports.user_id
         WHERE target_type = 'course'
         ORDER BY created_at DESC`,
        [],
        (err2, allReports: any[]) => {
          if (err2) return res.status(500).json({ error: err2.message })

          const withReports = courseRows.map(course => ({
            ...course,
            reports: allReports.filter(r => r.target_id === course.course_id)
          }))

          return res.json(withReports)
        }
      )
    }
  )
}

// AVALIAÇÕES DENUNCIADAS, ORDENADAS POR QUANTIDADE DE DENÚNCIAS
export function getReviewReports(req: Request, res: Response) {
  db.all(
    `
    SELECT reviews.id as review_id, reviews.comment, reviews.rating,
           courses.title as course_title, COUNT(reports.id) as report_count
    FROM reports
    JOIN reviews ON reviews.id = reports.target_id
    JOIN courses ON courses.id = reviews.course_id
    WHERE reports.target_type = 'review'
    GROUP BY reviews.id
    ORDER BY report_count DESC
    `,
    [],
    (err, reviewRows: any[]) => {
      if (err) return res.status(500).json({ error: err.message })
      if (reviewRows.length === 0) return res.json([])

      db.all(
        `SELECT reports.*, users.username FROM reports
         JOIN users ON users.id = reports.user_id
         WHERE target_type = 'review'
         ORDER BY created_at DESC`,
        [],
        (err2, allReports: any[]) => {
          if (err2) return res.status(500).json({ error: err2.message })

          const withReports = reviewRows.map(review => ({
            ...review,
            reports: allReports.filter(r => r.target_id === review.review_id)
          }))

          return res.json(withReports)
        }
      )
    }
  )
}

// DESCARTAR UMA DENÚNCIA (sem apagar o curso/avaliação)
export function dismissReport(req: Request, res: Response) {
  const { id } = req.params

  db.run(`DELETE FROM reports WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    return res.json({ message: "Denúncia descartada" })
  })
}