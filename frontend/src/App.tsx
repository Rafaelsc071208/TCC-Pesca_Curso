
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import CourseDetails from "./pages/CourseDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App