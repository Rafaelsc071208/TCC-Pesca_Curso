import CourseCard from "./CourseCard"

type Course = {
  id: number
  title: string
  category: string
  price: number
}

type Props = {
  courses: Course[]
}

export default function CourseList({ courses }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "20px",
      padding: "20px"
    }}>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          id={String(course.id)}
          title={course.title}
          category={course.category}
          price={course.price}
        />
      ))}
    </div>
  )
}