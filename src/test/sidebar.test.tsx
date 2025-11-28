import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '../components/sidebar'
import { useAOIStore } from '../store/useAOIStore'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../store/useAOIStore', () => ({
  useAOIStore: vi.fn(),
}))

describe('Sidebar', () => {
  const toggleLayerMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
      ; (useAOIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        layerVisible: false,
        toggleLayer: toggleLayerMock,
      })
  })

  it('renders correctly', () => {
    render(<Sidebar />)
    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle Layers')).toBeInTheDocument()
  })

  it('toggles layer visibility on click', () => {
    render(<Sidebar />)
    const toggleButton = screen.getByLabelText('Toggle Layers')
    fireEvent.click(toggleButton)
    expect(toggleLayerMock).toHaveBeenCalledTimes(1)
  })

  it('shows active state when layer is visible', () => {
    ; (useAOIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      layerVisible: true,
      toggleLayer: toggleLayerMock,
    })

    render(<Sidebar />)
    const toggleButton = screen.getByLabelText('Toggle Layers')
    expect(toggleButton).toHaveClass('text-[#e07b39]')
  })
})

/**
 * Code Explanation:
 * Unit tests for the Sidebar component.
 * Verifies that the sidebar renders correctly and interactions (like clicking buttons) work as expected.
 *
 * What is Happening:
 * - Uses `vitest` and `@testing-library/react` for testing.
 * - Mocks `useAOIStore` to isolate component behavior.
 * - Tests rendering of logo and buttons.
 * - Tests layer toggle functionality.
 *
 * What to do Next:
 * - Add more tests for navigation interactions.
 * - Test accessibility (aria-labels, keyboard navigation).
 */
