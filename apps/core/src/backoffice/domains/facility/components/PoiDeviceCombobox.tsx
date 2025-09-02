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
import { useDevicesSWR } from '@plug/common-services';

interface PoiDeviceComboboxProps {
  selectedDeviceId?: string;
  onDeviceSelect: (deviceId: string) => void;
  placeholder?: string;
  className?: string;
  groups?: {
    key: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFn?: (device: any) => boolean;
    maxItems?: number;
  }[];
  showSeparator?: boolean;
}

export function PoiDeviceCombobox({
  selectedDeviceId,
  onDeviceSelect,
  placeholder = "검색어를 입력하거나 선택하세요",
  className,
  groups = [], 
  showSeparator = true
}: PoiDeviceComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: devices } = useDevicesSWR();

  const selectedDevice = devices?.find(device => device.id === selectedDeviceId);

  const groupedDevices = groups.length > 0 ? groups.map(group => {
    const filteredDevices = devices?.filter(group.filterFn || (() => true)) || [];

    return {
      ...group,
      devices: filteredDevices
    };
  }) : [
    {
      key: 'all',
      title: '모든 장치',
      devices: devices || []
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
            w-full justify-between
            ${!selectedDeviceId && "text-muted-foreground"}
            ${className}
          `}
        >
          {selectedDeviceId ? (
            <>{selectedDevice?.name || selectedDeviceId}</>
          ) : (
            <>{placeholder}</>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            
            {groupedDevices.map((group, index) => (
              <div key={group.key}>
                <CommandGroup heading={group.title}>
                  {group.devices.map((device) => (
                    <CommandItem key={device.id} value={device.id} onSelect={() => {
                      onDeviceSelect(device.id);
                      setOpen(false);
                    }}>
                      {device.name || device.id}
                      <Check
                        className={`ml-auto h-4 w-4 ${
                          selectedDeviceId === device.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
                
                {showSeparator && index < groupedDevices.length - 1 && (
                  <CommandSeparator />
                )}
              </div>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default PoiDeviceCombobox;