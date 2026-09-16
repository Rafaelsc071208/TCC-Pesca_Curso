import { Router } from "express"
import { getInstitutionProfile, searchInstitutions } from "../controllers/institutionController"

const router = Router()

router.get("/search", searchInstitutions)
router.get("/:id", getInstitutionProfile)

export default router