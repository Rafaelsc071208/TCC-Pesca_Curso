import { Router } from "express"
import { upload } from "../middlewares/upload"
import { checkAdmin } from "../middlewares/checkAdmin"
import {
  requestVerification,
  getMyVerificationStatus,
  getPendingVerifications,
  approveVerification,
  rejectVerification
} from "../controllers/verificationController"

const router = Router()

router.post("/", upload.single("document"), requestVerification)
router.get("/mine/:userId", getMyVerificationStatus)
router.get("/pending", checkAdmin, getPendingVerifications)
router.post("/:id/approve", checkAdmin, approveVerification)
router.post("/:id/reject", checkAdmin, rejectVerification)

export default router