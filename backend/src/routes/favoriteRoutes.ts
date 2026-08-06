import { Router } from "express"
import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
  getFavoriteIds
} from "../controllers/favoriteController"

const router = Router()

router.post("/", addFavorite)
router.delete("/:userId/:courseId", removeFavorite)
router.get("/:userId/ids", getFavoriteIds)
router.get("/:userId", getFavoritesByUser)

export default router