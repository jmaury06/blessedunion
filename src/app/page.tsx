"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ThemeToggle from "./components/ThemeToggle"
import RaffleProgress from "./components/RaffleProgress"

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleOpportunitySelect = async (opportunities: number) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/create-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opportunities }),
      })

      const data = await response.json()

      if (data.ok) {
        // Redirigir inmediatamente al link generado
        router.push(`/${data.token}`)
      } else {
        alert("Error al generar el link. Por favor, intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión. Por favor, intenta de nuevo.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat opacity-20 dark:opacity-10 -z-10"
        style={{
          backgroundImage: "url('/beach-couple.jpg')",
          backgroundPosition: "center 75%",
        }}
      />
      {/* Theme Toggle Fixed */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl w-full"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Bendecidos en Amor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
          >
            💖 Unidos por amor y fe
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-xl text-gray-700 dark:text-gray-300 mb-4"
          >
            Tu apoyo nos acerca a nuestro gran día ✨
            <br />
            Gracias por ser parte de este sueño.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-12"
          >
            — Jessy & Jairo
          </motion.p>

          {/* PREMIO PRINCIPAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white p-8 md:p-12 rounded-3xl shadow-2xl mb-8 w-full text-center"
          >
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-wider">
              GANATE 📱💰
            </div>
            <div className="text-xl md:text-2xl font-semibold leading-relaxed">
              Un hermoso iPhone 13 de 128GB<br/>o $2.500.000 en efectivo
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-200 dark:border-gray-700 w-full"
          >
            {/* Información del Sorteo */}
            <div className="mb-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📅</span>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    Sorteo: Sábado 1 de Noviembre de 2025
                  </p>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 ml-12">
                  🎲 Con las <span className="font-bold">3 últimas cifras</span> de la Lotería de Boyacá
                </p>
              </div>
              
              <div className="border-t border-yellow-300 dark:border-yellow-600 pt-4 mt-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <p className="text-base font-bold text-gray-800 dark:text-white mb-1">
                      Importante:
                    </p>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      Si al día del sorteo no se ha vendido el <span className="font-bold">75% de los números</span>, 
                      la rifa se <span className="font-bold">aplazará 1 semana más</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-700 text-center"
              >
                <div className="text-5xl mb-4">🎫</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-xl">1000 Números</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Del 000 al 999</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 text-center"
              >
                <div className="text-5xl mb-4">⏱️</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-xl">Links Seguros</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Expiran en 30 minutos</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-700 text-center"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-xl">Sin Duplicados</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Cada número es único</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Selector de Oportunidades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-12 mb-8"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              🎯 ¿Con Cuántas Oportunidades Colaborar?
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
            >
              {[2, 4, 6, 8, 10].map((opportunities, index) => {
                const prices = { 2: 20000, 4: 40000, 6: 50000, 8: 70000, 10: 80000 }
                const isPromo = opportunities === 6 || opportunities === 10
                const regularPrice = opportunities * 10000
                const promoPrice = prices[opportunities as keyof typeof prices]
                
                return (
                  <motion.button
                    key={opportunities}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpportunitySelect(opportunities)}
                    disabled={isGenerating}
                    className={`${
                      isPromo 
                        ? "bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl hover:shadow-orange-500/50 ring-2 ring-yellow-300 ring-offset-2" 
                        : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/50"
                    } text-white p-6 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                  >
                    {isPromo && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-2xl">
                        🔥 PROMO
                      </div>
                    )}
                    <div className="text-3xl mb-2">🎫</div>
                    <div className="text-2xl font-bold">{opportunities}</div>
                    <div className="text-sm opacity-90">números</div>
                    <div className="text-xs mt-2">
                      {isPromo && (
                        <div className="line-through opacity-60 text-xs">
                          ${regularPrice.toLocaleString()}
                        </div>
                      )}
                      <div className={`${isPromo ? 'text-yellow-200 font-bold' : 'opacity-80'}`}>
                        ${promoPrice.toLocaleString()}
                      </div>
                      {isPromo && (
                        <div className="text-yellow-200 text-xs font-bold mt-1">
                          ¡Ahorra ${(regularPrice - promoPrice).toLocaleString()}!
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-6"
              >
                <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  Generando tu link personalizado...
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto"
            >
              Selecciona la cantidad de números que deseas y serás redirigido automáticamente a tu link personalizado para elegir tus números de la suerte.
            </motion.p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer - Sticky */}
      <footer className="py-6 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Desarrollado por Jairo Maury
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          © 2025 - Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
