import rateLimit from "express-rate-limit"

export const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // no máximo 10 denúncias por IP nesse período
  message: { error: "Muitas denúncias enviadas. Tente novamente mais tarde." }
})

export const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: "Muitas avaliações enviadas. Tente novamente mais tarde." }
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Muitas tentativas de login. Tente novamente mais tarde." }
})