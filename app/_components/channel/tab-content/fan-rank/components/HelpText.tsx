import React from 'react';

interface HelpTextProps {
    showHelp: boolean;
}

const HelpText: React.FC<HelpTextProps> = ({ showHelp }) => {
    if (!showHelp) return null;

    return (
        <div className="mt-6 text-sm text-text-secondary">
            * 등급명을 클릭하여 이름을 변경할 수 있습니다.<br />
            * 색상 원을 클릭하여 등급별 색상을 변경할 수 있습니다.<br />
            * &apos;전체 적용&apos; 버튼을 클릭하면 모든 변경사항이 서버에 저장됩니다.
        </div>
    );
};

export default HelpText;