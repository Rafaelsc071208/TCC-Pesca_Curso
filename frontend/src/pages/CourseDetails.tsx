import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import ImageCarousel from "../components/ImageCarousel"
import StarRating from "../components/StarRating"
import ReportModal from "../components/ReportModal"
import { useToast } from "../context/ToastContext"
import BackButton from "../components/BackButton"

type Review = {
  id: number
  course_id: number
  user_id: number
  rating: number
  comment: string
  created_at: string
  username: string
}

type Course = {
  id: number
  title: string
  description: string
  category: string
  price: number
  link: string
  description_det: string
  endereco: string
  institution_name: string
  modality?: string
  payment_type?: string
  location?: string
  period?: string
  duration?: string
  images?: string[]
  lat?: number
  lng?: number
}

export default function CourseDetails() {

  const { id } = useParams()

  const [course, setCourse] = useState<Course | null>(null)

  const user = JSON.parse(localStorage.getItem("user") || "null")

  const { showToast } = useToast()

  const [reviews, setReviews] = useState<Review[]>([])
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")

  const [reportingCourse, setReportingCourse] = useState(false)
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(null)

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  function fetchReviews() {
    axios
      .get(`http://localhost:3000/reviews/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error(error))
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()

    if (newRating === 0) {
      alert("Selecione uma nota de 1 a 5 estrelas")
      return
    }

    try {
      await axios.post("http://localhost:3000/reviews", {
        course_id: id,
        user_id: user.id,
        rating: newRating,
        comment: newComment
      })

      setNewRating(0)
      setNewComment("")
      fetchReviews()
      showToast("Avaliação enviada")
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar avaliação")
    }
  }

  const getExternalLink = (link: string) => {
    const trimmedLink = link?.trim()

    if (!trimmedLink) return "#"

    return /^https?:\/\//i.test(trimmedLink)
      ? trimmedLink
      : `https://${trimmedLink}`
  }



  // buscar curso
  useEffect(() => {

    axios
      .get("http://localhost:3000/courses")
      .then(response => {

        const foundCourse = response.data.find(
          (course: Course) =>
            course.id === Number(id)
        )

        setCourse(foundCourse)
      })

      .catch(error => {
        console.error(error)
      })

    fetchReviews()

  }, [id])



  // loading
  if (!course) {
    return <h1 className="p-5 text-gray-900 dark:text-gray-100">Carregando...</h1>
  }



  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">

      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full h-[70px] bg-brand-teal flex items-center justify-between px-5 box-border z-[1000]">
        <BackButton />
      </div>

      {/* CONTEÚDO */}
      <div className="flex gap-[30px] p-[30px] pt-[70px] flex-col md:flex-row">

        {/* ESQUERDA */}
        <div className="flex-1 flex flex-col gap-5">

          {/* IMAGEM/PREVIEW */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden">
            <ImageCarousel images={course.images || []} height="400px" />
          </div>

          {/* DESCRIÇÃO DETALHADA */}
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold">
              Sobre o curso
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {course.description_det}
            </p>
          </div>

          {/* MAPA */}
          {course.lat && course.lng && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <iframe
                title="Localização do curso"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${course.lat},${course.lng}&output=embed`}
              />
            </div>
          )}

          {/* AVALIAÇÕES */}
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2.5 mb-4">
              <h2 className="m-0 text-gray-900 dark:text-gray-100 text-xl font-bold">Avaliações</h2>
              {reviews.length > 0 && (
                <>
                  <StarRating rating={Math.round(averageRating)} readOnly size={18} />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {averageRating.toFixed(1)} ({reviews.length} avaliação{reviews.length > 1 ? "ões" : ""})
                  </span>
                </>
              )}
            </div>

            {/* FORMULÁRIO DE NOVA AVALIAÇÃO */}
            {user ? (
              <form
                onSubmit={handleSubmitReview}
                className="flex flex-col gap-2.5 mb-6 pb-5 border-b border-gray-200 dark:border-neutral-700"
              >
                <StarRating rating={newRating} onRate={setNewRating} size={26} />

                <textarea
                  placeholder="Conte como foi sua experiência com esse curso..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="p-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100 font-sans resize-y"
                />

                <button
                  type="submit"
                  className="self-start px-5 py-2.5 border-none rounded-lg bg-brand-teal text-white font-bold cursor-pointer hover:opacity-90"
                >
                  Enviar avaliação
                </button>
              </form>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-5">
                <Link to="/login" className="text-brand-teal font-bold">Faça login</Link> para avaliar este curso.
              </p>
            )}

            {/* LISTA DE AVALIAÇÕES */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Ainda não há avaliações para este curso.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 dark:border-neutral-700 pb-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-gray-900 dark:text-gray-100">{review.username}</strong>
                      <div className="flex items-center gap-2.5">
                        <StarRating rating={review.rating} readOnly size={16} />
                        <button
                          onClick={() => setReportingReviewId(review.id)}
                          title="Denunciar avaliação"
                          className="bg-transparent border-none cursor-pointer text-[13px] text-gray-400"
                        >
                          🚩
                        </button>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-1.5 mb-0 text-gray-600 dark:text-gray-400">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* DIREITA */}
        <div className="w-full md:w-[350px] h-fit bg-brand-dark text-white p-6 rounded-xl flex flex-col gap-5">

          <h1 className="text-2xl font-bold">
            {course.title}
          </h1>

          <button
            onClick={() => setReportingCourse(true)}
            className="self-start bg-transparent border border-white/50 text-white px-3 py-1.5 rounded-lg cursor-pointer text-[13px]"
          >
            🚩 Denunciar curso
          </button>

          <div>
            <strong>Descrição:</strong>
            <p>{course.description}</p>
          </div>

          <div>
            <strong>Categoria:</strong>
            <p>{course.category}</p>
          </div>

          <div>
            <strong>Preço:</strong>
            <p>R$ {course.price}</p>
          </div>

          <div>
            <strong>Endereço:</strong>
            <p>{course.endereco}</p>
          </div>

          <div>
            <strong>Instituição:</strong>
            <p>{course.institution_name}</p>
          </div>

          <div>
            <strong>Modalidade:</strong>
            <p>{course.modality}</p>
          </div>

          <div>
            <strong>Forma de pagamento:</strong>
            <p>{course.payment_type}</p>
          </div>

          <div>
            <strong>Localização:</strong>
            <p>{course.location}</p>
          </div>

          <div>
            <strong>Horário:</strong>
            <p>{course.period || "Não informado"}</p>
          </div>
          
          <div>
            <strong>Duração:</strong>
            <p>{course.duration}</p>
          </div>

          {/* BOTÃO */}
          <a href={getExternalLink(course.link)} target="_blank" rel="noopener noreferrer">
            <button className="w-full p-3.5 border-none rounded-[10px] bg-brand-green text-white cursor-pointer text-base font-bold hover:opacity-90">
              Acessar Curso
            </button>
          </a>

        </div>

      </div>

      {reportingCourse && (
        <ReportModal
          targetType="course"
          targetId={course.id}
          onClose={() => setReportingCourse(false)}
        />
      )}

      {reportingReviewId !== null && (
        <ReportModal
          targetType="review"
          targetId={reportingReviewId}
          onClose={() => setReportingReviewId(null)}
        />
      )}
    </div>
  )
}
