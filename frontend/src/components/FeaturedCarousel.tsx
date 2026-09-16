import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = "http://localhost:3000"
const SLIDE_DURATION = 5000

type Course = {
  id: number
  title: string
  institution_name: string
  price: number
  images?: string[]
}

type Props = {
  courses: Course[]
}

export default function FeaturedCarousel({ courses }: Props) {
  const [index, setIndex] = useState(0)
  const [hovering, setHovering] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (courses.length <= 1 || hovering) return

    const timer = setTimeout(() => {
      setIndex(i => (i === courses.length - 1 ? 0 : i + 1))
    }, SLIDE_DURATION)

    return () => clearTimeout(timer)
  }, [index, hovering, courses.length])

  if (courses.length === 0) return null

  const current = courses[index]
  const image = current.images?.[0]

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate(`/course/${current.id}`)}
      className="relative w-full h-[260px] md:h-[340px] rounded-2xl overflow-hidden cursor-pointer mb-6 bg-gray-300 dark:bg-neutral-800"
    >
      {image ? (
        <img
          src={`${API_URL}${image}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-brand-teal" />
      )}

      {/* degradê pra texto ficar legível */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-6 left-6 right-6 text-white">
        <span className="inline-block bg-brand-green px-3 py-1 rounded-full text-xs font-bold mb-2">
          EM DESTAQUE
        </span>
        <h2 className="text-xl md:text-3xl font-bold">{current.title}</h2>
        <p className="text-sm md:text-base opacity-90">{current.institution_name} • R$ {Number(current.price).toFixed(2)}/mês</p>
      </div>

      {/* barras de progresso animadas */}
      <div className="absolute top-4 left-4 right-4 flex gap-1.5">
        {courses.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            {i < index && <div className="h-full w-full bg-white" />}
            {i === index && (
              <div
                key={`${i}-${index}-${hovering}`}
                className="h-full bg-white"
                style={{
                  width: hovering ? "100%" : "0%",
                  transition: hovering ? "none" : `width ${SLIDE_DURATION}ms linear`
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}