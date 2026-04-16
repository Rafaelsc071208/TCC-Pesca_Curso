import { courses } from "../data/courses"

export default function CourseList() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      padding: "80px 20px 20px",
     
    }}>
      {courses.map(course => (
        <div key={course.id} style={{
          background: "#bdbdbd",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <h3>{course.title}</h3>
          <p>{course.category}</p>
        </div>
      ))}
    </div>
  )
}