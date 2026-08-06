import CourseCard from "./CourseCard"

type Course = {
  id: number
  title: string
  category: string
  price: number
  institution_name: string
  modality?: string
  images?: string[]
  rating?: number
  reviewCount?: number
}

type Props = {
  courses: Course[]
  favoriteIds?: number[]
  onToggleFavorite?: (courseId: number) => void
}

export default function CourseList({ courses, favoriteIds, onToggleFavorite }: Props) {
  return (
    <div className="grid gap-5 p-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          id={String(course.id)}
          title={course.title}
          category={course.category}
          price={course.price}
          institution_name={course.institution_name}
          modality={course.modality}
          images={course.images}
          rating={course.rating}
          reviewCount={course.reviewCount}
          isFavorited={favoriteIds?.includes(course.id)}
          onToggleFavorite={
            onToggleFavorite ? () => onToggleFavorite(course.id) : undefined
          }
        />
      ))}
    </div>
  )
}
