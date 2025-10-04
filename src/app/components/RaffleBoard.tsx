"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from "./ThemeToggle"

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
  const [currentPage, setCurrentPage] = useState(0)
  
  const numbersPerPage = 100
  const totalPages = Math.ceil(numbers.length / numbersPerPage)
  const currentNumbers = numbers.slice(
    currentPage * numbersPerPage,
    (currentPage + 1) * numbersPerPage
  )

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
          className="w-16 h-16 border-4 border-purple-500 dark:border-pink-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (success) {
    const selectedNumbers = numbers.filter(n => n.selected)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] p-8"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-3 text-center"
        >
          ¡Números registrados con éxito!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600 dark:text-gray-300 mb-6 text-center"
        >
          Tus números de la suerte han sido guardados
        </motion.p>

        {/* Selected Numbers Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-2 justify-center mb-8 max-w-md"
        >
          {selectedNumbers.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-bold shadow-lg"
            >
              {item.number}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          Redirigiendo automáticamente...
        </motion.div>
      </motion.div>
    )
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4 md:p-6 max-w-7xl mx-auto"
    >
      {/* Header with Theme Toggle */}
      <div className="flex items-center justify-between mb-12 gap-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl px-10 py-6 border border-gray-200 dark:border-gray-700 min-w-[200px]"
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Oportunidades restantes
            </p>
            <motion.span
              key={remaining}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              {remaining}
            </motion.span>
          </div>
        </motion.div>
        <ThemeToggle />
      </div>

      {/* Carousel Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 md:p-12 border border-gray-200 dark:border-gray-700 my-8"
      >
        {/* Page Indicator */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Números {currentPage * numbersPerPage} - {Math.min((currentPage + 1) * numbersPerPage - 1, 999)}
          </h3>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 w-8"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Numbers Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-2.5 mb-8"
          >
            {currentNumbers.map((item) => (
              <motion.button
                key={item.number}
                whileHover={
                  !item.disabled && (item.selected || remaining > 0)
                    ? { scale: 1.1, rotate: 5 }
                    : {}
                }
                whileTap={
                  !item.disabled && (item.selected || remaining > 0)
                    ? { scale: 0.95 }
                    : {}
                }
                disabled={item.disabled || (!item.selected && remaining <= 0)}
                onClick={() => toggleNumber(item.number)}
                className={`
                  aspect-square rounded-xl font-semibold text-xs md:text-sm
                  transition-all duration-300 shadow-md relative overflow-hidden
                  ${
                    item.disabled
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                      : item.selected
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/50 dark:shadow-pink-500/50 scale-105"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 hover:from-blue-100 hover:to-purple-100 dark:hover:from-purple-900 dark:hover:to-pink-900"
                  }
                `}
              >
                {item.disabled && (
                  <svg
                    className="absolute top-1 right-1 w-3 h-3 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.number}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mt-8">
          <motion.button
            onClick={prevPage}
            disabled={currentPage === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300
              ${
                currentPage === 0
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
              }
            `}
          >
            ← Anterior
          </motion.button>

          <motion.button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300
              ${
                currentPage === totalPages - 1
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
              }
            `}
          >
            Siguiente →
          </motion.button>
        </div>
      </motion.div>

      {/* Confirm Button */}
      <AnimatePresence>
        {remaining === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-10 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-16 py-5 rounded-2xl disabled:opacity-50 shadow-2xl font-bold text-xl hover:shadow-green-500/50 transition-all duration-300"
            >
              {submitting ? (
                <span className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.span>
                  Procesando...
                </span>
              ) : (
                "✅ Confirmar Selección"
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
