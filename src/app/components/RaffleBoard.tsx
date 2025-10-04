"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-green-600 mb-2"
        >
          ¡Números registrados con éxito!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600"
        >
          Redirigiendo en un momento...
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex items-center justify-between bg-white shadow-md rounded-lg p-4"
      >
        <p className="text-lg font-semibold text-gray-800">
          Oportunidades restantes:
        </p>
        <motion.span
          key={remaining}
          initial={{ scale: 1.5, color: "#10b981" }}
          animate={{ scale: 1, color: "#1f2937" }}
          className="text-2xl font-bold"
        >
          {remaining}
        </motion.span>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {numbers.map((item, index) => (
            <motion.button
              key={item.number}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.001 }}
              whileHover={
                !item.disabled && (item.selected || remaining > 0)
                  ? { scale: 1.1 }
                  : {}
              }
              whileTap={
                !item.disabled && (item.selected || remaining > 0)
                  ? { scale: 0.95 }
                  : {}
              }
              disabled={item.disabled || (!item.selected && remaining <= 0)}
              onClick={() => toggleNumber(item.number)}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200
                ${
                  item.disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : item.selected
                      ? "bg-green-500 text-white shadow-lg border-green-600"
                      : "bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
                }`}
            >
              {item.number}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {remaining === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg font-semibold text-lg"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.span>
                  Enviando...
                </span>
              ) : (
                "✅ Confirmar selección"
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
