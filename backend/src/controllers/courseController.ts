import { Request, Response } from "express"
import { db } from "../database/database"



// CRIAR CURSO
export function createCourse(req: Request, res: Response) {

  const {
    title, description, category, link, endereco,
    institution_name, modality, payment_type,
    location, period, duration, price, description_det, created_by
  } = req.body

  const files = req.files as Express.Multer.File[] | undefined

  db.run(
    `
    INSERT INTO courses
    (title, description, category, price, link, description_det, endereco,
     institution_name, modality, payment_type, location, period, duration, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [title, description, category, price, link, description_det, endereco,
     institution_name, modality, payment_type, location, period, duration, created_by],

    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      const courseId = this.lastID

      if (!files || files.length === 0) {
        return res.status(201).json({ message: "Curso criado", courseId })
      }

      const stmt = db.prepare(
        `INSERT INTO course_images (course_id, image_url) VALUES (?, ?)`
      )

      files.forEach(file => {
        stmt.run(courseId, `/uploads/${file.filename}`)
      })

      stmt.finalize(() => {
        return res.status(201).json({ message: "Curso criado", courseId })
      })
    }
  )
}

// trazer imagens + média de avaliações
function attachExtras(rows: any[], res: Response) {
  if (rows.length === 0) return res.json([])

  const ids = rows.map(r => r.id)
  const placeholders = ids.map(() => "?").join(",")

  db.all(
    `SELECT * FROM course_images WHERE course_id IN (${placeholders})`,
    ids,
    (err, images: any[]) => {
      if (err) return res.status(500).json({ error: err.message })

      db.all(
        `
        SELECT course_id, AVG(rating) as avgRating, COUNT(*) as reviewCount
        FROM reviews
        WHERE course_id IN (${placeholders})
        GROUP BY course_id
        `,
        ids,
        (err2, ratings: any[]) => {
          if (err2) return res.status(500).json({ error: err2.message })

          const withExtras = rows.map(course => {
            const ratingInfo = ratings.find(r => r.course_id === course.id)

            return {
              ...course,
              images: images
                .filter(img => img.course_id === course.id)
                .map(img => img.image_url),
              rating: ratingInfo ? ratingInfo.avgRating : 0,
              reviewCount: ratingInfo ? ratingInfo.reviewCount : 0
            }
          })

          return res.json(withExtras)
        }
      )
    }
  )
}

// LISTAR CURSOS
export function getCourses(req: Request, res: Response) {
  const search = req.query.search || ""

  db.all(
    `SELECT * FROM courses WHERE title LIKE ?`,
    [`%${search}%`],
    (err, rows: any[]) => {
      if (err) return res.status(500).json({ error: err.message })
      attachExtras(rows, res)
    }
  )
}

// LISTAR MEUS CURSOS
export function getMyCourses(req: Request, res: Response) {
  const { userId } = req.params

  db.all(
    `SELECT * FROM courses WHERE created_by = ?`,
    [userId],
    (err, rows: any[]) => {
      if (err) return res.status(500).json({ error: err.message })
      attachExtras(rows, res)
    }
  )
}

// DELETAR CURSO
export function deleteCourse(req: Request, res: Response) {

  const { id } = req.params

  db.run(
    `
    DELETE FROM courses
    WHERE id = ?
    `,
    [id],

    db.run(`DELETE FROM reports WHERE target_type = 'course' AND target_id = ?`, [id]),

    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        })
      }

      return res.json({
        message: "Curso deletado"
      })
    }
  )
}