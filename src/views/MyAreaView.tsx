import { useApp } from '../context/AppContext'
import { ProfileSetup } from './ProfileSetup'
import { MyWGView } from './MyWGView'

export function MyAreaView() {
  const { myAreaTab, setMyAreaTab, demoMode, setDemoMode } = useApp()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-3 pb-2 flex-shrink-0 bg-white border-b border-gray-100 flex items-center gap-2">
        <div className="flex flex-1 bg-gray-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setMyAreaTab('profile')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              myAreaTab === 'profile' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'
            }`}
          >
            👤 Profil
          </button>
          <button
            onClick={() => setMyAreaTab('wg')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              myAreaTab === 'wg' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'
            }`}
          >
            🏠 Meine WG
          </button>
        </div>
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            demoMode ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${demoMode ? 'bg-amber-500' : 'bg-gray-400'}`} />
          Demo
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {myAreaTab === 'profile' && <ProfileSetup />}
        {myAreaTab === 'wg' && <MyWGView />}
      </div>
    </div>
  )
}
