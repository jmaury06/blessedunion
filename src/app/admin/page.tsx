"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          📊 Dashboard de la Rifa
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Números Vendidos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Números Vendidos
              </h2>
              <span className="text-3xl">🎫</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-green-600">
                {stats.numbers.sold}
              </p>
              <p className="text-sm text-gray-500">
                de {stats.numbers.total} totales
              </p>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.numbers.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 text-right">
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
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Disponibles
              </h2>
              <span className="text-3xl">✨</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-600">
                {stats.numbers.available}
              </p>
              <p className="text-sm text-gray-500">números restantes</p>
            </div>
          </motion.div>

          {/* Links Activos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Links Activos
              </h2>
              <span className="text-3xl">🔗</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-purple-600">
                {stats.links.active}
              </p>
              <p className="text-sm text-gray-500">
                {stats.links.total} creados en total
              </p>
            </div>
          </motion.div>

          {/* Links Expirados */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Links Expirados
              </h2>
              <span className="text-3xl">⏱️</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-orange-600">
                {stats.links.expired}
              </p>
              <p className="text-sm text-gray-500">links inactivos</p>
            </div>
          </motion.div>

          {/* Oportunidades Totales */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-pink-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Oportunidades
              </h2>
              <span className="text-3xl">🎯</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-pink-600">
                {stats.opportunities.total}
              </p>
              <p className="text-sm text-gray-500">
                {stats.opportunities.used} utilizadas
              </p>
            </div>
          </motion.div>

          {/* Oportunidades Restantes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Por Usar
              </h2>
              <span className="text-3xl">⚡</span>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-teal-600">
                {stats.opportunities.remaining}
              </p>
              <p className="text-sm text-gray-500">oportunidades pendientes</p>
            </div>
          </motion.div>
        </div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Acciones Rápidas
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Actualizar Stats
            </button>
            <button
              onClick={() => window.open("/", "_blank")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              🏠 Ir a Home
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
