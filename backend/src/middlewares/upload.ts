import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"))
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueName + path.extname(file.originalname))
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB por imagem
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
    ok ? cb(null, true) : cb(new Error("Formato de imagem não suportado"))
  }
})