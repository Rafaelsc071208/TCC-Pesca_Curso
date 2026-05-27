import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import "./database/init"
import courseRoutes from "./routes/courseRoutes"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/users", userRoutes)
app.use("/courses", courseRoutes)

app.get("/", (req, res) => {
  res.send("API rodando")
})

app.listen(3000, () => {
  console.log("Servidor rodando")
})