import React from 'react';

interface AdultBroadcastFieldProps {
    isAdult: boolean;
    adultVerified: boolean;
    isAdultCategory: boolean;
    onAdultChange: (value: boolean) => void;
}

const AdultBroadcastField: React.FC<AdultBroadcastFieldProps> = ({
    isAdult,
    adultVerified,
    isAdultCategory,
    onAdultChange
}) => {
    // 성인인증 미완료 → 설정 불가 / ADULT 카테고리 → 해제 불가
    const disabled: boolean = !adultVerified || isAdultCategory;

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
                        disabled={disabled}
                        onChange={(e) => onAdultChange(e.target.checked)}
                        className="h-4 w-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ accentColor: 'var(--accent)' }}
                    />
                    {!adultVerified && (
                        <span className="text-xs text-text-secondary">
                            성인인증 완료 후 설정할 수 있습니다.
                        </span>
                    )}
                    {adultVerified && isAdultCategory && (
                        <span className="text-xs text-text-secondary">
                            성인 카테고리는 성인방송 설정이 필수입니다. 해제하려면 다른 카테고리를 선택해주세요.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdultBroadcastField;
