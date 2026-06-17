import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SwipeCard } from '../components/SwipeCard'
import { useApp } from '../context/AppContext'
import { Heart, RefreshCw, X } from 'lucide-react'

export function SwipeView() {
  const { queue, swipe } = useApp()
  const [matchFlash, setMatchFlash] = useState(false)

  function handleSwipe(dir: 'left' | 'right') {
    const matched = swipe(dir)
    if (matched) {
      setMatchFlash(true)
      setTimeout(() => setMatchFlash(false), 2000)
    }
  }

  const visible = queue.slice(0, 2)

  return (
    <div className="relative flex-1 flex flex-col items-center overflow-hidden px-4 pt-4">
      {visible.length > 0 ? (
        <>
          {/* Card stack */}
          <div className="relative w-full max-w-sm flex-1">
            <AnimatePresence>
              {[...visible].reverse().map((profile, i) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  onSwipe={handleSwipe}
                  zIndex={i}
                  isTop={i === visible.length - 1}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Action buttons — below the card, never overlapping */}
          <div className="flex-shrink-0 flex justify-center gap-10 py-4">
            <button
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white shadow-lg border border-rose-100 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-8 h-8 text-rose-400" />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg flex items-center justify-center active:scale-90 transition-transform"
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </button>
          </div>
        </>
      ) : (
        <EmptyState />
      )}

      {/* Match flash overlay */}
      <AnimatePresence>
        {matchFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl px-10 py-8 text-center shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">It's a Match!</h3>
              <p className="text-gray-500 mt-1">Schreib einfach eine Nachricht 💬</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 text-center px-8 justify-center">
      <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
        <RefreshCw className="w-9 h-9 text-pink-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700">Keine Profile mehr</h3>
      <p className="text-gray-400 text-sm">Du hast alle verfügbaren Profile gesehen. Schau später nochmal rein!</p>
    </div>
  )
}
