"use client"

import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"
import BuyerForm from "@/components/BuyerForm"
import RaffleBoard from "@/components/RaffleBoard"

export default function TokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [step, setStep] = useState<"loading" | "form" | "raffle" | "invalid" | "expired">("loading")

  useEffect(() => {
    fetch(`/api/link/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          if (!data.link.buyer_name) {
            setStep("form")
          } else {
            setStep("raffle")
          }
        } else {
          if (data.error === "link_expired") {
            setStep("expired")
          } else {
            setStep("invalid")
          }
        }
      })
      .catch(() => setStep("invalid"))
  }, [token])

  if (step === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (step === "invalid") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Link Inválido
          </h2>
          <p className="text-gray-600">
            Este link no existe o ya no está activo. Por favor verifica la URL o contacta al organizador.
          </p>
        </motion.div>
      </div>
    )
  }

  if (step === "expired") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Link Expirado
          </h2>
          <p className="text-gray-600 mb-4">
            Este link ha expirado después de 30 minutos. Por favor solicita un nuevo link al organizador.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8"
        >
          💍 Rifa Blessed Union
        </motion.h1>

        {step === "form" && (
          <BuyerForm token={token} onComplete={() => setStep("raffle")} />
        )}

        {step === "raffle" && <RaffleBoard token={token} />}
      </motion.div>
    </div>
  )
}
