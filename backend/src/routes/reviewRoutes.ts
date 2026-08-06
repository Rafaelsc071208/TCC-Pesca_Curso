import { Router } from "express"
import { checkAdmin } from "../middlewares/checkAdmin"
import { createReview, getReviewsByCourse, getReviewsByUser, deleteReview } from "../controllers/reviewController"

const router = Router()
router.post("/", createReview)
router.get("/user/:userId", getReviewsByUser)
router.get("/:courseId", getReviewsByCourse)
router.delete("/:id", checkAdmin, deleteReview)

export default router