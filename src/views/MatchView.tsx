import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, MessageCircle, Info, Video, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Match } from '../types'

export function MatchView() {
  const { matches, activeChatMatchId, setActiveChatMatchId, sendMessage, markMatchRead } = useApp()

  const activeMatch = matches.find((m) => m.id === activeChatMatchId)

  function openChat(matchId: string) {
    markMatchRead(matchId)
    setActiveChatMatchId(matchId)
  }

  if (activeMatch) {
    return <ChatScreen match={activeMatch} onBack={() => setActiveChatMatchId(null)} sendMessage={sendMessage} />
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
      <div className="px-4 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Deine Matches</h2>
        <p className="text-sm text-gray-500">
          {matches.length} Match{matches.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-3 mt-20 text-center px-8">
          <MessageCircle className="w-14 h-14 text-gray-200" />
          <p className="text-gray-400">Noch keine Matches. Swipe weiter!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} onOpen={() => openChat(match.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function MatchRow({ match, onOpen }: { match: Match; onOpen: () => void }) {
  const { readMatchIds } = useApp()

  // Determine perspective: seeker.id === 'me' means current user is the seeker
  const iAmSeeker = match.seeker.id === 'me'
  const name = iAmSeeker ? match.flatshare.title : `${match.seeker.firstName}${match.seeker.lastName ? ' ' + match.seeker.lastName : ''}`
  const avatar = iAmSeeker
    ? match.flatshare.images[0]
    : match.seeker.photos[0]
  const emoji = iAmSeeker ? '🏠' : '👤'

  const lastMsg = match.messages[match.messages.length - 1]
  const isUnread = !readMatchIds.has(match.id)

  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200 relative">
        {avatar ? (
          <img src={avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">{emoji}</div>
        )}
        {isUnread && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-pink-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`truncate ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>{name}</p>
        <p className={`text-sm truncate ${isUnread && lastMsg ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
          {lastMsg ? lastMsg.text : 'Noch keine Nachrichten – sag Hallo! 👋'}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400">
          {new Date(match.matchedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
        </span>
        {isUnread && <span className="w-2 h-2 rounded-full bg-pink-500" />}
      </div>
    </button>
  )
}

function ChatScreen({
  match,
  onBack,
  sendMessage,
}: {
  match: Match
  onBack: () => void
  sendMessage: (matchId: string, text: string) => void
}) {
  const { setDetailProfile } = useApp()
  const [input, setInput] = useState('')
  const [showVideoHint, setShowVideoHint] = useState(false)

  function handleVideoPress() {
    setShowVideoHint(true)
    setTimeout(() => setShowVideoHint(false), 2500)
  }

  const iAmSeeker = match.seeker.id === 'me'
  const name = iAmSeeker ? match.flatshare.title : `${match.seeker.firstName}${match.seeker.lastName ? ' ' + match.seeker.lastName : ''}`
  const avatar = iAmSeeker ? match.flatshare.images[0] : match.seeker.photos[0]
  const emoji = iAmSeeker ? '🏠' : '👤'
  const detailTarget = iAmSeeker ? match.flatshare : match.seeker

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(match.id, trimmed)
    setInput('')
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="p-1 -ml-1 rounded-full active:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => setDetailProfile(detailTarget)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-pink-100 flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">{emoji}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{name}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
          <Info className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </button>
        <button
          onClick={handleVideoPress}
          aria-label="Videoanruf"
          className="p-2 rounded-full active:bg-gray-100 transition-colors flex-shrink-0"
        >
          <Video className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Video hint banner */}
      <AnimatePresence>
        {showVideoHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-2 px-4 py-2.5 bg-indigo-50 border-b border-indigo-100 flex-shrink-0"
          >
            <p className="text-sm text-indigo-700 font-medium">Video-Besichtigungen kommen bald 🎥</p>
            <button onClick={() => setShowVideoHint(false)} className="text-indigo-400 active:text-indigo-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {match.messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            Noch keine Nachrichten. Schreib einfach los! 🎉
          </p>
        )}
        <AnimatePresence initial={false}>
          {match.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  msg.senderId === 'me'
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 px-1">
                {new Date(msg.sentAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nachricht schreiben…"
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
