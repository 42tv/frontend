import React from 'react';
import { FanLevel } from "@/app/_types";
import { FanLevelItem } from "../FanLevelItem";

interface FanLevelListProps {
    fanLevels: FanLevel[];
    originalFanLevels: FanLevel[];
    colorStates: Record<number, { color: string; hexInput: string }>;
    previewLevelId: number | null;
    previewColor: string | null;
    colorPickerOpen: number | null;
    hexInput: string;
    onToggleColorPicker: (levelId: number) => void;
    onColorPreview: (levelId: number, newColor: string) => void;
    onColorConfirm: () => void;
    onColorCancel: () => void;
    onCloseColorPicker: () => void;
    onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdate: (id: number, name?: string, minDonation?: number, color?: string) => { error?: string; success?: boolean };
}

const FanLevelList: React.FC<FanLevelListProps> = ({
    fanLevels,
    originalFanLevels,
    colorStates,
    previewLevelId,
    previewColor,
    colorPickerOpen,
    hexInput,
    onToggleColorPicker,
    onColorPreview,
    onColorConfirm,
    onColorCancel,
    onCloseColorPicker,
    onHexInputChange,
    onUpdate
}) => {
    return (
        <div className="space-y-3">
            {fanLevels.map((level, index) => {
                const currentColorState = colorStates[level.id];
                const originalLevel = originalFanLevels.find(orig => orig.id === level.id);
                return (
                    <FanLevelItem
                        key={level.id}
                        level={level}
                        index={index}
                        originalColor={originalLevel?.color || level.color}
                        previewLevelId={previewLevelId}
                        previewColor={previewColor}
                        colorPickerOpen={colorPickerOpen}
                        hexInput={hexInput}
                        colorState={currentColorState}
                        onToggleColorPicker={onToggleColorPicker}
                        onColorPreview={onColorPreview}
                        onColorConfirm={onColorConfirm}
                        onColorCancel={onColorCancel}
                        onCloseColorPicker={onCloseColorPicker}
                        onHexInputChange={onHexInputChange}
                        onUpdate={onUpdate}
                    />
                );
            })}
        </div>
    );
};

export default FanLevelList;