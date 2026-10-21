import { db } from "../database/database"

db.serialize(() => {

  db.run(`
    UPDATE courses
    SET modality = CASE WHEN category = 'Misto' THEN 'Híbrido' ELSE category END
    WHERE category IS NOT NULL AND category != ''
  `)

  db.run(`
    UPDATE courses
    SET category = NULL
    WHERE category IN ('Curso técnico', 'Curso livre', 'Graduação', 'Pós-graduação', 'Profissionalizante')
  `)

  console.log("Categoria e modalidade migradas. Cursos antigos ficaram sem categoria definida — edite-os para escolher a categoria certa.")
})