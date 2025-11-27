import { AreaOfInterestPanel } from "./components/area-of-interest-panel"
import { MapView } from "./components/map-view"
import { Sidebar } from "./components/sidebar"

export default function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <AreaOfInterestPanel />
      <MapView />
    </div>
  )
}
