import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <span className="mr-2 text-sm">방송중 BJ</span>
    <div
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 flex items-center bg-bg-tertiary dark:bg-bg-tertiary-dark rounded-full p-1 duration-300 ${
        checked ? 'bg-success dark:bg-success-dark' : ''
      }`}
    >
      <div
        className={`bg-bg-primary dark:bg-bg-primary-dark w-4 h-4 rounded-full shadow-md transform duration-300 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </div>
  </label>
);

export default ToggleSwitch;
