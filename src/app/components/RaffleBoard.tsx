"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRaffleStore } from "../store/useRaffleStore"

type Props = {
  token: string
}

export default function RaffleBoard({ token }: Props) {
  const [soldNumbers, setSoldNumbers] = useState<number[]>([])
  const [page, setPage] = useState(0) // cada página son 100 números
  const { selectedNumbers, addNumber, remaining } = useRaffleStore()

  // traer números vendidos del backend
  useEffect(() => {
    fetch("/api/sold")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setSoldNumbers(data.sold)
      })
  }, [])

  const numbers = Array.from({ length: 1000 }, (_, i) => i)
  const pageNumbers = numbers.slice(page * 100, (page + 1) * 100)

  async function handleSelect(num: number) {
    if (soldNumbers.includes(num)) return
    if (remaining <= 0) return

    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, number: num }),
    })
    const data = await res.json()

    if (data.ok) {
      addNumber(num)
      setSoldNumbers((prev) => [...prev, num])
    } else {
      alert("Error: " + data.error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Info */}
      <div className="text-center">
        <h2 className="text-xl font-bold">Pick your numbers</h2>
        <p className="text-sm text-gray-600">
          Remaining: {remaining} | Selected: {selectedNumbers.join(", ") || "none"}
        </p>
      </div>

      {/* Números */}
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
        {pageNumbers.map((num) => {
          const disabled = soldNumbers.includes(num)
          const selected = selectedNumbers.includes(num)

          return (
            <motion.button
              key={num}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(num)}
              disabled={disabled || selected}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border 
                ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}
                ${selected ? "bg-green-500 text-white" : "bg-white hover:bg-blue-100"}
              `}
            >
              {num.toString().padStart(3, "0")}
            </motion.button>
          )
        })}
      </div>

      {/* Navegación entre páginas */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page + 1} / 10</span>
        <button
          onClick={() => setPage((p) => Math.min(9, p + 1))}
          disabled={page === 9}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
