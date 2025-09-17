import React from 'react';

interface AdultBroadcastFieldProps {
    isAdult: boolean;
    onAdultChange: (value: boolean) => void;
}

const AdultBroadcastField: React.FC<AdultBroadcastFieldProps> = ({
    isAdult,
    onAdultChange
}) => {
    return (
        <div className="grid grid-cols-6 my-2">
            <div className="flex col-span-1 text-center items-center">
                <label className="w-[100px] text-text-primary">성인방송</label>
            </div>
            <div className="flex flex-col col-span-5 justify-center">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="adultBroadcast"
                        checked={isAdult}
                        onChange={(e) => onAdultChange(e.target.checked)}
                        className="h-4 w-4 focus:outline-none"
                        style={{ accentColor: 'var(--accent)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdultBroadcastField;