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
