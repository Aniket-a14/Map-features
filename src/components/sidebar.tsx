import { LayoutGrid } from 'lucide-react'
import { useAOIStore } from '../store/useAOIStore'
import { HomeIcon } from './custom-icons'

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
          <path d="M21.5 2.5L2.5 13L11 15.5L21.5 2.5Z" fill="#f3eadd" />
          <path d="M21.5 2.5L13.5 21.5L11 15.5L21.5 2.5Z" fill="#e07b39" />
        </svg>
      </div>

      <nav className="flex flex-col items-center gap-6">
        <button
          aria-label="Home"
          className="flex h-14 w-14 items-center justify-center rounded-xl text-[#e07b39] transition-transform hover:scale-110 hover:bg-white/50"
        >
          <HomeIcon className="h-10 w-10" />
        </button>
        <button
          onClick={toggleLayer}
          aria-label="Toggle Layers"
          className={`flex h-14 w-14 items-center justify-center rounded-xl transition-transform hover:scale-110 hover:bg-white/50 ${layerVisible ? 'text-[#e07b39]' : 'text-[#e07b39]/50'
            }`}
        >
          <LayoutGrid className="h-10 w-10" strokeWidth={0} fill="currentColor" />
        </button>
      </nav>
    </div>
  )
}

/**
 * Code Explanation:
 * The main navigation sidebar.
 * It contains the app logo and navigation buttons (Home, Layer Toggle).
 *
 * What is Happening:
 * - Renders the logo SVG.
 * - Provides a button to toggle between map layers (OSM/WMS).
 *
 * What to do Next:
 * - Add more navigation items as the app grows.
 * - Implement active state styling for navigation items.
 */
