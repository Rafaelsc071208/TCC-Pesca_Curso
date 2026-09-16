import { Request, Response } from "express"
import { db } from "../database/database"
import { geocodeAddress } from "../utils/geocode"



// CRIAR CURSO
export async function createCourse(req: Request, res: Response) {

  const {
    title, description, category, link, endereco,
    institution_name, modality, payment_type,
    location, period, duration, price, description_det, created_by
  } = req.body

  const files = req.files as Express.Multer.File[] | undefined

  const coords = await geocodeAddress(endereco)

  db.run(
    `
    INSERT INTO courses
    (title, description, category, price, link, description_det, endereco,
     institution_name, modality, payment_type, location, period, duration, created_by, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [title, description, category, price, link, description_det, endereco,
     institution_name, modality, payment_type, location, period, duration, created_by,
     coords?.lat ?? null, coords?.lng ?? null],

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

  const creatorIds = [...new Set(rows.map(r => r.created_by))]
  const creatorPlaceholders = creatorIds.map(() => "?").join(",")

  db.all(
    `SELECT id, is_verified FROM users WHERE id IN (${creatorPlaceholders})`,
    creatorIds,
    (errCreators, creators: any[]) => {
      if (errCreators) return res.status(500).json({ error: errCreators.message })

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
                const creator = creators.find(c => c.id === course.created_by)

                return {
                  ...course,
                  images: images.filter(img => img.course_id === course.id).map(img => img.image_url),
                  rating: ratingInfo ? ratingInfo.avgRating : 0,
                  reviewCount: ratingInfo ? ratingInfo.reviewCount : 0,
                  institution_verified: creator ? creator.is_verified === 1 : false
                }
              })

              return res.json(withExtras)
            }
          )
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
    `DELETE FROM courses WHERE id = ?`,
    [id],

    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        })
      }

      // limpa denúncias associadas a esse curso, já que ele não existe mais
      db.run(`DELETE FROM reports WHERE target_type = 'course' AND target_id = ?`, [id])

      return res.json({
        message: "Curso deletado"
      })
    }
  )
}

export function updateCourse(req: Request, res: Response) {
  const { id } = req.params
  const { requesterId, ...fields } = req.body

  db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, course: any) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!course) return res.status(404).json({ error: "Curso não encontrado" })

    db.get(`SELECT isAdmin FROM users WHERE id = ?`, [requesterId], (err2, requester: any) => {
      if (err2) return res.status(500).json({ error: err2.message })

      const isOwner = course.created_by === Number(requesterId)
      const isAdminUser = requester?.isAdmin === 1

      if (!isOwner && !isAdminUser) {
        return res.status(403).json({ error: "Você não pode editar este curso" })
      }

      // guarda o estado anterior antes de sobrescrever
      db.run(
        `INSERT INTO course_edit_history (course_id, edited_by, previous_data) VALUES (?, ?, ?)`,
        [id, requesterId, JSON.stringify(course)]
      )

      const allowedFields = [
        "title", "description", "category", "price", "link", "description_det",
        "endereco", "institution_name", "modality", "payment_type", "location",
        "period", "duration"
      ]

      const updates = allowedFields.filter(f => fields[f] !== undefined)
      const setClause = updates.map(f => `${f} = ?`).join(", ")
      const values = updates.map(f => fields[f])

      db.run(
        `UPDATE courses SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id],
        (updateErr) => {
          if (updateErr) return res.status(500).json({ error: updateErr.message })
          return res.json({ message: "Curso atualizado" })
        }
      )
    })
  })
}