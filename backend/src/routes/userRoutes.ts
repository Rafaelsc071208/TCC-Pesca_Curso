import { Router } from "express"
import { registerUser, loginUser, deleteUser, getUsers, updateUser, changePassword, verifyTwoFactor } from "../controllers/userController"
import { checkAdmin } from "../middlewares/checkAdmin"
import { upload } from "../middlewares/upload"
import { loginLimiter } from "../middlewares/rateLimit"
import { forgotPassword, resetPassword } from "../controllers/userController"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/verify-2fa", verifyTwoFactor)
router.post("/login", loginLimiter, loginUser)
router.get("/", checkAdmin, getUsers)
router.delete("/:id", checkAdmin, deleteUser)
router.put("/:id", upload.single("photo"), updateUser)
router.put("/:id/password", changePassword)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router