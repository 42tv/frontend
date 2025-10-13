import { FanLevel as FanLevelType } from '../../_types/ui';

interface FanLevelProps {
  fanLevels?: FanLevelType[];
}

export default function FanLevel({ fanLevels = [] }: FanLevelProps) {

  const formatDonation = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {fanLevels.length === 0 ? (
          <div className="text-center py-16 bg-background-secondary dark:bg-background-secondary-dark rounded-xl">
            <div className="text-text-secondary dark:text-text-secondary-dark">
              <svg className="w-20 h-20 mx-auto mb-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-lg">설정된 팬 등급이 없습니다</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {fanLevels
              .sort((a, b) => b.min_donation - a.min_donation)
              .map((level) => (
                <div
                  key={level.id}
                  className="bg-white dark:bg-gray-800 border border-border-primary dark:border-border-primary-dark rounded-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-full shadow-lg border-3 border-white dark:border-gray-700"
                          style={{ backgroundColor: level.color }}
                        ></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                      </div>
                      
                      <div>
                        <h3 
                          className="text-2xl font-bold"
                          style={{ color: level.color }}
                        >
                          {level.name}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">
                        {formatDonation(level.min_donation)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}