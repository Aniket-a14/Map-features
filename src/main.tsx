import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

/**
 * Code Explanation:
 * Entry point of the React application.
 * It finds the root element in the DOM and renders the App component within StrictMode.
 *
 * What is Happening:
 * - Imports global styles (index.css).
 * - Mounts the App component to the 'root' div.
 *
 * What to do Next:
 * - Add global providers (e.g., ThemeProvider, QueryClientProvider) here.
 * - Configure error boundaries.
 */
