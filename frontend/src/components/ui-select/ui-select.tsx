import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useClickOutside } from '@/hooks';
import './ui-select.css';

export interface UISelectOption {
  name: string;
  value: string;
}

interface UISelectProps {
  options: UISelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const UISelect: React.FC<UISelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = filter 
    ? options.filter(o => o.name.toLowerCase().includes(filter.toLowerCase()))
    : options;

  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPosition(spaceBelow < 250 && rect.top > spaceBelow ? 'top' : 'bottom');
  };

  const open = () => {
    setIsOpen(true);
    setFilter('');
    setHighlightedIndex(-1);
    updatePosition();
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setFilter('');
    setHighlightedIndex(-1);
  }, []);

  const select = (val: string) => {
    onChange?.(val);
    close();
  };

  const scrollOptionIntoView = (idx: number) => {
    if (idx >= 0 && dropdownRef.current) {
      const el = dropdownRef.current.children[idx] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) open();
        else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          select(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) open();
        else setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) open();
        else setHighlightedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Tab':
        close();
        break;
    }
  };

  // scroll selected option into view
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (value) {
        const selectedIndex = options.findIndex(o => o.value === value);
        scrollOptionIntoView(selectedIndex);
      }
    }
  }, [isOpen, value, options]);

  // scroll highlighted option into view
  useEffect(() => {
    scrollOptionIntoView(highlightedIndex);
  }, [highlightedIndex]);

  useClickOutside(containerRef, close);

  return (
    <div ref={containerRef} className={`ui-select ${isOpen ? 'ui-select--open' : ''}`} onKeyDown={handleKeyDown}>
      <div className="ui-select__trigger" onClick={() => isOpen ? close() : open()} tabIndex={0}>
        {isOpen ? (
          <input
            ref={inputRef}
            className="ui-select__input"
            value={filter}
            onChange={e => { setFilter(e.target.value); setHighlightedIndex(0); }}
            onClick={e => e.stopPropagation()}
            placeholder={selectedOption?.name || placeholder}
          />
        ) : (
          <span className="ui-select__value">{selectedOption?.name || placeholder}</span>
        )}
        <div className="ui-select__controls">
          {filter && (
            <span className="ui-select__clear" onClick={e => { e.stopPropagation(); setFilter(''); }}>×</span>
          )}
          <span className={`ui-select__arrow ${isOpen ? 'ui-select__arrow--up' : ''}`}>▼</span>
        </div>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={`ui-select__dropdown ui-select__dropdown--${position}`}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div
                key={opt.value}
                className={`ui-select__option ${opt.value === value ? 'ui-select__option--selected' : ''} ${i === highlightedIndex ? 'ui-select__option--highlighted' : ''}`}
                onClick={() => select(opt.value)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                {opt.name}
              </div>
            ))
          ) : (
            <div className="ui-select__empty">Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
};
