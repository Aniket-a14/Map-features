import { AreaOfInterestPanel } from './components/area-of-interest-panel'
import { MapView } from './components/map-view'
import { Sidebar } from './components/sidebar'

export default function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MapView />
      </div>
      <div className="relative z-10 flex h-full pointer-events-none">
        <div className="pointer-events-auto h-full">
          <Sidebar />
        </div>
        <div className="pointer-events-auto h-full">
          <AreaOfInterestPanel />
        </div>
      </div>
    </div>
  )
}

/**
 * Code Explanation:
 * This is the main application component that sets up the layout.
 * It positions the MapView in the background and overlays the Sidebar and AreaOfInterestPanel.
 *
 * What is Happening:
 * - Renders MapView as a background layer (z-0).
 * - Renders a foreground layer (z-10) with pointer-events-none to allow clicking through to the map where empty.
 * - Sidebar and AreaOfInterestPanel are placed in the foreground with pointer-events-auto to enable interaction.
 *
 * What to do Next:
 * - Add routing if multiple pages are needed.
 * - Manage global state or context providers here if not already handled in main.tsx.
 */
