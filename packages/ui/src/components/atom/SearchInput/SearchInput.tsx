import { cn } from "../../../utils/utils";
import { SearchInputProps } from './SearchInput.types';

function SearchInput({
  className,
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      <div className="relative flex-1 max-w-md">
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-2 border  rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      {/*<Button className={cn("w-15", buttonClassName)} onClick={onSubmit}>검색</Button>*/}
    </div>
  );
}

SearchInput.displayName = 'SearchInput';

export { SearchInput };