import { MousePointer2, Trash2, Pentagon } from 'lucide-react'
import { useAOIStore, type ActiveTool } from '../store/useAOIStore'

export function DrawingTools() {
  const { activeTool, setActiveTool, setDrawing } = useAOIStore()

  const handleToolClick = (tool: ActiveTool) => {
    setActiveTool(tool)
    if (tool === 'draw') {
      setDrawing(true)
    } else {
      setDrawing(false)
    }
  }

  return (
    <div className="absolute bottom-36 right-8 flex flex-col gap-2 z-10">
      <div className="flex flex-col bg-white rounded-lg shadow-md p-1 gap-1">
        <ToolButton
          icon={<Pentagon className="w-6 h-6" fill="currentColor" />}
          label="Draw Polygon"
          isActive={activeTool === 'draw'}
          onClick={() => handleToolClick('draw')}
        />
        <ToolButton
          icon={<MousePointer2 className="w-6 h-6" fill="currentColor" />}
          label="Adjust Edges"
          isActive={activeTool === 'edit'}
          onClick={() => handleToolClick('edit')}
        />
        <ToolButton
          icon={<Trash2 className="w-6 h-6" fill="currentColor" />}
          label="Erase Shapes"
          isActive={activeTool === 'erase'}
          onClick={() => handleToolClick('erase')}
        />
      </div>
    </div>
  )
}

interface ToolButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  disabled?: boolean
}

function ToolButton({ icon, label, isActive, onClick, disabled }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-12 h-12 rounded-md transition-colors ${isActive ? 'text-[#e07b39]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}
