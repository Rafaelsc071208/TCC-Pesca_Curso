import CourseCard from "./CourseCard"

type Props = {
  courses: any[]
}

export default function CourseList({ courses }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      padding: "20px"
    }}>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          category={course.category}
          price={course.price}
        />
      ))}
    </div>
  )
}