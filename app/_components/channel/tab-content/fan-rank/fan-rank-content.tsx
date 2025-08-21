'use client';
import React from "react";
import { FanRankHeader } from "./FanRankHeader";
import { BulkUpdateButton } from "./BulkUpdateButton";
import { openModal } from "@/app/_components/utils/overlay/overlayHelpers";
import ErrorMessage from "@/app/_components/modals/error_component";
import { useFanRankState } from "./components/useFanRankState";
import { useColorPicker } from "./components/useColorPicker";
import FanLevelList from "./components/FanLevelList";
import HelpText from "./components/HelpText";

export const FanRankContent = () => {
    const {
        fanLevels,
        originalFanLevels,
        loading,
        error,
        colorStates,
        isUpdating,
        hasChanges,
        setFanLevels,
        setColorStates,
        handleUpdate,
        handleBulkUpdate
    } = useFanRankState();

    const {
        colorPickerOpen,
        previewColor,
        previewLevelId,
        hexInput,
        setColorPickerOpen,
        toggleColorPicker,
        handleColorPreview,
        handleColorConfirm,
        handleColorCancel,
        handleHexInputChange
    } = useColorPicker({
        fanLevels,
        colorStates,
        setFanLevels,
        setColorStates
    });

    const handleUpdateWithErrorHandling = (id: number, name?: string, minDonation?: number, color?: string) => {
        const result = handleUpdate(id, name, minDonation, color);
        if (result.error) {
            openModal(<ErrorMessage message={result.error} />, { closeButtonSize: "w-[16px] h-[16px]" });
        }
        return result;
    };

    const handleBulkUpdateWithErrorHandling = async () => {
        const result = await handleBulkUpdate();
        if (result.error) {
            const errorMessage = (result.error as { response?: { data?: { message?: string } } })?.response?.data?.message || '일괄 업데이트 중 오류가 발생했습니다.';
            openModal(<ErrorMessage message={errorMessage} />, { closeButtonSize: "w-[16px] h-[16px]" });
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류: {error}</div>;
    }

    return (
        <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
            <FanRankHeader title="팬 등급 관리" />

            <FanLevelList
                fanLevels={fanLevels}
                originalFanLevels={originalFanLevels}
                colorStates={colorStates}
                previewLevelId={previewLevelId}
                previewColor={previewColor}
                colorPickerOpen={colorPickerOpen}
                hexInput={hexInput}
                onToggleColorPicker={toggleColorPicker}
                onColorPreview={handleColorPreview}
                onColorConfirm={handleColorConfirm}
                onColorCancel={handleColorCancel}
                onCloseColorPicker={() => setColorPickerOpen(null)}
                onHexInputChange={handleHexInputChange}
                onUpdate={handleUpdateWithErrorHandling}
            />
            
            <BulkUpdateButton 
                onBulkUpdate={handleBulkUpdateWithErrorHandling}
                isUpdating={isUpdating}
                hasChanges={hasChanges}
            />

            <HelpText showHelp={fanLevels.length > 0} />
        </div>
    );
};