import { Router } from "express"
import { registerUser, loginUser, deleteUser, getUsers, updateUser, changePassword, verifyTwoFactor } from "../controllers/userController"
import { checkAdmin } from "../middlewares/checkAdmin"
import { upload } from "../middlewares/upload"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/verify-2fa", verifyTwoFactor)
router.get("/", checkAdmin, getUsers)
router.delete("/:id", checkAdmin, deleteUser)
router.put("/:id", upload.single("photo"), updateUser)
router.put("/:id/password", changePassword)

export default router