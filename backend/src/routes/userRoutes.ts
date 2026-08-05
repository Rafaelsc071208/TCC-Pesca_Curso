import { Router } from "express"
import { registerUser, loginUser, deleteUser, getUsers } from "../controllers/userController"
import { checkAdmin } from "../middlewares/checkAdmin"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/", checkAdmin, getUsers)
router.delete("/:id", checkAdmin, deleteUser)

export default router