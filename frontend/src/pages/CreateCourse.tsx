import { useState } from "react"
import axios from "axios"
import FormField, { fieldClass } from "../components/FormField"
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
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">

      {/* HEADER */}
      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => {}}
      />

      {/* CONTEÚDO */}
      <div className="pt-[110px] pb-[50px] flex justify-center">

        <form
          onSubmit={handleSubmit}
          className="w-[700px] max-w-[90%] bg-white dark:bg-neutral-800 p-[35px] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] flex flex-col gap-7"
        >
          <div>
            <h1 className="text-brand-dark text-2xl font-bold m-0">Criar Curso</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 mb-0">
              Preencha as informações abaixo para publicar seu curso na plataforma.
            </p>
          </div>

          {/* SEÇÃO: INFORMAÇÕES BÁSICAS */}
          <div className="flex flex-col gap-4">
            <h3 className="m-0 pb-2 border-b-2 border-gray-100 dark:border-neutral-700 text-gray-900 dark:text-gray-100 text-lg font-bold">
              Informações básicas
            </h3>

            <FormField label="Título do curso">
              <input
                className={fieldClass}
                placeholder="Ex: Curso de Matemática para o ENEM"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormField>

            <FormField label="Descrição curta">
              <input
                className={fieldClass}
                placeholder="Uma frase resumindo o curso"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <FormField label="Descrição detalhada">
              <textarea
                className={`${fieldClass} resize-y`}
                placeholder="Explique o conteúdo, metodologia, para quem é indicado, etc."
                value={descriptionDet}
                onChange={(e) => setDescriptionDet(e.target.value)}
                rows={5}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Categoria">
                <select
                  className={fieldClass}
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
                  className={fieldClass}
                  placeholder="Ex: 99.90"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* SEÇÃO: INSTITUIÇÃO E MODALIDADE */}
          <div className="flex flex-col gap-4">
            <h3 className="m-0 pb-2 border-b-2 border-gray-100 dark:border-neutral-700 text-gray-900 dark:text-gray-100 text-lg font-bold">
              Instituição e modalidade
            </h3>

            <FormField label="Nome da instituição">
              <input
                className={fieldClass}
                placeholder="Ex: Escola Técnica Exemplo"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Modalidade">
                <input
                  className={fieldClass}
                  placeholder="Ex: Curso técnico"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                />
              </FormField>

              <FormField label="Forma de pagamento">
                <input
                  className={fieldClass}
                  placeholder="Ex: Mensal, à vista"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Período">
                <input
                  className={fieldClass}
                  placeholder="Ex: Manhã, noite"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </FormField>

              <FormField label="Duração">
                <input
                  className={fieldClass}
                  placeholder="Ex: 6 meses"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Localização">
              <input
                className={fieldClass}
                placeholder="Ex: Bairro, cidade"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormField>

            <FormField label="Endereço completo (se presencial)">
              <input
                className={fieldClass}
                placeholder="Rua, número, cidade - estado"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </FormField>
          </div>

          {/* SEÇÃO: LINK E IMAGENS */}
          <div className="flex flex-col gap-4">
            <h3 className="m-0 pb-2 border-b-2 border-gray-100 dark:border-neutral-700 text-gray-900 dark:text-gray-100 text-lg font-bold">
              Link e imagens
            </h3>

            <FormField label="Link externo do curso">
              <input
                className={fieldClass}
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </FormField>

            <FormField label={`Imagens do curso (${images.length}/10)`}>
              <label
                htmlFor="course-images"
                className="flex items-center justify-center p-6 border-2 border-dashed border-brand-green rounded-[10px] text-brand-dark cursor-pointer font-bold bg-emerald-50 dark:bg-neutral-700"
              >
                Clique para escolher até 10 imagens
              </label>
              <input
                id="course-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />

              {images.length > 0 && (
                <div className="flex gap-2.5 flex-wrap mt-2.5">
                  {images.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      className="w-[70px] h-[70px] object-cover rounded-lg border border-gray-200 dark:border-neutral-600"
                    />
                  ))}
                </div>
              )}
            </FormField>
          </div>

          {user.role === "institution" && (
            <button
              type="submit"
              className="p-4 border-none rounded-[10px] bg-brand-green text-white text-[17px] font-bold cursor-pointer hover:opacity-90"
            >
              Publicar Curso
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
