import { Router } from "express"
import { checkAdmin } from "../middlewares/checkAdmin"
import { createReview, getReviewsByCourse, getReviewsByUser, deleteReview } from "../controllers/reviewController"
import { reviewLimiter } from "../middlewares/rateLimit"

const router = Router()
router.post("/", createReview)
router.get("/user/:userId", getReviewsByUser)
router.get("/:courseId", getReviewsByCourse)
router.delete("/:id", checkAdmin, deleteReview)
router.post("/", reviewLimiter, createReview)

export default router