import React from 'react';

const HelpText: React.FC = () => {
    return (
        <div className="mt-6 text-sm text-gray-400">
            * 스트림키를 클릭하여 복사할 수 있습니다.<br />
            * 방송 설정 변경 후 &apos;저장하기&apos; 버튼을 클릭하면 설정이 적용됩니다.<br />
            * 스트림키 재발급 시 기존 방송이 중단될 수 있습니다.
        </div>
    );
};

export default HelpText;