
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CreateCourse from "./pages/CreateCourse"
import Home from "./pages/Home"
import CourseDetails from "./pages/CourseDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import InstitutionDashboard from "./pages/InstitutionDashboard"
import AdminPanel from "./pages/AdminPanel"
import Profile from "./pages/Profile"
import Favorites from "./pages/Favorites"
import MyReviews from "./pages/MyReviews"
import ForgotPassword from "./pages/ForgotPassword"
import RequestVerification from "./pages/RequestVerification"
import InstitutionProfile from "./pages/InstitutionProfile"
import EditCourse from "./pages/EditCourse"
import InstitutionStats from "./pages/InstitutionStats"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/institution/:id" element={<InstitutionProfile />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/institution" element={<InstitutionDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<RequestVerification />} />
        <Route path="/stats" element={<InstitutionStats />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App