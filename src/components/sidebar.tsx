import { Home, Layers } from "lucide-react"
import { useAOIStore } from "../store/useAOIStore"

export function Sidebar() {
  const { toggleLayer, layerVisible } = useAOIStore()

  return (
    <div className="flex h-full w-[60px] flex-col items-center bg-[#f5ebe0] pt-4">
      <div className="mb-6">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L34 18L18 34L2 18L18 2Z" fill="#d4a574" opacity="0.25" />
          <path d="M18 7L29 18L18 29L7 18L18 7Z" fill="#d4a574" opacity="0.45" />
          <path d="M18 12L24 18L18 24L12 18L18 12Z" fill="#e07b39" />
        </svg>
      </div>

      <nav className="flex flex-col items-center gap-2">
        <button
          aria-label="Home"
          className="flex h-10 w-10 items-center justify-center rounded-md text-[#c9a87c] transition-colors hover:bg-[#ede0d4] hover:text-[#b8956a]"
        >
          <Home className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={toggleLayer}
          aria-label="Toggle Layers"
          className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-[#ede0d4] hover:text-[#b8956a] ${layerVisible ? "bg-[#ede0d4] text-[#b8956a]" : "text-[#c9a87c]"
            }`}
        >
          <Layers className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </nav>
    </div>
  )
}
