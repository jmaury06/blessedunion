"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Logo/Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-9xl mb-8"
          >
            💍
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-gray-800 mb-4"
          >
            Blessed Union
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 mb-12"
          >
            Rifa de Boda
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <p className="text-lg text-gray-700 mb-6">
              Bienvenido al sistema de gestión de rifas. Cada comprador recibe un link único 
              para seleccionar sus números de la suerte del <span className="font-bold">000 al 999</span>.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-4xl mb-2">🎫</div>
                <h3 className="font-semibold text-gray-800 mb-1">1000 Números</h3>
                <p className="text-sm text-gray-600">Del 000 al 999</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="font-semibold text-gray-800 mb-1">Links Seguros</h3>
                <p className="text-sm text-gray-600">Expiran en 30 minutos</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-semibold text-gray-800 mb-1">Sin Duplicados</h3>
                <p className="text-sm text-gray-600">Cada número es único</p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                📊 Ver Estadísticas
              </motion.button>
            </Link>
            
            <a href="https://github.com/yourusername/blessedunion" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200"
              >
                📖 Documentación
              </motion.button>
            </a>
          </motion.div>

          {/* Info Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-sm text-gray-500"
          >
            Los compradores recibirán un link único para acceder al sistema de selección
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="pb-8 text-center text-gray-500 text-sm"
      >
        Desarrollado con ❤️ para Blessed Union
      </motion.footer>
    </div>
  )
}
