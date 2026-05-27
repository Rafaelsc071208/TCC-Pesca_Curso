import { Router } from "express"

import {
  createCourse,
  getCourses,
  deleteCourse
} from "../controllers/courseController"


const router = Router()

router.post("/create", createCourse)

router.delete("/:id", deleteCourse)
router.get("/", getCourses)

export default router