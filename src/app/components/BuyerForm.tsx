"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ThemeToggle from "./ThemeToggle"

type Props = {
  token: string
  onComplete: () => void
}

export default function BuyerForm({ token, onComplete }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" })
  const [serverError, setServerError] = useState("")

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    return phone.length >= 10
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validaciones
    const newErrors = { name: "", email: "", phone: "" }
    if (!name.trim()) newErrors.name = "El nombre es requerido"
    if (!email.trim()) newErrors.email = "El email es requerido"
    else if (!validateEmail(email)) newErrors.email = "Email inválido"
    if (!phone.trim()) newErrors.phone = "El teléfono es requerido"
    else if (!validatePhone(phone)) newErrors.phone = "Teléfono debe tener al menos 10 dígitos"
    
    setErrors(newErrors)
    if (Object.values(newErrors).some(err => err)) return
    
    setLoading(true)

    const res = await fetch("/api/save-buyer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, email, phone }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.ok) {
      onComplete()
    } else {
      setServerError(data.error || "Error al guardar información")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto px-4"
    >
      {/* Theme Toggle */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
      >
        {/* Header with Icon */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Información Personal
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Completa tus datos para continuar
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Name Field with Floating Label */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors({ ...errors, name: "" })
                setServerError("")
              }}
              className={`
                peer w-full px-4 pt-6 pb-2 border-2 rounded-xl 
                bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-0 transition-all duration-300
                ${errors.name 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-pink-500"
                }
              `}
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-2 text-xs font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-pink-500"
            >
              Nombre completo
            </label>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 ml-1"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email Field with Floating Label */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors({ ...errors, email: "" })
                setServerError("")
              }}
              className={`
                peer w-full px-4 pt-6 pb-2 border-2 rounded-xl 
                bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-0 transition-all duration-300
                ${errors.email 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-pink-500"
                }
              `}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-xs font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-pink-500"
            >
              Correo electrónico
            </label>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 ml-1"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Phone Field with Floating Label */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setErrors({ ...errors, phone: "" })
                setServerError("")
              }}
              className={`
                peer w-full px-4 pt-6 pb-2 border-2 rounded-xl 
                bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-0 transition-all duration-300
                ${errors.phone 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-pink-500"
                }
              `}
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="absolute left-4 top-2 text-xs font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 dark:peer-focus:text-pink-500"
            >
              Teléfono
            </label>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1 ml-1"
              >
                {errors.phone}
              </motion.p>
            )}
          </motion.div>

          {/* Server Error Message */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 rounded-xl p-4 text-center"
            >
              <p className="text-red-600 dark:text-red-400 font-semibold">
                ❌ {serverError}
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-6 py-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 font-bold text-lg mt-8"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  ⏳
                </motion.span>
                Guardando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
