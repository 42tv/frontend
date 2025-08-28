import { FanLevel as FanLevelType } from '../../_types/ui';

interface FanLevelProps {
  fanLevels?: FanLevelType[];
}

export default function FanLevel({ fanLevels = [] }: FanLevelProps) {

  const formatDonation = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
          팬 등급 시스템
        </h2>
        <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
          총 {fanLevels.length}개 등급
        </div>
      </div>

      {fanLevels.length === 0 ? (
        <div className="text-center py-12 bg-background-secondary dark:bg-background-secondary-dark rounded-lg">
          <div className="text-text-secondary dark:text-text-secondary-dark mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            설정된 팬 등급이 없습니다.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {fanLevels
            .sort((a, b) => a.min_donation - b.min_donation)
            .map((level, index) => (
              <div
                key={level.id}
                className="border border-border-primary dark:border-border-primary-dark rounded-lg p-4 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-text-secondary dark:text-text-secondary-dark">
                        #{index + 1}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: level.color }}
                        title={`색상: ${level.color}`}
                      ></div>
                    </div>
                    
                    <div>
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: level.color }}
                      >
                        {level.name}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                        최소 후원금: {formatDonation(level.min_donation)}원
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm text-text-secondary dark:text-text-secondary-dark">
                      <div>등급 {index + 1}</div>
                      <div className="text-xs opacity-75">
                        {level.min_donation === 0 ? '기본 등급' : '후원 등급'}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {level.min_donation > 0 && (
                  <div className="mt-3 pt-3 border-t border-border-secondary dark:border-border-secondary-dark">
                    <div className="flex items-center text-sm text-text-secondary dark:text-text-secondary-dark">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      이 등급에 도달하려면 총 {formatDonation(level.min_donation)}원 이상 후원이 필요합니다.
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-background-secondary dark:bg-background-secondary-dark rounded-lg">
        <h3 className="font-medium text-text-primary dark:text-text-primary-dark mb-2">
          팬 등급 시스템 안내
        </h3>
        <div className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-1">
          <p>• 후원 금액에 따라 자동으로 팬 등급이 부여됩니다.</p>
          <p>• 높은 등급일수록 특별한 혜택과 권한을 받을 수 있습니다.</p>
          <p>• 등급별 색상으로 채팅에서 구별되어 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}