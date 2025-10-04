"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ThemeToggle from "../components/ThemeToggle"

type Stats = {
  links: {
    total: number
    active: number
    expired: number
  }
  numbers: {
    sold: number
    available: number
    total: number
    percentage: string
  }
  opportunities: {
    total: number
    used: number
    remaining: number
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/stats")
      const data = await res.json()
      if (data.ok) {
        setStats(data.stats)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando estadísticas...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error al cargar estadísticas</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full p-8">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            📊 Dashboard de la Rifa
          </span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Números Vendidos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-l-4 border-green-500 dark:border-green-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Números Vendidos
              </h2>
              <span className="text-4xl">🎫</span>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.numbers.sold}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                de {stats.numbers.total} totales
              </p>
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.numbers.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-right font-semibold">
                  {stats.numbers.percentage}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Números Disponibles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-l-4 border-blue-500 dark:border-blue-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Disponibles
              </h2>
              <span className="text-4xl">✨</span>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.numbers.available}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">números restantes</p>
            </div>
          </motion.div>

          {/* Links Activos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-l-4 border-purple-500 dark:border-purple-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Links Activos
              </h2>
              <span className="text-4xl">🔗</span>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.links.active}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.links.total} creados en total
              </p>
            </div>
          </motion.div>

          {/* Links Expirados */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-l-4 border-orange-500 dark:border-orange-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Links Expirados
              </h2>
              <span className="text-4xl">⏱️</span>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {stats.links.expired}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">links inactivos</p>
            </div>
          </motion.div>

          {/* Oportunidades Totales */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-l-4 border-pink-500 dark:border-pink-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Oportunidades
              </h2>
              <span className="text-4xl">🎯</span>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {stats.opportunities.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.opportunities.used} utilizadas
              </p>
            </div>
          </motion.div>

          {/* Oportunidades Restantes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-l-4 border-teal-500 dark:border-teal-400"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Por Usar
              </h2>
              <span className="text-4xl">⚡</span>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.opportunities.remaining}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">oportunidades pendientes</p>
            </div>
          </motion.div>
        </div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Acciones Rápidas
          </h2>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
            >
              🔄 Actualizar Stats
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("/", "_blank")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
            >
              🏠 Ir a Home
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
