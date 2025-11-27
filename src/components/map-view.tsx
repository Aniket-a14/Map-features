"use client"

import { useEffect, useRef, useCallback } from "react"
import maplibregl from "maplibre-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import "maplibre-gl/dist/maplibre-gl.css"
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import { useAOIStore } from "../store/useAOIStore"
import { drawStyles } from "./draw-styles"
import { Plus, Minus } from "lucide-react"

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)

  const { isDrawing, setDrawing, layerVisible, setPendingAoi, flyToLocation, setFlyToLocation } = useAOIStore()

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'nrw-wms': {
              type: 'raster',
              tiles: [
                "https://www.wms.nrw.de/geobasis/wms_nw_dop?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=nw_dop_rgb",
              ],
              tileSize: 256,
            }
          },
          layers: [
            {
              id: 'nrw-wms-layer',
              type: 'raster',
              source: 'nrw-wms',
              paint: {},
              layout: {
                visibility: layerVisible ? 'visible' : 'none'
              }
            }
          ]
        },
        center: [6.9603, 50.9375], // Cologne area
        zoom: 11,
        attributionControl: false,
      })

      map.current.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right")

      map.current.on('load', () => {
        if (!map.current) return

        // Initialize Draw

        draw.current = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true,
          },
          defaultMode: "simple_select",
          styles: drawStyles
        })

        map.current.addControl(draw.current as unknown as maplibregl.IControl, "top-right")

        map.current.on("draw.create", onDrawCreate)
        map.current.on("draw.update", onDrawUpdate)
        map.current.on("draw.delete", onDrawDelete)
      })

    } catch (e) {
      console.error("Map initialization failed", e)
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Handle FlyTo
  useEffect(() => {
    if (map.current && flyToLocation) {
      map.current.flyTo({
        center: flyToLocation.center,
        zoom: flyToLocation.zoom,
        essential: true
      })
      setFlyToLocation(null) // Reset after flying
    }
  }, [flyToLocation, setFlyToLocation])

  // Handle Layer Visibility
  useEffect(() => {
    if (!map.current) return

    // Check if style is loaded before accessing layers
    if (!map.current.isStyleLoaded()) return

    if (map.current.getLayer("nrw-wms-layer")) {
      const visibility = layerVisible ? "visible" : "none"
      map.current.setLayoutProperty("nrw-wms-layer", "visibility", visibility)
    }
  }, [layerVisible])

  // Handle Drawing Mode
  useEffect(() => {
    if (!draw.current) return

    if (isDrawing) {
      draw.current.changeMode("draw_polygon")
    } else {
      draw.current.changeMode("simple_select")
    }
  }, [isDrawing])

  const onDrawCreate = useCallback((e: any) => {
    const feature = e.features[0]
    setPendingAoi({
      id: feature.id as string,
      geometry: feature.geometry,
    })
    setDrawing(false)
  }, [setPendingAoi, setDrawing])

  const onDrawUpdate = useCallback(() => {
    // Update logic if needed
  }, [])

  const onDrawDelete = useCallback(() => {
    // Delete logic if needed
  }, [])

  const handleZoomIn = () => {
    map.current?.zoomIn()
  }

  const handleZoomOut = () => {
    map.current?.zoomOut()
  }

  return (
    <div className="relative flex-1 h-full w-full">
      <div ref={mapContainer} id="map" className="absolute inset-0 bg-[#f0ede8]" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', height: '100%' }} />

      {/* Custom Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 text-gray-700 transition-colors"
          aria-label="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 text-gray-700 transition-colors"
          aria-label="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
