export async function geocodeAddress(address: string): Promise<{ lat: number, lng: number } | null> {

  if (!address || !address.trim()) return null

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
      { headers: { "User-Agent": "TCC-Pesca-Curso/1.0" } }
    )

    const data = await response.json()

    if (!data || data.length === 0) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    }

  } catch (error) {
    console.error("Erro ao geocodificar endereço:", error)
    return null
  }
}