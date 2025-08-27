import { useState } from 'react';
import { Button } from '@plug/ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@plug/ui';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@plug/ui';
import { CctvResponse, DeviceResponse } from '@plug/common-services';

interface FeatureAssignComboboxProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  className?: string;
  items: CctvResponse[] | DeviceResponse[];
  groups?: {
    key: string;
    title: string;
    filterFn?: (item: CctvResponse | DeviceResponse) => boolean;
    maxItems?: number;
  }[];
  showSeparator?: boolean;
}

export function FeatureAssignCombobox({
  selectedId,
  onSelect,
  placeholder = "검색어를 입력하거나 선택하세요",
  className,
  items = [] as CctvResponse[] | DeviceResponse[],
  groups = [], 
  showSeparator = true
}: FeatureAssignComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find(item => item.id === selectedId);

  const groupedItems = groups.length > 0 ? groups.map(group => {
    let filteredItems = items.filter(group.filterFn || (() => true));
    
    return {  
      ...group,
      items: filteredItems
    };
  }) : [
    {
      key: 'all',
      title: '모든 장치',
      items: items
    }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`
           justify-between
            ${!selectedId && "text-muted-foreground"}
            ${className}
          `}
        >
          {selectedId ? (
            <>{selectedItem?.name || selectedId}</>
          ) : (
            <>{placeholder}</>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            {items.length === 0 ? (
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            ) : (    
              <>
                {groupedItems.map((group, index) => (
                  <div key={group.key}>
                    <CommandGroup heading={group.title}>
                      {group.items?.map((item) => (
                        <CommandItem key={item.name} value={item.name} onSelect={() => {
                          onSelect(item.id);
                          setOpen(false);
                        }}>
                          {item.name || item.id}
                          <Check
                            className={`ml-auto h-4 w-4 ${
                              selectedId === item.id ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    
                    {showSeparator && index < groupedItems.length - 1 && (
                      <CommandSeparator />
                    )}
                  </div>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FeatureAssignCombobox;