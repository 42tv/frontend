import React from 'react';

interface FanBroadcastFieldProps {
    isFanClub: boolean;
    fanLevel: number;
    onFanClubChange: (value: boolean) => void;
    onFanLevelChange: (value: number) => void;
}

const FanBroadcastField: React.FC<FanBroadcastFieldProps> = ({
    isFanClub,
    fanLevel,
    onFanClubChange,
    onFanLevelChange
}) => {
    const fanLevels = [
        {value: 1, label: '브론즈'}, 
        {value: 2, label: '실버'}, 
        {value: 3, label: '골드'}, 
        {value: 4, label: '플레티넘'}, 
        {value: 5, label: '다이아'}
    ];

    return (
        <div className="grid grid-cols-6 my-2">
            <div className="flex col-span-1 text-center items-center">
                <label className="w-[100px] text-text-primary">팬방송</label>
            </div>
            <div className="flex col-span-5 items-center">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="fanBroadcast"
                        checked={isFanClub}
                        onChange={(e) => onFanClubChange(e.target.checked)}
                        className="h-4 w-4 focus:outline-none accent-primary"
                    />
                </div>
                {isFanClub && (
                    <div className="flex items-center ml-4 space-x-3">
                        {fanLevels.map((level) => (
                            <label key={level.value} className="flex items-center">
                                <input
                                    type="radio"
                                    name="fanBroadcastLevel"
                                    value={level.value}
                                    checked={fanLevel === level.value}
                                    onChange={(e) => onFanLevelChange(parseInt(e.target.value))}
                                    className="h-4 w-4 mr-1 focus:outline-none accent-primary"
                                />
                                <span className="text-text-primary">{level.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FanBroadcastField;