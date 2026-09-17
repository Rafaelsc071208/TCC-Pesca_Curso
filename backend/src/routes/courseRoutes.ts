import { Router } from "express"
import { upload } from "../middlewares/upload"
import { checkAdmin } from "../middlewares/checkAdmin"
import { createCourse, getCourses, deleteCourse, getMyCourses, updateCourse, getCourseById, trackView, trackClick, getCourseStats, getRatingHistory, getInstitutionStats } from "../controllers/courseController"

const router = Router()

router.post("/create", upload.array("images", 10), createCourse)
router.delete("/:id", checkAdmin, deleteCourse)
router.get("/", getCourses)
router.get("/my/:userId", getMyCourses)
router.get("/:id", getCourseById)
router.put("/:id", updateCourse)
router.post("/:id/view", trackView)
router.post("/:id/click", trackClick)
router.get("/:id/stats", getCourseStats)
router.get("/:id/rating-history", getRatingHistory)
router.get("/stats/institution/:userId", getInstitutionStats)

export default router