import { Router } from "express"
import { createReview, getReviewsByCourse } from "../controllers/reviewController"

const router = Router()
router.post("/", createReview)
router.get("/:courseId", getReviewsByCourse)

export default router