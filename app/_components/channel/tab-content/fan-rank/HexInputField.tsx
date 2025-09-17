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
      <label htmlFor="hex-input" className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-200)' }}>
        HEX 색상 코드
      </label>
      <div className="flex items-center rounded-lg px-3 py-2 transition-colors" style={{ backgroundColor: 'var(--bg-100)', border: '1px solid var(--bg-300)' }} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-100)'} onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg-300)'}>
        <span className="font-mono text-sm mr-1" style={{ color: 'var(--text-100)' }}>#</span>
        <input
          id="hex-input"
          ref={hexInputRef}
          type="text"
          value={hexInput}
          onChange={onHexInputChange}
          placeholder="000000"
          maxLength={6}
          className="bg-transparent border-none outline-none font-mono text-sm flex-1 uppercase"
          style={{ fontFamily: 'monospace', color: 'var(--text-100)' }}
          onFocus={(e) => e.currentTarget.parentElement!.style.borderColor = 'var(--primary-100)'}
          onBlur={(e) => e.currentTarget.parentElement!.style.borderColor = 'var(--bg-300)'}
        />
      </div>
    </div>
  );
};
