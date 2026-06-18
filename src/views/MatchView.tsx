import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, MessageCircle, Info, Video, X, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Match, DirectConversation } from '../types'

type SubTab = 'allgemein' | 'matches'

export function MatchView() {
  const { matches, activeChatMatchId, setActiveChatMatchId, sendMessage, markMatchRead, directConversations } = useApp()
  const [tab, setTab] = useState<SubTab>('allgemein')
  const [activeDcId, setActiveDcId] = useState<string | null>(null)

  // Auto-switch to matches tab when a match chat is opened externally
  useEffect(() => {
    if (activeChatMatchId) setTab('matches')
  }, [activeChatMatchId])

  const activeMatch = matches.find((m) => m.id === activeChatMatchId)
  const activeDc = directConversations.find((c) => c.id === activeDcId)

  if (activeMatch) {
    return <ChatScreen match={activeMatch} onBack={() => setActiveChatMatchId(null)} sendMessage={sendMessage} />
  }

  if (activeDc) {
    return <DirectChatScreen conv={activeDc} onBack={() => setActiveDcId(null)} />
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-3">
          Nachrichten
        </h2>
        {/* Sub-tabs */}
        <div className="flex gap-0">
          <SubTabButton tab="allgemein" active={tab === 'allgemein'} badge={directConversations.length} onClick={() => setTab('allgemein')}>
            💬 Allgemein
          </SubTabButton>
          <SubTabButton tab="matches" active={tab === 'matches'} badge={matches.length} onClick={() => setTab('matches')}>
            ❤️ Matches
          </SubTabButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'allgemein' && (
          <AllgemeinList conversations={directConversations} onOpen={(id) => setActiveDcId(id)} />
        )}
        {tab === 'matches' && (
          <MatchesList matches={matches} onOpen={(id) => { markMatchRead(id); setActiveChatMatchId(id) }} />
        )}
      </div>
    </div>
  )
}

function SubTabButton({
  active,
  badge,
  onClick,
  children,
}: {
  tab: SubTab
  active: boolean
  badge: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
        active ? 'text-pink-600 border-pink-500' : 'text-gray-400 border-transparent'
      }`}
    >
      {children}
      {badge > 0 && (
        <span className={`min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center ${active ? 'bg-pink-500' : 'bg-gray-300'}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

// ─── Allgemein Tab ───────────────────────────────────────────────────────────

function AllgemeinList({ conversations, onOpen }: { conversations: DirectConversation[]; onOpen: (id: string) => void }) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 mt-20 text-center px-8">
        <MessageCircle className="w-14 h-14 text-gray-200" />
        <p className="text-gray-400">Noch keine Nachrichten. Schreib jemanden direkt aus der Detailansicht an!</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => (
        <DirectConvRow key={conv.id} conv={conv} onOpen={() => onOpen(conv.id)} />
      ))}
    </div>
  )
}

function DirectConvRow({ conv, onOpen }: { conv: DirectConversation; onOpen: () => void }) {
  const lastMsg = conv.messages[conv.messages.length - 1]
  const emoji = conv.profileKind === 'flatshare' ? '🏠' : '👤'

  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200">
        {conv.profilePhoto
          ? <img src={conv.profilePhoto} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">{emoji}</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{conv.profileName}</p>
        <p className="text-sm text-gray-500 truncate">
          {lastMsg ? lastMsg.text : 'Noch keine Antwort'}
        </p>
      </div>
      <span className="flex-shrink-0 text-xs text-gray-400">
        {new Date(conv.startedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
      </span>
    </button>
  )
}

function DirectChatScreen({ conv, onBack }: { conv: DirectConversation; onBack: () => void }) {
  const { directConversations, sendDirectMessage, setDetailProfile, allProfiles } = useApp()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const current = directConversations.find((c) => c.id === conv.id) ?? conv
  const messages = current.messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const profile = allProfiles.find((p) => p.id === conv.profileId) ?? null
  const emoji = conv.profileKind === 'flatshare' ? '🏠' : '👤'

  function handleSend() {
    const t = input.trim()
    if (!t || !profile) return
    sendDirectMessage(profile, t)
    setInput('')
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="p-1 -ml-1 rounded-full active:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => profile && setDetailProfile(profile)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
          disabled={!profile}
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-pink-100 flex-shrink-0">
            {conv.profilePhoto
              ? <img src={conv.profilePhoto} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-lg">{emoji}</div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{conv.profileName}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
          {profile && <Info className="w-4 h-4 text-gray-300 flex-shrink-0" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Schreib eine erste Nachricht ✉️</p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                msg.senderId === 'me'
                  ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 px-1">
                {new Date(msg.sentAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

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
          disabled={!input.trim() || !profile}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}

// ─── Matches Tab ─────────────────────────────────────────────────────────────

function MatchesList({ matches, onOpen }: { matches: Match[]; onOpen: (id: string) => void }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 mt-20 text-center px-8">
        <Heart className="w-14 h-14 text-gray-200" />
        <p className="text-gray-400">Noch keine Matches. Swipe weiter!</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} onOpen={() => onOpen(match.id)} />
      ))}
    </div>
  )
}

function MatchRow({ match, onOpen }: { match: Match; onOpen: () => void }) {
  const { readMatchIds } = useApp()

  const iAmSeeker = match.seeker.id === 'me'
  const name = iAmSeeker ? match.flatshare.title : `${match.seeker.firstName}${match.seeker.lastName ? ' ' + match.seeker.lastName : ''}`
  const avatar = iAmSeeker ? match.flatshare.images[0] : match.seeker.photos[0]
  const emoji = iAmSeeker ? '🏠' : '👤'
  const lastMsg = match.messages[match.messages.length - 1]
  const isUnread = !readMatchIds.has(match.id)

  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200 relative">
        {avatar
          ? <img src={avatar} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">{emoji}</div>
        }
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
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="p-1 -ml-1 rounded-full active:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => setDetailProfile(detailTarget)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-pink-100 flex-shrink-0">
            {avatar
              ? <img src={avatar} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-lg">{emoji}</div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{name}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
          <Info className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </button>
        <button onClick={handleVideoPress} aria-label="Videoanruf" className="p-2 rounded-full active:bg-gray-100 transition-colors flex-shrink-0">
          <Video className="w-5 h-5 text-gray-400" />
        </button>
      </div>

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

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {match.messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Noch keine Nachrichten. Schreib einfach los! 🎉</p>
        )}
        <AnimatePresence initial={false}>
          {match.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                msg.senderId === 'me'
                  ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 px-1">
                {new Date(msg.sentAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
