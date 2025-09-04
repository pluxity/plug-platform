import type { GroupSearchFormProps, GroupSearchFormRef, GroupSearchGroup } from './GroupSearchForm.types';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
function clsx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(' ');
}

function flattenCount<T>(groups: GroupSearchGroup<T>[]) {
  return groups.reduce((total, group) => total + (group.items?.length ?? 0), 0);
}

function DefaultEmpty({ text }: { text: string }) { return (<div className="px-4 py-3 text-gray-500 text-center">{text}</div>); }

function useControlledOpen({ isOpen, defaultOpen, onOpenChange }: { isOpen?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpenState, setInternalOpenState] = useState<boolean>(!!defaultOpen);
  const open = isOpen ?? internalOpenState;
  const setOpen = (nextOpen: boolean) => {
    if (isOpen === undefined) setInternalOpenState(nextOpen);
    onOpenChange?.(nextOpen);
  };
  return [open, setOpen] as const;
}

const GroupSearchFormInner = <T,>(
  {
    value,
    onValueChange,
    groups,
    renderItem,
    onSelect,
    getItemKey,
    placeholder = '검색어를 입력하세요...',
    emptyText = '검색 결과가 없습니다.',
    disabled,
    className,
    dropdownClassName,
    showCount = true,
    isOpen: controlledOpen,
    defaultOpen,
    onOpenChange,
  }: GroupSearchFormProps<T>,
  ref: React.Ref<GroupSearchFormRef>
) => {
  const [open, setOpen] = useControlledOpen({ isOpen: controlledOpen, defaultOpen, onOpenChange });
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalCount = useMemo(() => flattenCount(groups), [groups]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    clear: () => onValueChange(''),
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
  }), [onValueChange, setOpen]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onValueChange(nextValue);
    const meetsMinLength = nextValue.trim().length >= 2;
    if (!open && meetsMinLength) setOpen(true);
    if (open && !meetsMinLength) setOpen(false);
  };

  const handleKeyDown = (keyboardEvent: React.KeyboardEvent) => {
    if (keyboardEvent.key === 'Escape') setOpen(false);
  };

  const handleFocus = () => {
    const meetsMinLength = value.trim().length >= 2;
    if (meetsMinLength && totalCount > 0) setOpen(true);
  };

  return (
  <div ref={rootRef} className={clsx('relative w-96', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {value ? (
            <button
              onClick={() => onValueChange('')}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {open && (
        <div className={clsx('absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto', dropdownClassName)}>
          {showCount && totalCount > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
              {totalCount}개의 결과가 있습니다
            </div>
          )}

          {groups.map((group, groupIndex) => (
            <div key={`${group.heading}-${groupIndex}`} className="py-1">
              <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wide">{group.heading}</div>
              {group.items.map((item, itemIndex) => {
                const itemKey = (getItemKey?.(item, groupIndex, itemIndex)) ?? `${group.heading}-${itemIndex}`;
                return (
                  <button
                    key={itemKey}
                    onClick={() => onSelect?.(item, { group, groupIndex, itemIndex })}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    {renderItem(item, { group, groupIndex, itemIndex })}
                  </button>
                );
              })}
            </div>
          ))}

          {totalCount === 0 && (
            <DefaultEmpty text={emptyText} />
          )}
        </div>
      )}
    </div>
  )
}

const GroupSearchForm = forwardRef(GroupSearchFormInner) as <T>(
  props: GroupSearchFormProps<T> & { ref?: React.Ref<GroupSearchFormRef> }
) => React.ReactElement;

export default GroupSearchForm;
