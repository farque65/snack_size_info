import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface MobileDropdownProps {
  label?: string;
  options: { id: string; name: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}

const MobileDropdown = ({ 
  label = "Select option", 
  options,
  value,
  onChange
}: MobileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = value ? options.find(opt => opt.id === value)?.name : label;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-gray-50"
      >
        <span className="text-gray-700">{selectedOption}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <button
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-lg border-b"
          >
            All Images
          </button>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 last:rounded-b-lg border-b last:border-b-0"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDropdown;