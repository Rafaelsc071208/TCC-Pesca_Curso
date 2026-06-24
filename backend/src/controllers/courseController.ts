import { Request, Response } from "express"
import { db } from "../database/database"



// CRIAR CURSO
export function createCourse(req: Request, res: Response) {

  const {
    title,
    description,
    institution_name,
    modality,
    payment_type,
    location,
    period,
    duration,
    price,
    description_det,
    created_by
  } = req.body

  db.run(
    `
    INSERT INTO courses
    (
      title,
      description,
      price,
      description_det,
      institution_name,
      modality,
      payment_type,
      location,
      period,
      duration,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      description,
      price,
      description_det,
      institution_name,
      modality,
      payment_type,
      location,
      period,
      duration,
      created_by
    ],

    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        })
      }

      return res.status(201).json({
        message: "Curso criado",
        courseId: this.lastID
      })
    }
  )
}



// LISTAR CURSOS
export function getCourses(
  req: Request,
  res: Response
) {

  const search = req.query.search || ""

  db.all(
    `
    SELECT *
    FROM courses
    WHERE title LIKE ?
    `,
    [`%${search}%`],

    (err, rows) => {

      if(err){
        return res.status(500).json({
          error: err.message
        })
      }

      return res.json(rows)
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

export function getMyCourses(
  req: Request,
  res: Response
){

  const { userId } = req.params

  db.all(
    `
    SELECT *
    FROM courses
    WHERE created_by = ?
    `,
    [userId],

    (err, rows) => {

      if(err){
        return res.status(500).json({
          error: err.message
        })
      }

      return res.json(rows)
    }
  )
}