import { Router } from "express"
import { upload } from "../middlewares/upload"
import { createCourse, getCourses, deleteCourse, getMyCourses } from "../controllers/courseController"

const router = Router()

router.post("/create", upload.array("images", 10), createCourse)
router.delete("/:id", checkAdmin, deleteCourse)
router.get("/", getCourses)
router.get("/my/:userId", getMyCourses)

export default router