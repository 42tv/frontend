'use client';
import React, { useRef, useEffect } from "react";

interface HexInputFieldProps {
  hexInput: string;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
}

export const HexInputField: React.FC<HexInputFieldProps> = ({
  hexInput,
  onHexInputChange,
  isOpen
}) => {
  const hexInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && hexInputRef.current) {
      hexInputRef.current.focus();
    }
  }, [hexInput, isOpen]);

  return (
    <div className="mt-4">
      <label htmlFor="hex-input" className="block text-xs text-gray-400 mb-2 font-medium">
        HEX 색상 코드
      </label>
      <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
        <span className="text-gray-300 font-mono text-sm mr-1">#</span>
        <input
          id="hex-input"
          ref={hexInputRef}
          type="text"
          value={hexInput}
          onChange={onHexInputChange}
          placeholder="000000"
          maxLength={6}
          className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 uppercase placeholder-gray-500"
          style={{ fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
};
