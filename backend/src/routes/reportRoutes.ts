import { Router } from "express"
import { checkAdmin } from "../middlewares/checkAdmin"
import { reportLimiter } from "../middlewares/rateLimit"
import {
  createReport,
  getCourseReports,
  getReviewReports,
  dismissReport
} from "../controllers/reportController"

const router = Router()

router.post("/", reportLimiter, createReport)
router.post("/", createReport)
router.get("/courses", checkAdmin, getCourseReports)
router.get("/reviews", checkAdmin, getReviewReports)
router.delete("/:id", checkAdmin, dismissReport)

export default router