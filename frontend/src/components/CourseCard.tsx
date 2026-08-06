import { Link } from "react-router-dom"
import axios from "axios"
import ImageCarousel from "./ImageCarousel"
import StarRating from "./StarRating"

type Props = {
  id: string
  title: string
  institution_name: string
  modality?: string
  price: number
  images?: string[]
  category: string
  rating?: number
  reviewCount?: number
  isFavorited?: boolean
  onToggleFavorite?: () => void
}

export default function CourseCard({
  id,
  title,
  category,
  price,
  institution_name,
  modality,
  images,
  rating,
  reviewCount,
  isFavorited,
  onToggleFavorite
}: Props) {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  async function handleDelete() {
    try {
      await axios.delete(
        `http://localhost:3000/courses/${id}?requesterId=${user.id}`
      )
      alert("Curso deletado")
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("Você não tem permissão para deletar este curso")
    }
  }

  return (
    <div className="bg-gray-200 dark:bg-neutral-800 p-0.5 rounded-[10px] text-center">
      <h3 className="text-gray-900 dark:text-gray-100 font-semibold my-1">{title}</h3>

      <div className="bg-white dark:bg-neutral-900 p-2.5 rounded-[10px] text-left">
        <ImageCarousel images={images || []} height="180px" />

        <h3 className="text-gray-900 dark:text-gray-100 font-semibold mt-2 mb-0.5">
          {institution_name}
        </h3>

        {modality && (
          <p className="text-gray-500 dark:text-gray-400 text-sm my-0.5">{modality}</p>
        )}

        <div className="flex items-center gap-1.5 my-1">
          <StarRating rating={Math.round(rating || 0)} readOnly size={14} />
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            ({reviewCount || 0})
          </span>
        </div>

        <p className="text-gray-500 dark:text-gray-400">{category}</p>

        <p className="text-gray-700 dark:text-gray-300 font-medium">
          R$ {price.toFixed(2)}/mês
        </p>

        <Link to={`/course/${id}`}>
          <button className="mt-2.5 px-3 py-2 rounded-md bg-brand-teal text-white cursor-pointer hover:opacity-90">
            Ver mais
          </button>
        </Link>

        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="mt-2.5 ml-2 px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-transparent cursor-pointer text-base"
          >
            {isFavorited ? "❤️" : "🤍"}
          </button>
        )}

        {user?.isAdmin === 1 && (
          <button
            onClick={handleDelete}
            className="mt-2.5 ml-2 px-3 py-2 rounded-md bg-red-600 text-white cursor-pointer hover:bg-red-700"
          >
            Deletar
          </button>
        )}
      </div>
    </div>
  )
}
