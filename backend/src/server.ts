import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import courseRoutes from "./routes/courseRoutes"
import reviewRoutes from "./routes/reviewRoutes"   
import "./database/init"
import path from "path"
import favoriteRoutes from "./routes/favoriteRoutes"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/favorites", favoriteRoutes)
app.use("/users", userRoutes)
app.use("/courses", courseRoutes)
app.use("/reviews", reviewRoutes)

app.get("/", (req, res) => {
  res.send("API rodando")
})

app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.listen(3000, () => {
  console.log("Servidor rodando")
})