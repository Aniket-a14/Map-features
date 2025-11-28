import { Home, LayoutGrid } from 'lucide-react'
import { useAOIStore } from '../store/useAOIStore'

export function Sidebar() {
  const { toggleLayer, layerVisible } = useAOIStore()

  return (
    <div className="flex h-full w-[80px] flex-col items-center bg-transparent pt-8">
      <div className="mb-8">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 22L12 18V2Z" fill="#d4c3abff" />
          <path d="M12 2L22 22L12 18V2Z" fill="#e07b39" />
        </svg>
      </div>

      <nav className="flex flex-col items-center gap-6">
        <button
          aria-label="Home"
          className="flex h-14 w-14 items-center justify-center rounded-xl text-[#e07b39] transition-transform hover:scale-110 hover:bg-white/50"
        >
          <Home className="h-10 w-10" strokeWidth={0} fill="currentColor" />
        </button>
        <button
          onClick={toggleLayer}
          aria-label="Toggle Layers"
          className={`flex h-14 w-14 items-center justify-center rounded-xl transition-transform hover:scale-110 hover:bg-white/50 ${
            layerVisible ? 'text-[#e07b39]' : 'text-[#e07b39]/50'
          }`}
        >
          <LayoutGrid className="h-10 w-10" strokeWidth={0} fill="currentColor" />
        </button>
      </nav>
    </div>
  )
}
