"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import ThemeToggle from "./components/ThemeToggle"
import iPhone3DViewer from "./components/iPhone3DViewer"

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
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
          {/* iPhone 3D Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-12 w-full max-w-lg mx-auto"
          >
            <iPhone3DViewer />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Blessed Union
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8"
          >
            🎉 Rifa de Boda
          </motion.p>

          {/* PREMIO PRINCIPAL - iPHONE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white px-12 py-6 rounded-3xl font-black text-4xl md:text-6xl mb-6 shadow-2xl inline-block"
          >
            📱 iPhone 13 de 128GB 📱
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-12"
          >
            o $2.500.000 en efectivo 💰
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-200 dark:border-gray-700 w-full"
          >
            {/* Fecha y Lotería */}
            <div className="mb-10 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-2xl">Sorteo</h3>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Sábado 1 de Noviembre de 2025
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
                🎲 Con las <span className="font-bold">3 últimas cifras</span> de la Lotería de Boyacá
              </p>
            </div>

            {/* Regla de Aplazamiento */}
            <div className="mb-12 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-red-300 dark:border-red-700">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-xl">Importante</h3>
              <p className="text-base text-gray-700 dark:text-gray-300">
                Si al día del sorteo no se ha vendido el <span className="font-bold">75% de los números</span>, 
                la rifa se <span className="font-bold">aplazará 1 semana más</span>
              </p>
            </div>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed text-center max-w-4xl mx-auto">
              Cada comprador recibe un link único para seleccionar sus números de la suerte del{" "}
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">000 al 999</span>.
            </p>

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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  📊 Ver Estadísticas
                </span>
              </motion.button>
            </Link>
            
            <a href="https://github.com/jmaury06/blessedunion" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transition-all duration-300 border-2 border-gray-300 dark:border-gray-600"
              >
                <span className="flex items-center gap-2">
                  📖 Documentación
                </span>
              </motion.button>
            </a>
          </motion.div>

          {/* Info Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-10 text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto"
          >
            Los compradores recibirán un link único y seguro para acceder al sistema de selección de números
          </motion.p>
        </motion.div>
      </main>

      {/* Footer - Sticky */}
      <footer className="py-6 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Desarrollado con ❤️ para Blessed Union
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          © 2025 - Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
