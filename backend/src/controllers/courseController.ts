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

//trazer imagens
function attachImages(rows: any[], res: Response) {
  if (rows.length === 0) return res.json([])

  const ids = rows.map(r => r.id)
  const placeholders = ids.map(() => "?").join(",")

  db.all(
    `SELECT * FROM course_images WHERE course_id IN (${placeholders})`,
    ids,
    (err, images: any[]) => {
      if (err) return res.status(500).json({ error: err.message })

      const withImages = rows.map(course => ({
        ...course,
        images: images
          .filter(img => img.course_id === course.id)
          .map(img => img.image_url)
      }))

      return res.json(withImages)
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
      attachImages(rows, res)
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
      attachImages(rows, res)
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