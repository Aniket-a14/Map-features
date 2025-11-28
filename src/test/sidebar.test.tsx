import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '../components/sidebar'
import { useAOIStore } from '../store/useAOIStore'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the store
vi.mock('../store/useAOIStore', () => ({
  useAOIStore: vi.fn(),
}))

describe('Sidebar', () => {
  const toggleLayerMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementation
    ;(useAOIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
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
    ;(useAOIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      layerVisible: true,
      toggleLayer: toggleLayerMock,
    })

    render(<Sidebar />)
    const toggleButton = screen.getByLabelText('Toggle Layers')
    // Check for the active class or color (simplified check)
    expect(toggleButton).toHaveClass('text-[#e07b39]')
  })
})
