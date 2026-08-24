import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import StarRating from "../components/StarRating"
import BackButton from "../components/BackButton"

type Review = {
  id: number
  course_id: number
  course_title: string
  rating: number
  comment: string
  created_at: string
}

export default function MyReviews() {
  const [search, setSearch] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    axios
      .get(`http://localhost:3000/reviews/user/${user.id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error(error))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
      <div className="pt-[90px] px-5 pb-10 max-w-[700px]">
        <div className="fixed top-0 left-0 w-full h-[70px] bg-brand-teal flex items-center justify-between px-5 box-border z-[1000]">
        <BackButton />
      </div>
        <h1 className="text-gray-900 dark:text-gray-100 text-2xl font-bold">Minhas avaliações</h1>

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Você ainda não avaliou nenhum curso.</p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {reviews.map(review => (
              <div
                key={review.id}
                className="bg-white dark:bg-neutral-800 p-4 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="flex justify-between items-center">
                  <Link
                    to={`/course/${review.course_id}`}
                    className="font-bold text-brand-teal no-underline"
                  >
                    {review.course_title}
                  </Link>
                  <StarRating rating={review.rating} readOnly size={16} />
                </div>
                {review.comment && (
                  <p className="mt-2 mb-0 text-gray-700 dark:text-gray-300">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
