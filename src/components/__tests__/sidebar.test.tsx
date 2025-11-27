import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Sidebar } from '../sidebar'
import { useAOIStore } from '../../store/useAOIStore'

// Mock the store
vi.mock('../../store/useAOIStore', () => ({
    useAOIStore: vi.fn(),
}))

describe('Sidebar', () => {
    const mockToggleLayer = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
            // Default mock implementation
            ; (useAOIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                layerVisible: true,
                toggleLayer: mockToggleLayer,
            })
    })

    it('renders correctly', () => {
        render(<Sidebar />)
        expect(screen.getByLabelText('Home')).toBeInTheDocument()
        expect(screen.getByLabelText('Toggle Layers')).toBeInTheDocument()
    })

    it('calls toggleLayer when layer button is clicked', () => {
        render(<Sidebar />)
        const toggleButton = screen.getByLabelText('Toggle Layers')
        fireEvent.click(toggleButton)
        expect(mockToggleLayer).toHaveBeenCalledTimes(1)
    })

    it('shows active state when layer is visible', () => {
        render(<Sidebar />)
        const toggleButton = screen.getByLabelText('Toggle Layers')
        expect(toggleButton).toHaveClass('bg-[#ede0d4]')
    })

    it('shows inactive state when layer is hidden', () => {
        ; (useAOIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            layerVisible: false,
            toggleLayer: mockToggleLayer,
        })
        render(<Sidebar />)
        const toggleButton = screen.getByLabelText('Toggle Layers')
        expect(toggleButton).not.toHaveClass('bg-[#ede0d4]')
    })
})
