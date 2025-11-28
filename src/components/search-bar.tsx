import { useState } from 'react'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useAOIStore } from '../store/useAOIStore'

interface SearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface SearchBarProps {
  className?: string
  placeholder?: string
  onResultSelect?: (result: SearchResult) => void
}

export function SearchBar({ className, placeholder, onResultSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [_isSearching, setIsSearching] = useState(false)
  const setFlyToLocation = useAOIStore((state) => state.setFlyToLocation)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await axios.get<SearchResult[]>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      )
      setResults(response.data)
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (result: SearchResult) => {
    setFlyToLocation({
      center: [parseFloat(result.lon), parseFloat(result.lat)],
      zoom: 13,
    })
    setResults([])
    setQuery(result.display_name) // Update input with selected name

    if (onResultSelect) {
      onResultSelect(result)
    }
  }

  return (
    <div className={`relative w-full ${className || 'mb-4'}`}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search location...'}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:outline-none bg-transparent text-[16px]"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </form>

      {results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] border-b last:border-b-0"
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
