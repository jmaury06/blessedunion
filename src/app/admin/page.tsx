"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingLink, setGeneratingLink] = useState(false)
  const [selectedOpportunities, setSelectedOpportunities] = useState<2 | 4 | 6 | 8 | 10>(2)
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        
        if (data.authenticated) {
          setIsAuthenticated(true)
          const statsRes = await fetch("/api/stats")
          if (statsRes.ok) {
            const statsData = await statsRes.json()
            if (statsData.ok) {
              setStats(statsData.stats)
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.ok) {
        setIsAuthenticated(true)
        const statsRes = await fetch("/api/stats")
        const statsData = await statsRes.json()
        if (statsData.ok) {
          setStats(statsData.stats)
        }
      } else {
        setLoginError(data.error || "Credenciales inválidas")
      }
    } catch (error) {
      setLoginError("Error al iniciar sesión")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setIsAuthenticated(false)
    setEmail("")
    setPassword("")
    setStats(null)
  }

  const handleGenerateLink = async () => {
    setGeneratingLink(true)
    setGeneratedLink("")

    try {
      const res = await fetch("/api/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunities: selectedOpportunities }),
      })

      const data = await res.json()

      if (data.ok) {
        const fullLink = `${window.location.origin}/${data.token}`
        setGeneratedLink(fullLink)

        const statsRes = await fetch("/api/stats")
        const statsData = await statsRes.json()
        if (statsData.ok) {
          setStats(statsData.stats)
        }
      }
    } catch (error) {
      console.error("Error generating link:", error)
    } finally {
      setGeneratingLink(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-xl text-gray-700 dark:text-gray-300">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">🔐</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Blessed Union Raffle
              </p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 outline-none transition-all"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🔑 Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 outline-none transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm"
                >
                  ❌ {loginError}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loginLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Ingresando..." : "🚀 Ingresar"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg text-sm"
        >
          🚪 Salir
        </motion.button>
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
          className="text-3xl md:text-5xl font-bold mb-8 text-center"
        >
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            👑 Panel de Administración
          </span>
        </motion.h1>

        {/* GENERATE LINK SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span>🔗</span>
            Generar Link para Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                🎯 Selecciona cantidad de oportunidades
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 4, 6, 8, 10].map((num) => (
                  <motion.button
                    key={num}
                    onClick={() => setSelectedOpportunities(num as 2 | 4 | 6 | 8 | 10)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 px-4 rounded-xl font-bold text-lg transition-all ${
                      selectedOpportunities === num
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {num}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <motion.button
                onClick={handleGenerateLink}
                disabled={generatingLink}
                whileHover={{ scale: generatingLink ? 1 : 1.02 }}
                whileTap={{ scale: generatingLink ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingLink ? "Generando..." : "✨ Generar Link"}
              </motion.button>
            </div>
          </div>

          {generatedLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-xl p-4"
            >
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                ✅ Link generado exitosamente
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                />
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    copied
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors`}
                >
                  {copied ? "✅ Copiado" : "📋 Copiar"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* STATS DASHBOARD */}
        {stats && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              📊 Estadísticas de la Rifa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Números Vendidos */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-green-500 dark:border-green-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Números Vendidos
                  </h3>
                  <span className="text-3xl">🎫</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats.numbers.sold}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  de {stats.numbers.total} totales
                </p>
                <div className="mt-3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.numbers.percentage}%` }}
                      transition={{ duration: 1 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right font-semibold">
                    {stats.numbers.percentage}%
                  </p>
                </div>
              </motion.div>

              {/* Números Disponibles */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 dark:border-blue-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Disponibles
                  </h3>
                  <span className="text-3xl">✨</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stats.numbers.available}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  números restantes
                </p>
              </motion.div>

              {/* Links Activos */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 dark:border-purple-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Links Activos
                  </h3>
                  <span className="text-3xl">🔗</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats.links.active}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stats.links.total} creados
                </p>
              </motion.div>

              {/* Links Expirados */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-orange-500 dark:border-orange-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Expirados
                  </h3>
                  <span className="text-3xl">⏱️</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {stats.links.expired}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  links inactivos
                </p>
              </motion.div>

              {/* Oportunidades */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-pink-500 dark:border-pink-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Oportunidades
                  </h3>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {stats.opportunities.total}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stats.opportunities.used} utilizadas
                </p>
              </motion.div>

              {/* Restantes */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-teal-500 dark:border-teal-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Por Usar
                  </h3>
                  <span className="text-3xl">⚡</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {stats.opportunities.remaining}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  pendientes
                </p>
              </motion.div>
            </div>

            {/* Acciones Rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                ⚡ Acciones Rápidas
              </h3>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl hover:shadow-xl transition-all font-semibold text-sm"
                >
                  🔄 Actualizar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open("/", "_blank")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:shadow-xl transition-all font-semibold text-sm"
                >
                  🏠 Home
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
