"use client"

import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"
import BuyerForm from "../components/BuyerForm"
import RaffleBoard from "../components/RaffleBoard"

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
      <div className="flex items-center justify-center min-h-screen relative">
        <div 
          className="fixed inset-0 bg-cover bg-no-repeat opacity-20 dark:opacity-10 -z-10"
          style={{
            backgroundImage: "url('/beach-couple.jpg')",
            backgroundPosition: "center 75%",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 dark:border-pink-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (step === "invalid") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 relative">
        <div 
          className="fixed inset-0 bg-cover bg-no-repeat opacity-20 dark:opacity-10 -z-10"
          style={{
            backgroundImage: "url('/beach-couple.jpg')",
            backgroundPosition: "center 75%",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md text-center border border-gray-200 dark:border-gray-700"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl mb-6"
          >
            ❌
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Link Inválido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Este link no existe o ya no está activo. Por favor verifica la URL o contacta al organizador.
          </p>
        </motion.div>
      </div>
    )
  }

  if (step === "expired") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 relative">
        <div 
          className="fixed inset-0 bg-cover bg-no-repeat opacity-20 dark:opacity-10 -z-10"
          style={{
            backgroundImage: "url('/beach-couple.jpg')",
            backgroundPosition: "center 75%",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md text-center border border-gray-200 dark:border-gray-700"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl mb-6"
          >
            ⏰
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Link Expirado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Este link ha expirado después de 30 minutos. Por favor solicita un nuevo link al organizador.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/"}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
          >
            Volver al inicio
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative">
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat opacity-20 dark:opacity-10 -z-10"
        style={{
          backgroundImage: "url('/beach-couple.jpg')",
          backgroundPosition: "center 75%",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            🎫 Rifa Digital
          </span>
        </motion.h1>

        {step === "form" && (
          <BuyerForm token={token} onComplete={() => setStep("raffle")} />
        )}

        {step === "raffle" && <RaffleBoard token={token} />}
      </motion.div>
    </div>
  )
}
