'use client';
import React from 'react';

interface UserInfo {
  idx: number;
  nickname: string;
  profileImg?: string;
  role: string;
}

interface CurrentUser {
  idx: number;
  role?: 'broadcaster' | 'manager' | 'viewer';
}

interface UserActionsModalProps {
  userInfo: UserInfo;
  currentUser: CurrentUser;
  onClose?: () => void;
  onKick?: (userIdx: number) => void;
  onBan?: (userIdx: number) => void;
  onUnban?: (userIdx: number) => void;
  onPromoteManager?: (userIdx: number) => void;
  onDemoteManager?: (userIdx: number) => void;
  onSendMessage?: (userIdx: number) => void;
}

const UserActionsModal: React.FC<UserActionsModalProps> = ({
  userInfo,
  currentUser,
  onClose,
  onKick,
  onBan,
  onUnban,
  onPromoteManager,
  onDemoteManager,
  onSendMessage,
}) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         onClick={onClose}>
      <div className="bg-bg-primary dark:bg-bg-primary-dark rounded-lg shadow-lg p-6 w-80 max-w-sm mx-4"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 overflow-hidden">
            {userInfo.profileImg ? (
              <img 
                src={userInfo.profileImg} 
                alt={`${userInfo.nickname} 프로필`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              {userInfo.nickname}
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {userInfo.role === 'broadcaster' ? '방송자' : 
               userInfo.role === 'manager' ? '매니저' : '시청자'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-4">
          {/* 쪽지 보내기 - 모든 사용자가 가능 */}
          {currentUser.idx !== userInfo.idx && onSendMessage && (
            <button
              onClick={() => {
                onSendMessage(userInfo.idx);
                onClose?.();
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              쪽지 보내기
            </button>
          )}

          {/* 관리자 권한이 필요한 액션들 */}
          {(currentUser.role === 'broadcaster' || currentUser.role === 'manager') && 
           currentUser.idx !== userInfo.idx && userInfo.role !== 'broadcaster' && (
            <>
              {/* 강퇴 */}
              {onKick && (
                <button
                  onClick={() => {
                    onKick(userInfo.idx);
                    onClose?.();
                  }}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  강퇴
                </button>
              )}

              {/* 차단/차단해제 */}
              {onBan && onUnban && (
                <button
                  onClick={() => {
                    // 현재는 차단 상태를 확인할 방법이 없으므로 차단으로 기본 설정
                    onBan(userInfo.idx);
                    onClose?.();
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  차단
                </button>
              )}
            </>
          )}

          {/* 방송자 전용 권한 */}
          {currentUser.role === 'broadcaster' && 
           currentUser.idx !== userInfo.idx && userInfo.role !== 'broadcaster' && (
            <>
              {/* 매니저 승격/해제 */}
              {userInfo.role === 'manager' ? (
                onDemoteManager && (
                  <button
                    onClick={() => {
                      onDemoteManager(userInfo.idx);
                      onClose?.();
                    }}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    매니저 해제
                  </button>
                )
              ) : (
                onPromoteManager && (
                  <button
                    onClick={() => {
                      onPromoteManager(userInfo.idx);
                      onClose?.();
                    }}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    매니저 승격
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
