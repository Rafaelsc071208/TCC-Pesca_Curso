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


  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    try {

      await axios.post(
        "http://localhost:3000/courses/create",
        {
          title,
          description,

          institution_name: institutionName,

          modality,

          payment_type: paymentType,

          location,

          period,

          duration,

          price: Number(price),

          description_det: descriptionDet,

          created_by: user.id
        }
      )

      alert("Curso criado!")

      // limpar campos
      setTitle("")
      setDescription("")
      setCategory("")
      setPrice("")
      setLink("")
      setDescriptionDet("")
      setEndereco("")

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