import { useApp } from '../context/AppContext'
import { ProfileSetup } from './ProfileSetup'
import { MyListingsView } from './MyListingsView'

export function MyAreaView() {
  const { myAreaTab, setMyAreaTab } = useApp()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2 flex-shrink-0 bg-white border-b border-gray-100">
        <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setMyAreaTab('profile')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              myAreaTab === 'profile' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'
            }`}
          >
            👤 Mein Profil
          </button>
          <button
            onClick={() => setMyAreaTab('listings')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              myAreaTab === 'listings' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'
            }`}
          >
            🏢 Meine WG
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {myAreaTab === 'profile' ? <ProfileSetup /> : <MyListingsView />}
      </div>
    </div>
  )
}
