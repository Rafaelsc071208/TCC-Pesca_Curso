import { useState } from "react"
import axios from "axios"

import Header from "../components/Header"

export default function CreateCourse() {

  const [search, setSearch] = useState("")

  const [title, setTitle] = useState("")

  const [institutionName, setInstitutionName] = useState("")
  const [modality, setModality] = useState("")
  const [paymentType, setPaymentType] = useState("")
  const [location, setLocation] = useState("")
  const [period, setPeriod] = useState("")
  const [duration, setDuration] = useState("")

  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [link, setLink] = useState("")
  const [descriptionDet, setDescriptionDet] = useState("")
  const [endereco, setEndereco] = useState("")

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  )

  const [images, setImages] = useState<File[]>([])

function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files || [])

  if (files.length > 10) {
    alert("Você pode enviar no máximo 10 imagens")
    return
  }

  setImages(files)
}


  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  try {
    const formData = new FormData()

    formData.append("title", title)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("link", link)
    formData.append("endereco", endereco)
    formData.append("institution_name", institutionName)
    formData.append("modality", modality)
    formData.append("payment_type", paymentType)
    formData.append("location", location)
    formData.append("period", period)
    formData.append("duration", duration)
    formData.append("price", price)
    formData.append("description_det", descriptionDet)
    formData.append("created_by", String(user.id))

    images.forEach(file => formData.append("images", file))

    await axios.post(
      "http://localhost:3000/courses/create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )

    alert("Curso criado!")
    // ... limpar campos como antes, e adicionar setImages([])
  } catch (error) {
    console.error(error)
    alert("Erro ao criar curso")
  }
}



  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5"
      }}
    >

      {/* HEADER */}
      <Header
        search={search}
        setSearch={setSearch}
      />



      {/* CONTEÚDO */}
      <div
        style={{
          paddingTop: "120px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        
        <form
          onSubmit={handleSubmit}
          style={{
            width: "500px",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <h1
            style={{
              color: "#2e7d5a"
            }}
          >
            Criar Curso
          </h1>



          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />



          <input
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />



          <input
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />



          <input
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />



          <input
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />



          <textarea
            placeholder="Descrição detalhada"
            value={descriptionDet}
            onChange={(e) => setDescriptionDet(e.target.value)}
            rows={5}
          />



          <input
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />


          <label>Imagens do curso (máximo 10)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />

          {images.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {images.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                />
              ))}
            </div>
          )}

          {
            user.role === "institution" && (
              <button
                type="submit"
                style={{
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#56c596",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Criar Curso
              </button>
            )
          }

        </form>

      </div>

    </div>
  )
}