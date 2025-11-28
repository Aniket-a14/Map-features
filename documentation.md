# Documentation

## Setup Steps

1.  **Prerequisites:**
    *   Node.js (v18 or higher recommended)
    *   pnpm (recommended) or npm

2.  **Installation:**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Running Locally:**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```
    The application will start at `http://localhost:5173`.

4.  **Environment Variables:**
    *   Currently, no `.env` file is required for the core functionality as the app uses public APIs (Nominatim) and client-side storage.

## ER Diagram / Schema Overview

The application uses a client-side store (Zustand) to manage state. The core entity is the **Area of Interest (AOI)**.

![ER Diagram](./src/assets/er_diagram.png)

## API Documentation

The application is primarily client-side but interacts with external APIs.

### External APIs

#### Nominatim (OpenStreetMap)
*   **Endpoint:** `https://nominatim.openstreetmap.org/search`
*   **Method:** `GET`
*   **Purpose:** Geocoding (converting location names to coordinates).
*   **Parameters:**
    *   `q`: Query string (e.g., "Cologne")
    *   `format`: `json`
*   **Example Response:**
    ```json
    [
      {
        "place_id": 298436321,
        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
        "osm_type": "relation",
        "osm_id": 62578,
        "boundingbox": ["50.8304399", "51.0849743", "6.7725303", "7.162028"],
        "lat": "50.938361",
        "lon": "6.959974",
        "display_name": "Cologne, North Rhine-Westphalia, Germany",
        "class": "boundary",
        "type": "administrative",
        "importance": 0.7466887581622333
      }
    ]
    ```

# README Documentation

## Map Library Choice
**Selected Library:** `maplibre-gl` with `@mapbox/mapbox-gl-draw`.

*   **Why:** `maplibre-gl` is a high-performance, open-source fork of Mapbox GL JS. It offers vector tile support, smooth WebGL rendering, and a rich ecosystem without the licensing costs/restrictions of Mapbox GL JS v2+.
*   **Alternatives:**
    *   *Leaflet:* Simpler but less performant for large datasets (DOM-based vs. WebGL).
    *   *OpenLayers:* Powerful but steeper learning curve and larger bundle size.
    *   *Google Maps:* Expensive and restrictive customization compared to MapLibre.

## Architecture Decisions
**Structure:** Component-based React architecture with Zustand for state management.

*   **State Management (Zustand):** Chosen for its simplicity and minimal boilerplate compared to Redux. It handles cross-component state (like map interactions triggering UI updates) effectively.
*   **Styling (Tailwind CSS):** Enables rapid UI development with a utility-first approach, ensuring consistency and easy responsiveness.
*   **Separation of Concerns:**
    *   `components/`: UI components (Map, Sidebar, Search).
    *   `store/`: Business logic and state.
    *   `hooks/`: Custom hooks (if any) for reusable logic.

## Performance Considerations
*   **WebGL Rendering:** `maplibre-gl` uses WebGL, which allows rendering thousands of points/polygons smoothly by leveraging the GPU.
*   **GeoJSON Source Updates:** The map updates are optimized by modifying the GeoJSON source data rather than re-rendering the entire map.
*   **Future Scaling:** For 1000s of polygons, we can implement:
    *   **Clustering:** Grouping nearby points at lower zoom levels.
    *   **Tiled Sources:** Serving data as vector tiles (MVT) instead of a single large GeoJSON file if the dataset grows too large for client-side memory.

## Testing Strategy
*   **Unit Testing (Vitest):** Used for testing utility functions and isolated component logic.
*   **E2E Testing (Playwright):** Critical for map applications to verify user interactions like drawing, zooming, and searching, which are hard to mock in unit tests.
*   **What would be tested with more time:**
    *   More comprehensive E2E scenarios (e.g., complex polygon editing).
    *   Visual regression testing to ensure map styles don't break.
    *   Mocking API responses for more reliable tests.

## Tradeoffs Made
*   **Client-Side Storage:** Currently using `localStorage` (via Zustand persist) for simplicity. This means data isn't shared across devices. A backend would be needed for true persistence.
*   **Nominatim API:** Used the free OpenStreetMap geocoder. It has rate limits and usage policies. For a production app with high traffic, a paid geocoding service (like Mapbox or Google) or a self-hosted Pelias instance would be better.
*   **Edge Editing:** The actual edit edges features is not implemented correctly, and can differ from the actual design.

## Production Readiness
To make this production-ready, I would:
1.  **Backend Integration:** Implement a backend (e.g., Node.js/PostgreSQL with PostGIS) to save AOIs permanently.
2.  **Error Handling:** Improve error boundaries and user feedback for API failures.
3.  **CI/CD:** Set up GitHub Actions for automated testing and deployment.
4.  **Optimization:** Enable code splitting and lazy loading for heavy components (like the map library).
5.  **Accessibility:** Ensure all map controls and inputs are fully keyboard and screen-reader accessible.

## Time Spent
*   **Exploration & Planning:** ~15%
*   **Implementation (Map & UI):** ~50% (Main time spent on implementation of drawing tools features and area of interest panel, it's hard, and can differ a bit)
*   **State Management Integration:** ~20%
*   **Refining & Polishing:** ~15%
