import { Router } from "express"

import {
  createCourse,
  getCourses,
  deleteCourse,
  getMyCourses
} from "../controllers/courseController"


const router = Router()

router.post("/create", createCourse)

router.delete("/:id", deleteCourse)
router.get("/", getCourses)
router.get("/my/:userId", getMyCourses)

export default router