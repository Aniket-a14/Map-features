'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import maplibregl from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { useAOIStore } from '../store/useAOIStore'
import { drawStyles } from './draw-styles'
import { Plus, Minus, Maximize, Minimize } from 'lucide-react'
import { DrawingTools } from './drawing-tools'
import * as turf from '@turf/turf'

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)

  const {
    isDrawing,
    setPendingAoi,
    flyToLocation,
    setFlyToLocation,
    tempGeometry,
    aois,
    activeTool,
    setActiveTool,
    viewMode,
    layerVisible,
  } = useAOIStore()

  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  // Helper to calculate centroid
  const getCentroid = (geometry: any) => {
    if (!geometry || !geometry.coordinates || geometry.coordinates.length === 0) return null
    // Simple centroid for Polygon (first ring)
    const coords = geometry.type === 'Polygon' ? geometry.coordinates[0] : geometry.coordinates
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    coords.forEach((c: number[]) => {
      minX = Math.min(minX, c[0])
      minY = Math.min(minY, c[1])
      maxX = Math.max(maxX, c[0])
      maxY = Math.max(maxY, c[1])
    })
    return [(minX + maxX) / 2, (minY + maxY) / 2] as [number, number]
  }

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
            },
            'nrw-wms': {
              type: 'raster',
              tiles: [
                'https://www.wms.nrw.de/geobasis/wms_nw_dop?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=nw_dop_rgb',
              ],
              tileSize: 256,
              attribution: '&copy; Geobasis NRW',
            },
            'temp-aoi': {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            },
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm',
              layout: {
                visibility: 'visible',
              },
            },
            {
              id: 'nrw-wms-layer',
              type: 'raster',
              source: 'nrw-wms',
              layout: {
                visibility: 'none',
              },
            },
            {
              id: 'temp-aoi-line',
              type: 'line',
              source: 'temp-aoi',
              paint: {
                'line-color': '#e07b39',
                'line-width': 2,
                'line-dasharray': [2, 2],
              },
            },
          ],
        },
        center: [6.9603, 50.9375], // Cologne area
        zoom: 11,
        attributionControl: false,
      })

      map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

      map.current.on('load', () => {
        if (!map.current) return

        // Initialize Draw
        draw.current = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true,
          },
          defaultMode: 'simple_select',
          styles: drawStyles,
        })

        map.current.addControl(draw.current as unknown as maplibregl.IControl, 'top-right')

        map.current.on('draw.create', onDrawCreate)
        map.current.on('draw.update', onDrawUpdate)
        map.current.on('draw.delete', onDrawDelete)
      })
    } catch (e) {
      console.error('Map initialization failed', e)
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Handle Layer Visibility (WMS vs OSM)
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    const wmsLayer = map.current.getLayer('nrw-wms-layer')
    const osmLayer = map.current.getLayer('osm-layer')

    if (wmsLayer && osmLayer) {
      if (layerVisible) {
        map.current.setLayoutProperty('nrw-wms-layer', 'visibility', 'visible')
        map.current.setLayoutProperty('osm-layer', 'visibility', 'none')
      } else {
        map.current.setLayoutProperty('nrw-wms-layer', 'visibility', 'none')
        map.current.setLayoutProperty('osm-layer', 'visibility', 'visible')
      }
    }
  }, [layerVisible])

  // Auto-switch to WMS on Draw or Search
  useEffect(() => {
    if (viewMode === 'search_result' || activeTool === 'draw') {
      if (!layerVisible) {
        useAOIStore.getState().toggleLayer()
      }
    }
  }, [viewMode, activeTool, layerVisible])

  // Handle Tooltips
  useEffect(() => {
    if (!map.current) return

    // Remove existing popup
    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }

    let location: [number, number] | null = null
    let content = ''

    if (tempGeometry && (viewMode === 'search_result' || viewMode === 'search_input')) {
      location = getCentroid(tempGeometry)
      content = `
        <div class="text-[16px] font-medium text-white bg-black/70 px-3 py-2 rounded shadow-lg backdrop-blur-sm">
          <div class="text-[14px] text-gray-300 uppercase mb-0.5">Example:</div>
          "Cologne City"
        </div>
      `
    } else if (aois.length > 0 && viewMode === 'list') {
      // Show tooltip for the last added AOI or selected one
      const lastAoi = aois[aois.length - 1]
      location = getCentroid(lastAoi.geometry)
      content = `
        <div class="text-[16px] font-medium text-white bg-black/70 px-3 py-2 rounded shadow-lg backdrop-blur-sm">
          Outlined city area as<br/>your base shape.
        </div>
      `
    }

    if (location && content) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'custom-popup',
        maxWidth: '300px',
      })
        .setLngLat(location)
        .setHTML(content)
        .addTo(map.current)
    }
  }, [tempGeometry, aois, viewMode])

  // Handle Temp Geometry (Dotted Outline)
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    const source = map.current.getSource('temp-aoi') as maplibregl.GeoJSONSource
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: tempGeometry
          ? [
              {
                type: 'Feature',
                properties: {},
                geometry: tempGeometry,
              },
            ]
          : [],
      })
    }
  }, [tempGeometry])

  // Sync AOIs to Draw
  useEffect(() => {
    if (!draw.current || !map.current) return

    // Clear existing and add current AOIs
    draw.current.deleteAll()
    if (aois.length > 0) {
      const features = aois.map((aoi) => ({
        id: aoi.id,
        type: 'Feature',
        properties: {},
        geometry: aoi.geometry,
      }))
      draw.current.add({
        type: 'FeatureCollection',
        features: features as any,
      })
    }
  }, [aois])

  // Handle FlyTo
  useEffect(() => {
    if (map.current && flyToLocation) {
      map.current.flyTo({
        center: flyToLocation.center,
        zoom: flyToLocation.zoom,
        essential: true,
      })
      setFlyToLocation(null) // Reset after flying
    }
  }, [flyToLocation, setFlyToLocation])

  // Handle Active Tool
  useEffect(() => {
    if (!draw.current) return

    if (activeTool === 'draw') {
      draw.current.changeMode('draw_polygon')
    } else if (activeTool === 'edit') {
      // Change to line string for cutting/reshaping
      draw.current.changeMode('draw_line_string')
    } else if (activeTool === 'erase') {
      draw.current.changeMode('simple_select')
    } else {
      draw.current.changeMode('simple_select')
    }
  }, [activeTool])

  const onDrawCreate = useCallback(
    (e: any) => {
      const feature = e.features[0]

      if (activeTool === 'edit' && feature.geometry.type === 'LineString') {
        const line = feature
        let splitOccurred = false

        console.log('Attempting to reshape/split polygon...')

        // Iterate over existing AOIs to find one to split
        const updatedAois = aois.map((aoi) => {
          try {
            const poly = turf.polygon(aoi.geometry.coordinates)
            const polyLine = turf.polygonToLine(poly) as any

            // 1. Snap Start and End points to the polygon boundary
            const lineCoords = line.geometry.coordinates
            const startPoint = turf.point(lineCoords[0])
            const endPoint = turf.point(lineCoords[lineCoords.length - 1])

            const snapStart = turf.nearestPointOnLine(polyLine, startPoint)
            const snapEnd = turf.nearestPointOnLine(polyLine, endPoint)

            console.log('Snapped Start:', snapStart)
            console.log('Snapped End:', snapEnd)

            // Ensure we have valid snap points
            if (!snapStart || !snapEnd) return aoi

            // 2. Get the boundary segments between the two snap points
            const segment1 = turf.lineSlice(snapStart, snapEnd, polyLine)

            // 3. Construct the two potential new polygons
            const drawnLineCoords = lineCoords

            // Helper to clean coords (remove duplicates)
            const clean = (coords: any[]) => {
              return coords.filter((c, i) => {
                if (i === 0) return true
                return turf.distance(turf.point(coords[i - 1]), turf.point(c)) > 0.000001
              })
            }

            // Loop 1: Segment1 + DrawnLine (reversed)
            const loop1Coords = [
              ...segment1.geometry.coordinates,
              ...[...drawnLineCoords].reverse(),
            ]

            // Loop 2: Segment2 + DrawnLine
            // Segment2 is constructed from the "rest" of the boundary
            const startOfLine = turf.point(polyLine.geometry.coordinates[0])
            const endOfLine = turf.point(
              polyLine.geometry.coordinates[polyLine.geometry.coordinates.length - 1]
            )

            const segEndToFinish = turf.lineSlice(snapEnd, endOfLine, polyLine)
            const segStartToSnap = turf.lineSlice(startOfLine, snapStart, polyLine)

            const segment2Coords = [
              ...segEndToFinish.geometry.coordinates,
              ...segStartToSnap.geometry.coordinates,
            ]

            const loop2Coords = [...segment2Coords, ...drawnLineCoords]

            // Clean and Polygonize
            const poly1 = turf.polygon([clean(loop1Coords)])
            const poly2 = turf.polygon([clean(loop2Coords)])

            const area1 = turf.area(poly1)
            const area2 = turf.area(poly2)

            console.log('Area 1:', area1)
            console.log('Area 2:', area2)

            // Keep the largest
            const bestPoly = area1 > area2 ? poly1 : poly2

            if (bestPoly) {
              splitOccurred = true
              return {
                ...aoi,
                geometry: bestPoly.geometry,
              }
            }
          } catch (err) {
            console.error('Error reshaping polygon:', err)
          }
          return aoi
        })

        if (splitOccurred) {
          updatedAois.forEach((updated) => {
            const original = aois.find((a) => a.id === updated.id)
            if (
              original &&
              JSON.stringify(original.geometry) !== JSON.stringify(updated.geometry)
            ) {
              useAOIStore.getState().updateAoi(updated.id, { geometry: updated.geometry })
            }
          })

          // Remove the drawn line
          if (draw.current) {
            draw.current.delete(feature.id)
            setTimeout(() => {
              draw.current?.changeMode('draw_line_string')
            }, 100)
          }
        } else {
          console.log('No reshape occurred.')
          if (draw.current) {
            draw.current.delete(feature.id)
            setTimeout(() => {
              draw.current?.changeMode('draw_line_string')
            }, 100)
          }
        }

        return
      }

      // Normal Polygon Creation
      setPendingAoi({
        id: feature.id as string,
        geometry: feature.geometry,
      })
      setActiveTool('edit')
    },
    [setPendingAoi, setActiveTool, activeTool, aois]
  )

  const onDrawUpdate = useCallback((e: any) => {
    const feature = e.features[0]
    if (feature) {
      useAOIStore.getState().updateAoi(String(feature.id), { geometry: feature.geometry })
    }
  }, [])

  const onDrawDelete = useCallback((e: any) => {
    const features = e.features
    features.forEach((f: any) => {
      useAOIStore.getState().removeAoi(String(f.id))
    })
  }, [])

  const onDrawSelectionChange = useCallback(
    (e: any) => {
      if (activeTool === 'erase' && e.features.length > 0) {
        const featureIds = e.features.map((f: any) => String(f.id))

        // Delete from Draw
        if (draw.current) {
          draw.current.delete(featureIds)
          // Trigger store update manually
          featureIds.forEach((id: string) => useAOIStore.getState().removeAoi(id))
        }
      }
    },
    [activeTool]
  )

  // Register selection change listener
  useEffect(() => {
    if (!map.current) return
    map.current.on('draw.selectionchange', onDrawSelectionChange)
    return () => {
      map.current?.off('draw.selectionchange', onDrawSelectionChange)
    }
  }, [onDrawSelectionChange])

  const handleZoomIn = () => {
    map.current?.zoomIn()
  }

  const handleZoomOut = () => {
    map.current?.zoomOut()
  }

  return (
    <div className="relative flex-1 h-full w-full">
      <div
        ref={mapContainer}
        id="map"
        className="absolute inset-0 bg-[#f0ede8]"
        style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', height: '100%' }}
      />

      {/* Drawing Tools Panel */}
      {(isDrawing || activeTool) && <DrawingTools />}

      {/* Custom Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
        <button
          onClick={handleFullScreen}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 text-gray-700 transition-colors"
          aria-label={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        >
          {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
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
