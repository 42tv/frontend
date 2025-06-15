'use client';
import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { FanLevel } from "@/app/_components/utils/interfaces";
import { getFanLevels, updateFanLevel } from "@/app/_apis/user";

export const FanRankContent = () => {
  const [fanLevels, setFanLevels] = useState<FanLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState<number | null>(null);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [previewLevelId, setPreviewLevelId] = useState<number | null>(null);
  const [hexInput, setHexInput] = useState<string>('');
  const hexInputRef = useRef<HTMLInputElement>(null); // hex-input 참조 추가

  // 팬 등급 데이터 로드
  useEffect(() => {
    loadFanLevels();
  }, []);

  // 색상 선택기 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.color-picker-container')) {
        setColorPickerOpen(null);
      }
    };

    if (colorPickerOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [colorPickerOpen]);

  // hexInput 상태가 변경되거나 colorPicker가 열릴 때 포커스 설정
  useEffect(() => {
    if (colorPickerOpen !== null && hexInputRef.current) {
      // 포커스를 설정하기 전에 현재 활성 요소가 hexInputRef.current인지 확인 (선택 사항)
      // 이렇게 하면 사용자가 다른 곳을 클릭했을 때 강제로 포커스를 옮기는 것을 방지할 수 있습니다.
      // 하지만, 이 문제의 경우 사용자가 HEX 입력을 계속하기를 원하므로, 이 확인 없이 바로 포커스를 설정합니다.
      hexInputRef.current.focus();
    }
  }, [hexInput, colorPickerOpen]); // hexInput과 colorPickerOpen을 의존성 배열에 추가

  const loadFanLevels = async () => {
    try {
      setLoading(true);
      const response = await getFanLevels();
      console.log(response);
      setFanLevels(response);
      setError(null);
    } catch (err) {
      console.error('팬 등급 로드 실패:', err);
      setError('팬 등급을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 등급 수정
  const handleUpdate = async (id: number, name?: string, minDonation?: number, color?: string) => {
    const levelToUpdate = fanLevels.find(level => level.id === id);
    if (!levelToUpdate) return;

    const updateName = name !== undefined ? name : levelToUpdate.name;
    const updateMinDonation = minDonation !== undefined ? minDonation : levelToUpdate.min_donation;
    const updateColor = color !== undefined ? color : levelToUpdate.color;

    if (!updateName.trim() || updateMinDonation < 0) {
      alert('등급명과 최소 후원 금액을 올바르게 입력해주세요.');
      return;
    }

    try {
      await updateFanLevel(id, updateName, updateMinDonation, updateColor);
      await loadFanLevels();
    } catch (err) {
      console.error('팬 등급 수정 실패:', err);
      alert('팬 등급 수정에 실패했습니다.');
    }
  };

  // 색상 선택기 열기/닫기
  const toggleColorPicker = (levelId: number) => {
    const isOpening = colorPickerOpen !== levelId;
    setColorPickerOpen(isOpening ? levelId : null);
    setPreviewColor(null);
    setPreviewLevelId(null);
    
    if (isOpening) {
      const currentLevel = fanLevels.find(level => level.id === levelId);
      if (currentLevel) {
        setPreviewColor(currentLevel.color);
        setPreviewLevelId(levelId);
        // HEX 입력값을 현재 색상에서 # 제거한 값으로 설정
        setHexInput(currentLevel.color.replace('#', ''));
      }
    } else {
      setHexInput('');
    }
  };

  // 색상 미리보기 핸들러
  const handleColorPreview = (levelId: number, newColor: string) => {
    setPreviewColor(newColor);
    setPreviewLevelId(levelId);
    // HEX 입력값도 동기화
    setHexInput(newColor.replace('#', ''));
  };

  // 색상 변경 확정 핸들러
  const handleColorConfirm = () => {
    if (previewLevelId !== null && previewColor) {
      handleUpdate(previewLevelId, undefined, undefined, previewColor);
    }
    setColorPickerOpen(null);
    setPreviewColor(null);
    setPreviewLevelId(null);
  };

  // HEX 입력 핸들러
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (value.length <= 6) {
      setHexInput(value); // 이 부분은 유지
      if (value.length === 6 && previewLevelId !== null) {
        const hexColor = `#${value}`;
        // handleColorPreview를 직접 호출하는 대신, previewColor 상태만 업데이트
        // 이렇게 하면 handleColorPreview 내부의 setHexInput 호출로 인한 추가적인 리렌더링 및 포커스 문제를 피할 수 있습니다.
        setPreviewColor(hexColor);
      } else if (value.length < 6 && previewLevelId !== null) {
        // 사용자가 HEX 코드를 지우거나 수정 중일 때, 미리보기를 현재 입력값으로 업데이트 (선택 사항)
        // 예를 들어, #FFF 와 같이 3자리도 유효한 HEX 코드로 처리하거나,
        // 아니면 단순히 previewColor를 null로 설정하여 미리보기를 없앨 수 있습니다.
        // 여기서는 6자리가 아니면 previewColor를 업데이트하지 않도록 단순하게 둡니다.
        // 필요하다면, 부분적인 HEX 코드에 대한 미리보기 로직을 추가할 수 있습니다.
      }
    }
  };

  // 색상 선택기 컴포넌트
  const ColorPicker = ({ levelId, currentColor }: { levelId: number; currentColor: string }) => {
    if (colorPickerOpen !== levelId) return null;

    const displayColor = previewLevelId === levelId && previewColor ? previewColor : currentColor;
    const hasPreview = previewLevelId === levelId && previewColor && previewColor !== currentColor;

    return (
      <div className="absolute z-50 mt-2 p-6 bg-gray-800 border border-gray-600 rounded-xl shadow-xl left-0 top-full">
        <div className="text-lg text-gray-300 mb-5 font-medium">색상 선택</div>
        
        <div className="flex gap-6">
          {/* 색상 선택 영역 */}
          <div className="flex flex-col gap-4">
            {/* react-colorful 색상 선택기 */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-3 font-medium">정밀 색상 선택</div>
              <HexColorPicker 
                color={displayColor} 
                onChange={(color) => handleColorPreview(levelId, color)}
                style={{ width: '200px', height: '150px' }}
              />
              
              {/* HEX 입력 필드 */}
              <div className="mt-4">
                <label htmlFor="hex-input" className="block text-xs text-gray-400 mb-2 font-medium">HEX 색상 코드</label>
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
                  <span className="text-gray-300 font-mono text-sm mr-1">#</span>
                  <input
                    id="hex-input"
                    ref={hexInputRef} // ref 연결
                    type="text"
                    value={hexInput} // 상태 직접 사용
                    onChange={handleHexInputChange}
                    placeholder="000000"
                    maxLength={6}
                    className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 uppercase placeholder-gray-500"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 색상 비교 및 미리보기 영역 */}
          <div className="flex flex-col gap-4 min-w-[200px]">
            {/* 색상 비교 */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-3 font-medium">미리보기</div>
              <div className="flex items-center justify-center gap-4">
                {/* 현재 색상 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">현재</span>
                  <div 
                    className="w-16 h-16 rounded-xl border-2 border-gray-600 shadow-lg"
                    style={{ backgroundColor: currentColor }}
                  />
                  <span className="text-xs text-gray-300 font-mono">{currentColor.toUpperCase()}</span>
                </div>
                
                {/* 화살표 */}
                <div className="text-gray-400 text-2xl">→</div>
                
                {/* 새 색상 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-yellow-400 font-medium">새 색상</span>
                  <div 
                    className={`w-16 h-16 rounded-xl border-2 shadow-lg ${
                      hasPreview ? 'border-yellow-400' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: displayColor }}
                  />
                  <span className={`text-xs font-mono ${
                    hasPreview ? 'text-yellow-300' : 'text-gray-300'
                  }`}>
                    {displayColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* 확인/취소 버튼 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleColorConfirm}
                disabled={!hasPreview}
                className={`w-full px-5 py-3 text-white text-sm rounded-lg transition-colors font-medium ${
                  hasPreview 
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                적용
              </button>
              <button
                onClick={() => setColorPickerOpen(null)}
                className="w-full px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 후원 금액 기준으로 내림차순 정렬
  const sortedLevels = [...fanLevels].sort((a, b) => b.min_donation - a.min_donation);

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-white">팬 등급 관리</h3>
      </div>

      <div className="space-y-3">
        {/* 기존 등급 목록 */}
        {
          sortedLevels.map((level, index) => {
            const displayColor = previewLevelId === level.id && previewColor ? previewColor : level.color;
            
            return (
            <div key={level.id} className="bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors flex items-center gap-4 relative">
              <span className="font-bold text-lg text-white w-8 text-center flex-shrink-0">{index + 1}</span>
              <div className="relative color-picker-container">
                <button
                  onClick={() => toggleColorPicker(level.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 hover:scale-105 transition-transform cursor-pointer border-2 ${
                    previewLevelId === level.id && previewColor ? 'border-yellow-400' : 'border-transparent hover:border-gray-400'
                  }`} 
                  style={{ backgroundColor: displayColor }}
                  title="색상 변경하기"
                >
                  {level.name.charAt(0).toUpperCase()}
                </button>
                <ColorPicker levelId={level.id} currentColor={level.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {level.name}
                  {previewLevelId === level.id && previewColor && (
                    <span className="ml-2 text-xs text-yellow-400">(미리보기)</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="number"
                  value={level.min_donation}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    handleUpdate(level.id, level.name, newValue);
                  }}
                  className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-center text-white"
                />
              </div>
            </div>
            );
          })
        }
      </div>

      {sortedLevels.length > 0 && (
        <div className="mt-6 text-sm text-gray-400">
          * 등급은 후원 금액이 높은 순으로 정렬됩니다.<br />
          * 색상 원을 클릭하여 등급별 색상을 변경할 수 있습니다.
        </div>
      )}
    </div>
  );
};
