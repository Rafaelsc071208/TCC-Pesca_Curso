import { db } from "./database"

db.serialize(() => {

  // usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0,
      role TEXT DEFAULT 'user'
    )
  `)

  // cursos
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Presencial',
      price REAL NOT NULL,
      link TEXT,
      description_det TEXT NOT NULL,
      endereco TEXT,
      institution_name TEXT,
      modality TEXT,
      payment_type TEXT,
      location TEXT,
      period TEXT,
      duration TEXT,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `)

  // colunas do código de verificação em duas etapas
  db.run(`ALTER TABLE users ADD COLUMN two_factor_code TEXT`, (err) => {
    if (err && !err.message.includes("duplicate column name")) console.error(err)
  })

  db.run(`ALTER TABLE users ADD COLUMN two_factor_expires TEXT`, (err) => {
    if (err && !err.message.includes("duplicate column name")) console.error(err)
  })

  // imagens do curso
  db.run(`
    CREATE TABLE IF NOT EXISTS course_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `)

  // avaliações
  db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

  // coluna de foto de perfil (migração segura — ignora erro se já existir)
  db.run(`ALTER TABLE users ADD COLUMN photo_url TEXT`, (err) => {
    if (err && !err.message.includes("duplicate column name")) {
      console.error(err)
    }
  })

  // favoritos
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      UNIQUE(user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `)

  // denúncias (cursos e avaliações)
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_type TEXT NOT NULL CHECK (target_type IN ('course', 'review')),
      target_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  // coordenadas geográficas do curso (preenchidas automaticamente a partir do endereço)
  db.run(`ALTER TABLE courses ADD COLUMN lat REAL`, (err) => {
    if (err && !err.message.includes("duplicate column name")) console.error(err)
  })

  db.run(`ALTER TABLE courses ADD COLUMN lng REAL`, (err) => {
    if (err && !err.message.includes("duplicate column name")) console.error(err)
  })
})