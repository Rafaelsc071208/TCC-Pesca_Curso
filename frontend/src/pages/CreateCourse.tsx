import { useState } from "react"
import axios from "axios"
import FormField, { fieldStyle } from "../components/FormField"
import { useNavigate } from "react-router-dom"

import Header from "../components/Header"

export default function CreateCourse() {

  const navigate = useNavigate()

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

  const confirmed = window.confirm(
    "Tem certeza que deseja publicar esse curso?"
  )
  if (!confirmed) return

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

    navigate("/")
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
        onOpenFilters={() => {}}
      />

      {/* CONTEÚDO */}
      <div
        style={{
          paddingTop: "110px",
          paddingBottom: "50px",
          display: "flex",
          justifyContent: "center"
        }}
      >

        <form
          onSubmit={handleSubmit}
          style={{
            width: "700px",
            maxWidth: "90%",
            background: "white",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "28px"
          }}
        >
          <div>
            <h1 style={{ color: "#2e7d5a", margin: 0 }}>Criar Curso</h1>
            <p style={{ color: "#888", margin: "6px 0 0" }}>
              Preencha as informações abaixo para publicar seu curso na plataforma.
            </p>
          </div>

          {/* SEÇÃO: INFORMAÇÕES BÁSICAS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ margin: 0, borderBottom: "2px solid #f0f0f0", paddingBottom: "8px" }}>
              Informações básicas
            </h3>

            <FormField label="Título do curso">
              <input
                style={fieldStyle}
                placeholder="Ex: Curso de Matemática para o ENEM"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormField>

            <FormField label="Descrição curta">
              <input
                style={fieldStyle}
                placeholder="Uma frase resumindo o curso"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <FormField label="Descrição detalhada">
              <textarea
                style={{ ...fieldStyle, resize: "vertical" }}
                placeholder="Explique o conteúdo, metodologia, para quem é indicado, etc."
                value={descriptionDet}
                onChange={(e) => setDescriptionDet(e.target.value)}
                rows={5}
              />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Categoria">
                <select
                  style={fieldStyle}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Misto">Misto</option>
                </select>
              </FormField>

              <FormField label="Preço mensal (R$)">
                <input
                  style={fieldStyle}
                  placeholder="Ex: 99.90"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* SEÇÃO: INSTITUIÇÃO E MODALIDADE */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ margin: 0, borderBottom: "2px solid #f0f0f0", paddingBottom: "8px" }}>
              Instituição e modalidade
            </h3>

            <FormField label="Nome da instituição">
              <input
                style={fieldStyle}
                placeholder="Ex: Escola Técnica Exemplo"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
              />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Modalidade">
                <input
                  style={fieldStyle}
                  placeholder="Ex: Curso técnico"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                />
              </FormField>

              <FormField label="Forma de pagamento">
                <input
                  style={fieldStyle}
                  placeholder="Ex: Mensal, à vista"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
              </FormField>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Período">
                <input
                  style={fieldStyle}
                  placeholder="Ex: Manhã, noite"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </FormField>

              <FormField label="Duração">
                <input
                  style={fieldStyle}
                  placeholder="Ex: 6 meses"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Localização">
              <input
                style={fieldStyle}
                placeholder="Ex: Bairro, cidade"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormField>

            <FormField label="Endereço completo (se presencial)">
              <input
                style={fieldStyle}
                placeholder="Rua, número, cidade - estado"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </FormField>
          </div>

          {/* SEÇÃO: LINK E IMAGENS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ margin: 0, borderBottom: "2px solid #f0f0f0", paddingBottom: "8px" }}>
              Link e imagens
            </h3>

            <FormField label="Link externo do curso">
              <input
                style={fieldStyle}
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </FormField>

            <FormField label={`Imagens do curso (${images.length}/10)`}>
              <label
                htmlFor="course-images"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  border: "2px dashed #56c596",
                  borderRadius: "10px",
                  color: "#2e7d5a",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background: "#f5fbf9"
                }}
              >
                Clique para escolher até 10 imagens
              </label>
              <input
                id="course-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                style={{ display: "none" }}
              />

              {images.length > 0 && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {images.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }}
                    />
                  ))}
                </div>
              )}
            </FormField>
          </div>

          {user.role === "institution" && (
            <button
              type="submit"
              style={{
                padding: "16px",
                border: "none",
                borderRadius: "10px",
                background: "#56c596",
                color: "white",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Publicar Curso
            </button>
          )}
        </form>
      </div>
    </div>
  )
}