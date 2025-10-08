"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import ThemeToggle from "./components/ThemeToggle"
import RaffleProgress from "./components/RaffleProgress"

export default function Home() {
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
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white px-12 py-8 rounded-3xl shadow-2xl inline-block mb-8"
          >
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-wider">
              GANATE 📱💰
            </div>
            <div className="text-xl md:text-2xl font-semibold leading-relaxed">
              Un hermoso iPhone 13 de 128GB<br/>o $2.500.000 en efectivo
            </div>
          </motion.div>

          {/* PRECIO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 border-2 border-green-400 dark:border-green-600 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">💵</div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-4">
                $20.000 pesos
              </h3>
              <div className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Por cada 2 números
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                🎫 Compra 2 números = $20.000 | 4 números = $40.000 | 6 números = $60.000
              </p>
            </div>
          </motion.div>

          {/* PROGRESO DE LA RIFA */}
          <RaffleProgress />

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

          {/* Comprar Créditos Section */}
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
              className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              💳 Comprar Créditos
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-4">
                <Image 
                  src="/qr.png" 
                  alt="Código QR para comprar créditos" 
                  width={224}
                  height={224}
                  className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-lg"
                />
              </div>
              
              {/* Número de Nequi */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
                className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4 mb-6"
              >
                <p className="text-center font-bold text-orange-800 dark:text-orange-300 text-lg">
                  📱 Nequi: <span className="font-mono">3152124896</span>
                </p>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-lg"
              >
                Escanea el código QR o usa el número de Nequi para realizar tu pago. 
                <strong className="text-gray-800 dark:text-gray-200"> Te enviaré el link de participación cuando confirme que el depósito está OK.</strong>
              </motion.p>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex justify-center"
          >
            <a href="https://wa.me/573152124896" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  📱 Ir a WhatsApp
                </span>
              </motion.button>
            </a>
          </motion.div>

          {/* Info Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-10 text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto"
          >
            Después del pago, recibirás un link único y seguro para acceder al sistema de selección de números
          </motion.p>
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
