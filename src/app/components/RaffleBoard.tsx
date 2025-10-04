"use client"

import { useEffect, useState } from "react"

type Props = {
  token: string
}

type NumberItem = {
  number: string
  selected: boolean
  disabled: boolean
}

export default function RaffleBoard({ token }: Props) {
  const [numbers, setNumbers] = useState<NumberItem[]>([])
  const [remaining, setRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // cargar info inicial
  useEffect(() => {
    async function fetchData() {
      // Cargar info del link
      const linkRes = await fetch(`/api/link/${token}`)
      const linkData = await linkRes.json()

      if (!linkData.ok) {
        setLoading(false)
        return
      }

      setRemaining(linkData.link.remaining)

      // Cargar números ya vendidos
      const soldRes = await fetch("/api/sold")
      const soldData = await soldRes.json()
      const soldNumbers = soldData.ok ? new Set(soldData.sold) : new Set()

      // Generar lista de números 000–999
      const nums: NumberItem[] = []
      for (let i = 0; i < 1000; i++) {
        const formatted = i.toString().padStart(3, "0")
        nums.push({
          number: formatted,
          selected: false,
          disabled: soldNumbers.has(formatted),
        })
      }

      setNumbers(nums)
      setLoading(false)
    }
    fetchData()
  }, [token])

  function toggleNumber(n: string) {
    const current = numbers.find((item) => item.number === n)
    if (!current || current.disabled) return

    // Si ya está seleccionado, permitir deseleccionar
    // Si no está seleccionado, solo permitir si hay remaining > 0
    if (!current.selected && remaining <= 0) return

    setNumbers((prev) =>
      prev.map((item) =>
        item.number === n
          ? { ...item, selected: !item.selected }
          : item
      )
    )
    
    // Ajustar remaining: si está seleccionado -> +1, si no está seleccionado -> -1
    setRemaining((r) => current.selected ? r + 1 : r - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    const selected = numbers.filter((n) => n.selected).map((n) => n.number)

    const res = await fetch("/api/claim-numbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, numbers: selected }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (data.ok) {
      setSuccess(true)
      // Mostrar confirmación por 3 segundos antes de redirigir
      setTimeout(() => {
        window.location.href = "/"
      }, 3000)
    } else {
      if (data.error === "numbers_already_sold") {
        alert(`Los siguientes números ya fueron vendidos: ${data.numbers.join(", ")}. Por favor, refresca la página y selecciona otros.`)
        window.location.reload()
      } else {
        alert("Error: " + data.error)
      }
    }
  }

  if (loading) return <p className="text-center mt-10">Cargando...</p>

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          ¡Números registrados con éxito!
        </h2>
        <p className="text-gray-600">
          Redirigiendo en un momento...
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <p className="mb-4 text-lg font-semibold">
        Oportunidades restantes: {remaining}
      </p>

      <div className="flex flex-wrap gap-2">
        {numbers.map((item) => (
          <button
            key={item.number}
            disabled={item.disabled || (!item.selected && remaining <= 0)}
            onClick={() => toggleNumber(item.number)}
            className={`px-3 py-2 rounded-md border text-sm
              ${item.disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : item.selected
                  ? "bg-green-500 text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
          >
            {item.number}
          </button>
        ))}
      </div>

      {remaining === 0 && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {submitting ? "Enviando..." : "Confirmar selección"}
          </button>
        </div>
      )}
    </div>
  )
}
