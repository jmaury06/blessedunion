"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface RaffleStats {
  totalNumbers: number
  numbersSold: number
  percentage: number
  daysRemaining: number
  raffleDate: string
  minimumReached: boolean
  minimumRequired: number
}

export default function RaffleProgress() {
  const [stats, setStats] = useState<RaffleStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/raffle-stats")
        const data = await res.json()

        if (data.ok) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error("[RAFFLE_PROGRESS] Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl p-8 mb-8 border-2 border-purple-300 dark:border-purple-700"
      >
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </motion.div>
    )
  }

  const { numbersSold, totalNumbers, percentage, daysRemaining, minimumReached } = stats

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl p-8 mb-8 border-2 border-purple-300 dark:border-purple-700 shadow-xl"
    >
      {/* Título */}
      <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        📊 Progreso de la Rifa
      </h3>

      {/* Grid de Estadísticas */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Días Restantes */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
        >
          <div className="text-4xl mb-2">⏰</div>
          <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
            {daysRemaining}
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {daysRemaining === 1 ? "día restante" : "días restantes"}
          </div>
        </motion.div>

        {/* Números Vendidos */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
        >
          <div className="text-4xl mb-2">🎫</div>
          <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {numbersSold}/{totalNumbers}
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            números vendidos
          </div>
        </motion.div>

        {/* Porcentaje */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg"
        >
          <div className="text-4xl mb-2">
            {minimumReached ? "✅" : "🎯"}
          </div>
          <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${minimumReached
              ? "from-green-600 to-emerald-600"
              : "from-orange-600 to-red-600"
            } bg-clip-text text-transparent mb-1`}>
            {percentage}%
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {minimumReached ? "¡Meta alcanzada!" : "vendido"}
          </div>
        </motion.div>
      </div>

      {/* Barra de Progreso */}
      <div className="mb-4">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${minimumReached
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              } flex items-center justify-end pr-2`}
          >
            {percentage > 10 && (
              <span className="text-white text-xs font-bold">
                {percentage}%
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Estado de la Rifa */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`text-center p-4 rounded-xl ${minimumReached
            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-700"
            : "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-700"
          }`}
      >
        <p className={`font-bold text-lg ${minimumReached
            ? "text-green-800 dark:text-green-300"
            : "text-yellow-800 dark:text-yellow-300"
          }`}>
          {minimumReached ? (
            <>
              ✅ ¡Aplazada - La rifa jugará el 8 de Noviembre de 2025!
            </>
          ) : (
            <></>
          )}
        </p>
        {!minimumReached && (
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
            Faltan {Math.ceil((totalNumbers * 0.75) - numbersSold)} números para alcanzar la meta mínima de venta
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
