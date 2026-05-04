import { courses } from "../data/courses"
import CourseCard from "./CourseCard"

export default function CourseList() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      padding: "80px 20px 20px",
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