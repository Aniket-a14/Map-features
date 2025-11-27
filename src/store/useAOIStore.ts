import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AOI {
    id: string
    name: string
    geometry: any // GeoJSON Polygon
    createdAt: string
}

interface AOIState {
    aois: AOI[]
    selectedAoiId: string | null
    isDrawing: boolean
    layerVisible: boolean
    pendingAoi: { id: string; geometry: any } | null
    flyToLocation: { center: [number, number]; zoom: number } | null
    addAoi: (aoi: AOI) => void
    updateAoi: (id: string, updates: Partial<AOI>) => void
    removeAoi: (id: string) => void
    selectAoi: (id: string | null) => void
    setDrawing: (isDrawing: boolean) => void
    toggleLayer: () => void
    setPendingAoi: (aoi: { id: string; geometry: any } | null) => void
    setFlyToLocation: (location: { center: [number, number]; zoom: number } | null) => void
}

export const useAOIStore = create<AOIState>()(
    persist(
        (set) => ({
            aois: [],
            selectedAoiId: null,
            isDrawing: false,
            layerVisible: true,
            pendingAoi: null,
            flyToLocation: null,
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
        }),
        {
            name: 'aoi-storage',
        }
    )
)
