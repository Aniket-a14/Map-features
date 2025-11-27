# Map Application Upgrade

This project is a React-based single-page application for creating and managing Areas of Interest (AOIs) on a map. It features satellite imagery from NRW WMS, polygon drawing capabilities, and a modern UI.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (recommended) or npm

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Running Tests
```bash
# Run Unit Tests (Vitest)
pnpm test

# Run End-to-End Tests (Playwright)
npx playwright test
```

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Map Engine**: MapLibre GL JS
- **State Management**: Zustand
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Geocoding**: Nominatim API (via Axios)

## 🗺 Map Library Choice
**Selected: MapLibre GL JS**

I chose MapLibre GL JS over Leaflet for the following reasons:
1.  **Vector Tiles & Performance**: MapLibre is WebGL-based, making it significantly more performant for rendering large datasets (e.g., "1000s of points/polygons") compared to Leaflet's DOM-based rendering.
2.  **Modern Ecosystem**: It supports modern map styling specifications and has a robust ecosystem for vector data.
3.  **3D Capabilities**: While not strictly required now, it opens the door for 3D terrain or building visualization in the future.

**Alternatives Considered:**
-   **Leaflet**: Good for simple raster maps, but struggles with performance on large vector datasets.
-   **OpenLayers**: Powerful but has a steeper learning curve and larger bundle size.

## 🏗 Architecture Decisions
-   **Zustand for State**: Used for global state management (AOIs, drawing mode, layer visibility). It's lightweight, boilerplate-free, and supports persistence out of the box.
-   **Component Structure**:
    -   `MapView`: Encapsulates all map logic (initialization, drawing, layers).
    -   `Sidebar` & `AreaOfInterestPanel`: Handle UI interactions and drive map state via the store.
    -   `SearchBar`: Independent component for geocoding.
-   **Separation of Concerns**: The map component reacts to state changes (e.g., `flyToLocation`, `layerVisible`) rather than being imperatively controlled by other components directly.

## ⚡ Performance Considerations
To handle **1000s of points/polygons** in the future:
1.  **WebGL Rendering**: MapLibre handles large vector sources efficiently.
2.  **GeoJSON Source**: Instead of adding individual markers, we would use a single `GeoJSONSource` and update its data. MapLibre can render thousands of features in a single layer call.
3.  **Clustering**: For points, MapLibre's built-in clustering can be enabled on the source to improve readability and performance at low zoom levels.

## 🧪 Testing Strategy
-   **Unit Tests (Vitest)**: Focused on UI components (`Sidebar`) to ensure they render correctly and trigger store actions. This ensures the UI logic is sound independent of the map.
-   **E2E Tests (Playwright)**: Critical for testing the integration of the Map, Store, and UI. Since the map relies on WebGL and canvas interactions, E2E tests are the best way to verify that drawing an AOI actually works from a user's perspective.

## ⚖️ Tradeoffs
-   **Mapbox Draw Styles**: `mapbox-gl-draw` has some compatibility quirks with MapLibre v5 (specifically `line-dasharray`). I had to patch the styles manually to ensure they render correctly without errors.
-   **Nominatim API**: Used the free OpenStreetMap Nominatim API for geocoding. It has rate limits and shouldn't be used for heavy production loads without a dedicated instance or paid service.

## 🚀 Production Readiness
To make this production-ready, I would:
1.  **Error Boundary**: Wrap the Map component in a React Error Boundary to handle WebGL context losses or crashes gracefully.
2.  **API Proxy**: Proxy geocoding requests through a backend to hide API keys (if using a paid service) and implement caching.
3.  **Virtualization**: If the AOI list grows to thousands, implement list virtualization (e.g., `react-window`) in the sidebar.
4.  **CI/CD**: Set up GitHub Actions to run tests and linting on push.

## ⏱ Time Spent
-   **Setup & Migration**: ~30 mins
-   **Map Implementation**: ~45 mins
-   **State Management**: ~30 mins
-   **Bonus Features (Search, Controls)**: ~30 mins
-   **Testing & Debugging**: ~45 mins
-   **Documentation**: ~15 mins
