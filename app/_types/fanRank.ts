import { FanLevel } from './ui';

export interface BulkUpdateButtonProps {
  onBulkUpdate: () => void;
  isUpdating: boolean;
  hasChanges: boolean;
}

export interface ColorPickerProps {
  levelId: number;
  currentColor: string;
  colorPickerOpen: number | null;
  previewColor: string | null;
  previewLevelId: number | null;
  hexInput: string;
  onColorPreview: (levelId: number, color: string) => void;
  onColorConfirm: () => void;
  onClose: () => void;
  onCancel: () => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ColorPreviewProps {
  currentColor: string;
  displayColor: string;
  hasPreview: boolean;
  onResetToCurrentColor: () => void;
}

export interface FanLevelItemProps {
  level: FanLevel;
  index: number;
  originalColor: string;
  previewLevelId: number | null;
  previewColor: string | null;
  colorPickerOpen: number | null;
  hexInput: string;
  colorState?: { color: string; hexInput: string };
  onToggleColorPicker: (levelId: number) => void;
  onColorPreview: (levelId: number, color: string) => void;
  onColorConfirm: () => void;
  onColorCancel: () => void;
  onCloseColorPicker: () => void;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
}

export interface FanRankHeaderProps {
  title: string;
}

export interface HexInputFieldProps {
  hexInput: string;
  onHexInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
}
