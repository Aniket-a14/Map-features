import { useAOIStore, type ActiveTool } from '../store/useAOIStore'
import { DrawIcon, EditIcon, EraseIcon, SelectIcon, MarqueeIcon } from './custom-icons'

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
    <div className="absolute bottom-48 right-8 flex flex-col gap-2 z-10">
      <div className="flex flex-col bg-white rounded-lg shadow-md p-1 gap-1">
        <ToolButton
          icon={<DrawIcon className="w-6 h-6" />}
          label="Draw Polygon"
          isActive={activeTool === 'draw'}
          onClick={() => handleToolClick('draw')}
        />
        <ToolButton
          icon={<EditIcon className="w-6 h-6" />}
          label="Adjust Edges"
          isActive={activeTool === 'edit'}
          onClick={() => handleToolClick('edit')}
        />
        <ToolButton
          icon={<EraseIcon className="w-6 h-6" />}
          label="Erase Shapes"
          isActive={activeTool === 'erase'}
          onClick={() => handleToolClick('erase')}
        />
        <div className="h-px bg-gray-200 my-1" /> {/* Separator */}
        <ToolButton
          icon={<SelectIcon className="w-6 h-6" />}
          label="Select"
          isActive={activeTool === null}
          onClick={() => handleToolClick(null)}
        />
        <ToolButton
          icon={<MarqueeIcon className="w-6 h-6" />}
          label="Marquee Select (Coming Soon)"
          isActive={false}
          onClick={() => { }}
          disabled={true}
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
      className={`flex items-center justify-center w-12 h-12 rounded-md transition-colors ${isActive
        ? 'text-[#e07b39] bg-[#f3eadd]'
        : 'text-[#e07b39] hover:bg-[#f3eadd]/50'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}
