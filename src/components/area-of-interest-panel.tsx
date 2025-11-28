import {
  ChevronLeft,
  FileUp,
  Trash2,
  ChevronRight,
  Eye,
  Plus,
  MoreVertical,
  ChevronDown,
} from 'lucide-react'
import { useAOIStore } from '../store/useAOIStore'
import { useState } from 'react'
import { SearchBar } from './search-bar'

export function AreaOfInterestPanel() {
  const {
    aois,
    setDrawing,
    removeAoi,
    selectAoi,
    selectedAoiId,
    addAoi,
    viewMode,
    setViewMode,
    setTempGeometry,
    tempGeometry,
    setActiveTool,
    pendingAoi,
    setPendingAoi,
  } = useAOIStore()

  const [searchResultName, setSearchResultName] = useState('')
  const [sections, setSections] = useState({
    baseImage: false,
    aoi: true,
    objects: false,
  })

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleDrawClick = () => {
    setDrawing(true)
    setViewMode('drawing')
    setActiveTool('draw')
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeAoi(id)
  }

  const handleSearchResult = (result: { display_name: string; lat: string; lon: string }) => {
    setSearchResultName(result.display_name.split(',')[0])
    setViewMode('search_result')

    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    const delta = 0.05

    const mockGeometry = {
      type: 'Polygon',
      coordinates: [
        [
          [lon - delta, lat - delta],
          [lon + delta, lat - delta],
          [lon + delta, lat + delta],
          [lon - delta, lat + delta],
          [lon - delta, lat - delta],
        ],
      ],
    }
    setTempGeometry(mockGeometry)
  }

  const handleApply = () => {
    if (tempGeometry && searchResultName) {
      const newAoi = {
        id: crypto.randomUUID(),
        name: searchResultName,
        geometry: tempGeometry,
        createdAt: new Date().toISOString(),
      }
      addAoi(newAoi)
      setTempGeometry(null)
      setViewMode('list')
    }
  }

  const handleConfirm = () => {
    setViewMode('list')
  }

  const renderContent = () => {
    if (viewMode === 'list') {
      return (
        <div className="flex-1 overflow-y-auto mt-2">
          <div className="border-b border-gray-200 py-3">
            <button
              onClick={() => toggleSection('baseImage')}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                {sections.baseImage ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-[16px] text-gray-600">Select Base Image</span>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="border-b border-gray-200 py-3">
            <button
              onClick={() => toggleSection('aoi')}
              className="flex w-full items-center justify-between text-left mb-2"
            >
              <div className="flex items-center gap-2">
                {sections.aoi ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-[16px] text-gray-600">Define Area of Interest</span>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </button>

            {sections.aoi && (
              <div className="pl-6 flex flex-col gap-1">
                {aois.map((aoi, index) => (
                  <div
                    key={aoi.id}
                    onClick={() => selectAoi(aoi.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        selectAoi(aoi.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select area ${aoi.name}`}
                    className={`group flex items-center justify-between py-2 px-2 rounded-md cursor-pointer hover:bg-gray-50 ${selectedAoiId === aoi.id ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 ? (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      ) : (
                        <div className="w-4" />
                      )}
                      <div className="h-4 w-4 rounded-sm bg-[#f3eadd]" />
                      <span className="text-[16px] text-gray-700">
                        {aoi.name || `Area ${index + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDelete(e, aoi.id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={`Delete ${aoi.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" aria-label="View details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 py-3">
            <button
              onClick={() => toggleSection('objects')}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                {sections.objects ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-[16px] text-gray-600">Define Objects</span>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      )
    }

    if (viewMode === 'search_input' || viewMode === 'search_result') {
      return (
        <div className="mt-4">
          <h3 className="text-[18px] font-semibold text-gray-800 mb-2">Search Area</h3>
          <div className="mb-4 bg-[#f3eadd] rounded-xl border border-[#d4a574] p-1">
            <SearchBar
              placeholder="city, town, region..."
              className="mb-0"
              onResultSelect={handleSearchResult}
            />
          </div>

          <button
            onClick={handleApply}
            disabled={viewMode !== 'search_result'}
            className={`w-full rounded-lg py-3 px-4 text-[16px] font-medium transition-all mb-2 ${viewMode === 'search_result'
              ? 'bg-[#c17f59] text-white hover:bg-[#a86b47] shadow-sm'
              : 'bg-[#e5ddd3] text-gray-400 cursor-not-allowed'
              }`}
          >
            Apply outline as base image
          </button>

          <p className="text-[16px] text-gray-500 text-center">
            You can always edit the shape of the area later
          </p>
        </div>
      )
    }

    return (
      <>
        <div className="mb-6">
          <p className="text-[18px] leading-[1.5] text-gray-600">
            <span className="font-semibold text-gray-800">Search or use vector tool</span> to create
            your region.
          </p>
        </div>

        <p className="mb-3 text-[18px] font-medium text-gray-800">Options:</p>

        <div className="mb-3 flex flex-col items-center rounded-xl border border-[#d4a574] bg-[#f3eadd] transition-all">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setViewMode('search_input')}
              className="w-full text-left py-3.5 px-2 text-[18px] text-gray-600 hover:text-gray-900"
            >
              <span className="font-bold text-gray-800">Search</span> for a city, town...
            </button>
          </div>

          <div className="flex items-center shrink-0">
            <span className="text-[18px] text-gray-600 px-2">or</span>
            <button
              onClick={handleDrawClick}
              className="flex items-center py-3.5 text-left transition-all hover:text-gray-900"
            >
              <span className="text-[18px] leading-[1.5] text-gray-600">
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
          <span className="text-[18px] text-gray-500">Uploading a shape file</span>
        </button>
      </>
    )
  }

  const [aoiName, setAoiName] = useState('')

  const handleSaveAoi = () => {
    if (pendingAoi && aoiName) {
      addAoi({
        id: pendingAoi.id,
        name: aoiName,
        geometry: pendingAoi.geometry,
        createdAt: new Date().toISOString(),
      })
      setPendingAoi(null)
      setAoiName('')
      setViewMode('list')
    }
  }

  return (
    <div className="flex h-full w-[320px] flex-col bg-[#faf8f5] px-5 py-5 relative">
      <div className="mb-5 flex items-center gap-2.5">
        <button
          aria-label="Back"
          onClick={() => setViewMode('initial')}
          className="flex h-12 w-12 items-center justify-center rounded text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ChevronLeft className="h-9 w-9" strokeWidth={1.5} />
        </button>
        <div className="h-12 w-px bg-gray-400" />
        <h1 className="text-[20px] font-medium text-[#e07b39]">Define Project Scope</h1>
      </div>

      {renderContent()}

      {pendingAoi && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="w-[90%] rounded-xl bg-white p-4 shadow-xl border border-[#d4a574]">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Name your Area</h3>
            <input
              type="text"
              placeholder="Enter area name..."
              value={aoiName}
              onChange={(e) => setAoiName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-base focus:border-[#e07b39] focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPendingAoi(null)
                  setAoiName('')
                }}
                className="flex-1 rounded-lg bg-gray-100 py-2 text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAoi}
                disabled={!aoiName.trim()}
                className="flex-1 rounded-lg bg-[#e07b39] py-2 text-white hover:bg-[#c66a2e] disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {(viewMode === 'search_input' || viewMode === 'search_result') && (
        <div className="mt-auto pt-4">
          <button
            onClick={handleConfirm}
            disabled={viewMode !== 'search_result'}
            className={`w-full rounded-lg py-3 px-4 text-[16px] font-medium transition-all ${viewMode === 'search_result'
              ? 'bg-[#d4d4d4] text-gray-700 hover:bg-[#c0c0c0]'
              : 'bg-[#e5e5e5] text-gray-400 cursor-not-allowed'
              } ${viewMode === 'search_result' && tempGeometry === null ? 'bg-[#c17f59] text-white' : ''}`}
          >
            Confirm Area of Interest
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Code Explanation:
 * Manages the "Area of Interest" panel where users can define, view, and manage their areas.
 * It supports listing AOIs, searching for locations to create AOIs, and initiating drawing mode.
 *
 * What is Happening:
 * - Uses `useAOIStore` for state management (AOIs, view mode, drawing state).
 * - Renders different views based on `viewMode` ('list', 'search_input', 'search_result', 'drawing').
 * - Handles search results and temporary geometry creation.
 * - Allows saving and deleting AOIs.
 *
 * What to do Next:
 * - Implement "Define Objects" section.
 * - Improve "Upload shape file" functionality.
 * - Refactor large render methods into smaller sub-components.
 */
