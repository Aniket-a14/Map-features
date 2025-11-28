import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AOI {
  id: string
  name: string
  geometry: any // GeoJSON Polygon
  createdAt: string
}

export type ViewMode = 'initial' | 'search_input' | 'search_result' | 'drawing' | 'list'
export type ActiveTool = 'draw' | 'erase' | 'edit' | null

interface AOIState {
  aois: AOI[]
  selectedAoiId: string | null
  isDrawing: boolean
  layerVisible: boolean
  pendingAoi: { id: string; geometry: any } | null
  flyToLocation: { center: [number, number]; zoom: number } | null

  // New State for AOI Flow
  viewMode: ViewMode
  tempGeometry: any | null // For search results (dotted outline)
  activeTool: ActiveTool

  addAoi: (aoi: AOI) => void
  updateAoi: (id: string, updates: Partial<AOI>) => void
  removeAoi: (id: string) => void
  selectAoi: (id: string | null) => void
  setDrawing: (isDrawing: boolean) => void
  toggleLayer: () => void
  setPendingAoi: (aoi: { id: string; geometry: any } | null) => void
  setFlyToLocation: (location: { center: [number, number]; zoom: number } | null) => void

  // New Actions
  setViewMode: (mode: ViewMode) => void
  setTempGeometry: (geometry: any | null) => void
  setActiveTool: (tool: ActiveTool) => void
}

export const useAOIStore = create<AOIState>()(
  persist(
    (set) => ({
      aois: [],
      selectedAoiId: null,
      isDrawing: false,
      layerVisible: false,
      pendingAoi: null,
      flyToLocation: null,

      viewMode: 'initial',
      tempGeometry: null,
      activeTool: null,

      addAoi: (aoi) => set((state) => ({ aois: [...state.aois, aoi] })),
      updateAoi: (id, updates) =>
        set((state) => ({
          aois: state.aois.map((aoi) => (aoi.id === id ? { ...aoi, ...updates } : aoi)),
        })),
      removeAoi: (id) =>
        set((state) => ({
          aois: state.aois.filter((aoi) => aoi.id !== id),
          selectedAoiId: state.selectedAoiId === id ? null : state.selectedAoiId,
        })),
      selectAoi: (id) => set({ selectedAoiId: id }),
      setDrawing: (isDrawing) => set({ isDrawing }),
      toggleLayer: () => set((state) => ({ layerVisible: !state.layerVisible })),
      setPendingAoi: (pendingAoi) => set({ pendingAoi }),
      setFlyToLocation: (location) => set({ flyToLocation: location }),

      setViewMode: (viewMode) => set({ viewMode }),
      setTempGeometry: (tempGeometry) => set({ tempGeometry }),
      setActiveTool: (activeTool) => set({ activeTool }),
    }),
    {
      name: 'aoi-storage',
      partialize: (state) => ({ aois: state.aois }), // Persist aois
    }
  )
)
