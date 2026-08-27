import fs from "fs"
import path from "path"
import { db } from "../database/database"

// ---------- utilidades de banco ----------

function run(sql: string, params: any[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this.lastID)
    })
  })
}

function get(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

// ---------- utilidades aleatórias ----------

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomTime(): string {
  const startHour = randomInt(6, 20)
  const endHour = Math.min(startHour + randomInt(1, 3), 22)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(startHour)}:00 às ${pad(endHour)}:00`
}

function randomPrice(): number {
  return Number((Math.random() * 300 + 29.9).toFixed(2))
}

// ---------- dados de exemplo ----------

const cities = [
  { name: "São Paulo - SP", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro - RJ", lat: -22.9068, lng: -43.1729 },
  { name: "Belo Horizonte - MG", lat: -19.9167, lng: -43.9345 },
  { name: "Curitiba - PR", lat: -25.4284, lng: -49.2733 },
  { name: "Porto Alegre - RS", lat: -30.0346, lng: -51.2177 },
  { name: "Salvador - BA", lat: -12.9714, lng: -38.5014 },
  { name: "Brasília - DF", lat: -15.7939, lng: -47.8828 },
  { name: "Recife - PE", lat: -8.0476, lng: -34.8770 },
  { name: "Campinas - SP", lat: -22.9099, lng: -47.0626 },
  { name: "Santos - SP", lat: -23.9608, lng: -46.3336 }
]

const subjects = [
  "Matemática para o ENEM", "Redação Nota 1000", "Inglês Básico",
  "Programação Web", "Design Gráfico", "Excel Avançado",
  "Marketing Digital", "Culinária Profissional", "Fotografia",
  "Contabilidade Básica", "Robótica para Iniciantes", "Espanhol Intermediário",
  "Gestão de Projetos", "Eletricista Predial", "Corte e Costura",
  "Libras Básico", "Direito do Consumidor", "Enfermagem Auxiliar",
  "Mecânica Automotiva", "Administração de Empresas"
]

const institutionNames = [
  "Instituto Saber Mais", "Escola Técnica Horizonte", "Colégio Avançar",
  "Centro Educacional Prisma", "Academia do Conhecimento", "Instituto Progresso", "Instituto CPS"
]

const modalities = ["Curso técnico", "Curso livre", "Graduação", "Pós-graduação", "Profissionalizante"]
const paymentTypes = ["Gratuito", "Mensalidade", "Pagamento único", "Bolsa parcial", "Bolsa integral"]
const categories = ["Presencial", "Online", "Misto"]

const positiveComments = [
  "Curso excelente, recomendo muito!",
  "Superou minhas expectativas!",
  "Melhor curso que já fiz na área.",
  "Professor muito atencioso, aprendi bastante.",
  "Didática ótima, valeu cada centavo.",
  "Já indiquei pra vários amigos.",
  ""
]

const neutralComments = [
  "Bom conteúdo, mas poderia ser mais dinâmico.",
  "Conteúdo razoável pelo preço.",
  "Cumpriu o que prometeu, nada excepcional.",
  "Achei ok, mas esperava um pouco mais de prática.",
  ""
]

const negativeComments = [
  "Não gostei muito, esperava mais.",
  "Conteúdo muito básico pro que foi anunciado.",
  "Tive dificuldade de acompanhar o ritmo das aulas.",
  "Não recomendo, achei fraco pelo valor cobrado.",
  ""
]

function commentForRating(rating: number): string {
  if (rating >= 4) return randomFrom(positiveComments)
  if (rating === 3) return randomFrom(neutralComments)
  return randomFrom(negativeComments)
}

const courseReportReasons = [
  "Informação falsa ou enganosa",
  "Conteúdo ofensivo ou impróprio",
  "Possível golpe ou fraude",
  "Curso duplicado",
  "Spam"
]

const reviewReportReasons = [
  "Ofensiva ou discurso de ódio",
  "Spam ou propaganda",
  "Avaliação falsa",
  "Informação pessoal exposta"
]

// ---------- imagens ----------

const UPLOADS_DIR = path.join(__dirname, "../../uploads")

async function downloadRandomImage(seed: string): Promise<string> {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  const response = await fetch(`https://picsum.photos/seed/${seed}/600/400`)
  const buffer = Buffer.from(await response.arrayBuffer())

  const filename = `seed-${seed}.jpg`
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer)

  return `/uploads/${filename}`
}

// ---------- contas ----------

async function ensureUser(username: string, email: string, role: string): Promise<number> {
  const existing = await get(`SELECT id FROM users WHERE email = ?`, [email])
  if (existing) return existing.id

  return run(
    `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
    [username, email, "123456", role]
  )
}

// ---------- principal ----------

async function seed() {
  console.log("Criando contas de teste...")

  const institutionIds: number[] = []
  for (let i = 0; i < institutionNames.length; i++) {
    const id = await ensureUser(
      institutionNames[i],
      `instituicao${i + 1}@teste.com`,
      "institution"
    )
    institutionIds.push(id)
  }

  const studentIds: number[] = []
  for (let i = 1; i <= 10; i++) {
    const id = await ensureUser(`Aluno Teste ${i}`, `aluno${i}@teste.com`, "user")
    studentIds.push(id)
  }

  console.log("Criando cursos e baixando imagens (pode levar alguns minutos)...")

  const courseIds: number[] = []

  for (let i = 0; i < 40; i++) {
    const city = randomFrom(cities)
    const category = randomFrom(categories)
    const institutionId = randomFrom(institutionIds)
    const institutionName = randomFrom(institutionNames)
    const subject = randomFrom(subjects)

    const lat = city.lat + (Math.random() - 0.5) * 0.1
    const lng = city.lng + (Math.random() - 0.5) * 0.1

    const courseId = await run(
      `
      INSERT INTO courses
      (title, description, category, price, link, description_det, endereco,
       institution_name, modality, payment_type, location, period, duration,
       created_by, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        subject,
        `Aprenda tudo sobre ${subject.toLowerCase()} do zero.`,
        category,
        randomPrice(),
        "https://exemplo.com",
        `Descrição completa do curso de ${subject}, com aulas práticas e teóricas, voltado para quem quer se destacar no mercado de trabalho.`,
        category === "Online" ? "" : `Rua Exemplo, ${randomInt(10, 999)} - ${city.name}`,
        institutionName,
        randomFrom(modalities),
        randomFrom(paymentTypes),
        city.name,
        randomTime(),
        `${randomInt(1, 12)} meses`,
        institutionId,
        category === "Online" ? null : lat,
        category === "Online" ? null : lng
      ]
    )

    courseIds.push(courseId)

    // entre 1 e 4 imagens por curso
    const imageCount = randomInt(1, 4)
    for (let img = 0; img < imageCount; img++) {
      try {
        const imageUrl = await downloadRandomImage(`${courseId}-${img}`)
        await run(
          `INSERT INTO course_images (course_id, image_url) VALUES (?, ?)`,
          [courseId, imageUrl]
        )
      } catch (error) {
        console.error(`Não foi possível baixar imagem do curso ${courseId}:`, error)
      }
    }
  }

  console.log("Criando avaliações...")

  const reviewIds: number[] = []

  for (const courseId of courseIds) {
    const reviewCount = randomInt(0, 8)

    for (let i = 0; i < reviewCount; i++) {
      const rating = randomInt(1, 5)

      const reviewId = await run(
        `INSERT INTO reviews (course_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
        [courseId, randomFrom(studentIds), rating, commentForRating(rating)]
      )
      reviewIds.push(reviewId)
    }
  }

  console.log("Criando denúncias...")

  // ~15% dos cursos recebem 1 a 3 denúncias
  for (const courseId of courseIds) {
    if (Math.random() > 0.15) continue

    const reportCount = randomInt(1, 3)
    for (let i = 0; i < reportCount; i++) {
      await run(
        `INSERT INTO reports (target_type, target_id, user_id, reason, description) VALUES (?, ?, ?, ?, ?)`,
        [
          "course",
          courseId,
          randomFrom(studentIds),
          randomFrom(courseReportReasons),
          "Denúncia gerada automaticamente para teste."
        ]
      )
    }
  }

  // ~10% das avaliações recebem 1 denúncia
  for (const reviewId of reviewIds) {
    if (Math.random() > 0.10) continue

    await run(
      `INSERT INTO reports (target_type, target_id, user_id, reason, description) VALUES (?, ?, ?, ?, ?)`,
      [
        "review",
        reviewId,
        randomFrom(studentIds),
        randomFrom(reviewReportReasons),
        "Denúncia gerada automaticamente para teste."
      ]
    )
  }

  console.log(
    `Pronto! ${institutionIds.length} instituições, ${studentIds.length} alunos, ${courseIds.length} cursos, ${reviewIds.length} avaliações criados.`
  )
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})