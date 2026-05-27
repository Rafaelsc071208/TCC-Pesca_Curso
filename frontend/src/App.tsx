
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CreateCourse from "./pages/CreateCourse"
import Home from "./pages/Home"
import CourseDetails from "./pages/CourseDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App