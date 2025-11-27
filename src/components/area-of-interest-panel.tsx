import { ChevronLeft, FileUp, Trash2, MapPin } from "lucide-react"
import { useAOIStore } from "../store/useAOIStore"
import { useState } from "react"
import { SearchBar } from "./search-bar"

export function AreaOfInterestPanel() {
    const { aois, setDrawing, isDrawing, removeAoi, selectAoi, selectedAoiId, pendingAoi, setPendingAoi, addAoi } = useAOIStore()
    const [tempName, setTempName] = useState("")

    // Handlers
    const handleDrawClick = () => {
        setDrawing(true)
    }

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        removeAoi(id)
    }

    const handleSaveAoi = () => {
        if (pendingAoi && tempName.trim()) {
            addAoi({
                id: pendingAoi.id,
                name: tempName,
                geometry: pendingAoi.geometry,
                createdAt: new Date().toISOString(),
            })
            setPendingAoi(null)
            setTempName("")
            selectAoi(pendingAoi.id)
        }
    }

    const handleCancelAoi = () => {
        setPendingAoi(null)
        setTempName("")
    }

    return (
        <div className="flex h-full w-[320px] flex-col bg-[#faf8f5] px-5 py-5 relative">
            {pendingAoi && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-[90%] rounded-lg bg-white p-4 shadow-lg">
                        <h2 className="mb-3 text-lg font-semibold text-gray-800">Name your Area</h2>
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Enter AOI name..."
                            className="mb-4 w-full rounded border border-gray-300 p-2 text-sm focus:border-[#e07b39] focus:outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancelAoi}
                                className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAoi}
                                disabled={!tempName.trim()}
                                className="rounded bg-[#e07b39] px-3 py-1.5 text-sm text-white hover:bg-[#d4a574] disabled:opacity-50"
                            >
                                Save Area
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-5 flex items-center gap-2.5">
                <button
                    aria-label="Back"
                    className="flex h-8 w-8 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <div className="h-5 w-px bg-gray-300" />
                <h1 className="text-[15px] font-medium text-[#e07b39]">Define Area of Interest</h1>
            </div>

            <div className="mb-4">
                <p className="text-[14px] leading-[1.5] text-gray-600">
                    <span className="font-semibold text-gray-800">Define the area(s)</span> where you will apply your object count
                    & detection model
                </p>
            </div>

            <p className="mb-3 text-[14px] font-medium text-gray-800">Options:</p>

            <div className={`mb-3 flex items-center rounded-xl border bg-[#f3eadd] px-2 transition-all ${isDrawing ? 'border-[#d4a574] ring-1 ring-[#d4a574]' : 'border-[#d4a574]'}`}>
                <div className="flex-1 min-w-0">
                    <SearchBar
                        className="mb-0"
                        placeholder="Search for a city, town..."
                    />
                </div>

                <div className="flex items-center shrink-0">
                    <span className="text-[14px] text-gray-600 px-1">or</span>
                    <button
                        onClick={handleDrawClick}
                        disabled={isDrawing}
                        aria-label="Draw area on map"
                        className="flex items-center py-3.5 text-left transition-all hover:text-gray-900"
                    >
                        <span className="text-[14px] leading-[1.5] text-gray-600">
                            <span className="font-bold text-gray-800">draw</span> area on map
                        </span>
                    </button>
                </div>
            </div>

            <button
                aria-label="Upload shape file"
                className="flex items-center gap-3 rounded-lg border border-[#e5ddd3] bg-[#fdf9f5] px-4 py-3.5 text-left transition-all hover:border-[#d4a574] hover:shadow-sm"
            >
                <FileUp className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" strokeWidth={1.5} />
                <span className="text-[14px] text-gray-500">Uploading a shape file</span>
            </button>

            {aois.length > 0 && (
                <div className="mt-6 flex-1 overflow-y-auto">
                    <p className="mb-3 text-[14px] font-medium text-gray-800">Your Areas ({aois.length})</p>
                    <div className="flex flex-col gap-2">
                        {aois.map((aoi) => (
                            <div
                                key={aoi.id}
                                onClick={() => selectAoi(aoi.id)}
                                className={`group flex items-center justify-between rounded-md border p-3 text-sm transition-all cursor-pointer ${selectedAoiId === aoi.id
                                    ? "border-[#d4a574] bg-white shadow-sm"
                                    : "border-transparent bg-white hover:border-[#e5ddd3]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-[#e07b39]" />
                                    <span className="font-medium text-gray-700">{aoi.name}</span>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, aoi.id)}
                                    className="opacity-0 transition-opacity group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500"
                                    aria-label={`Delete ${aoi.name}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
