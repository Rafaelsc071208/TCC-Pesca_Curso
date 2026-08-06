import { Router } from "express"
import { createReview, getReviewsByCourse, getReviewsByUser } from "../controllers/reviewController"

const router = Router()
router.post("/", createReview)
router.get("/user/:userId", getReviewsByUser)
router.get("/:courseId", getReviewsByCourse)

export default router