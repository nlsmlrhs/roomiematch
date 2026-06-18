import { motion } from 'framer-motion'
import wohniLogo from '../logos/wohni_logo.svg'

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      {/* Logo bubble */}
      <motion.div
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-5"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <img src={wohniLogo} alt="Wohni" className="w-16 h-16 object-contain" />
      </motion.div>

      {/* Wordmark */}
      <motion.h1
        className="text-4xl font-black text-white tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        Wohni
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-white/70 text-sm mt-2 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        Dein WG-Finder
      </motion.p>
    </motion.div>
  )
}
