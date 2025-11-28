import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AOI {
  id: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any
  createdAt: string
}

export type ViewMode = 'initial' | 'search_input' | 'search_result' | 'drawing' | 'list'
export type ActiveTool = 'draw' | 'erase' | 'edit' | null

interface AOIState {
  aois: AOI[]
  selectedAoiId: string | null
  isDrawing: boolean
  layerVisible: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingAoi: { id: string; geometry: any } | null
  flyToLocation: { center: [number, number]; zoom: number } | null

  viewMode: ViewMode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tempGeometry: any | null
  activeTool: ActiveTool

  addAoi: (aoi: AOI) => void
  updateAoi: (id: string, updates: Partial<AOI>) => void
  removeAoi: (id: string) => void
  selectAoi: (id: string | null) => void
  setDrawing: (isDrawing: boolean) => void
  toggleLayer: () => void
  setLayerVisible: (visible: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPendingAoi: (aoi: { id: string; geometry: any } | null) => void
  setFlyToLocation: (location: { center: [number, number]; zoom: number } | null) => void

  setViewMode: (mode: ViewMode) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      setLayerVisible: (visible) => set({ layerVisible: visible }),
      setPendingAoi: (pendingAoi) => set({ pendingAoi }),
      setFlyToLocation: (location) => set({ flyToLocation: location }),

      setViewMode: (viewMode) => set({ viewMode }),
      setTempGeometry: (tempGeometry) => set({ tempGeometry }),
      setActiveTool: (activeTool) => set({ activeTool }),
    }),
    {
      name: 'aoi-storage',
      partialize: (state) => ({ aois: state.aois }),
    }
  )
)

/**
 * Code Explanation:
 * Global state management store using Zustand.
 * It manages the state for AOIs (Areas of Interest), drawing tools, view modes, and map interactions.
 *
 * What is Happening:
 * - Defines the `AOIStore` interface and initial state.
 * - Provides actions to add, remove, update, and select AOIs.
 * - Manages UI state like `viewMode`, `activeTool`, and `layerVisible`.
 * - Persists AOIs to `localStorage` (via `persist` middleware).
 *
 * What to do Next:
 * - Add more robust validation for AOI data.
 * - Implement undo/redo functionality for drawing actions.
 * - Split store into smaller slices if it grows too large.
 */
