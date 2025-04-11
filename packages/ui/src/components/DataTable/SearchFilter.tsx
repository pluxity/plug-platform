import { SearchFilterProps } from './DataTable.types'

const SearchFilter = ({ search, onSearchChange }: SearchFilterProps) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}

export default SearchFilter