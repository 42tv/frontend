import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
  <label className="inline-flex cursor-pointer items-center gap-2">
    <span className="text-[13px] font-medium text-[#a0a0b0]">방송중만</span>
    <div
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-11 items-center rounded-full border p-1 transition-all duration-300 ${
        checked ? 'border-accent bg-accent' : 'border-[#3e3e50] bg-[#20202a]'
      }`}
    >
      <div
        className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </div>
  </label>
);

export default ToggleSwitch;
