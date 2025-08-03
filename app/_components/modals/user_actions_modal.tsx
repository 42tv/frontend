'use client';
import { MyRole, UserRole, Viewer } from '@/app/_types';
import React from 'react';

interface UserActionsModalProps {
  userInfo: Viewer;
  currentUser: MyRole;
  onClose?: () => void;
  onKick?: (userIdx: number) => void;
  onBan?: (userIdx: number) => void;
  onUnban?: (userIdx: number) => void;
  onPromoteManager?: (userId: string) => void;
  onDemoteManager?: (userId: string) => void;
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
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              {userInfo.nickname}
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {userInfo.role.role === 'broadcaster' ? '방송자' : 
               userInfo.role.role === 'manager' ? '매니저' : '시청자'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-4">
          {/* guest 대상으로는 모든 액션 불가 */}
          {userInfo.role.role !== 'guest' && (
            <>
              {/* 쪽지 보내기 - 모든 사용자가 가능 (guest 제외) */}
              {currentUser.user_idx !== userInfo.user_idx && onSendMessage && (
                <button
                  onClick={() => {
                    onSendMessage(userInfo.user_idx);
                    onClose?.();
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  쪽지 보내기
                </button>
              )}

              {/* 관리자 권한이 필요한 액션들 */}
              {currentUser.role && (currentUser.role === 'broadcaster' || currentUser.role === 'manager') && 
               currentUser.user_idx !== userInfo.user_idx && userInfo.role.role !== 'broadcaster' && (
                <>
                  {/* 강퇴 */}
                  {onKick && (
                    <button
                      onClick={() => {
                        onKick(userInfo.user_idx);
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
                        onBan(userInfo.user_idx);
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
              {(currentUser.role === 'broadcaster' && 
               currentUser.user_idx !== userInfo.user_idx && userInfo.role.role !== 'broadcaster') && (
                <>
                  {/* 매니저 승격/해제 */}
                  {userInfo.role.role === 'manager' ? (
                    onDemoteManager && (
                      <button
                        onClick={() => {
                          onDemoteManager(userInfo.user_id);
                          onClose?.();
                        }}
                        className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                      >
                        매니저 해임
                      </button>
                    )
                  ) : (
                    onPromoteManager && (
                      <button
                        onClick={() => {
                          onPromoteManager(userInfo.user_id);
                          onClose?.();
                        }}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        매니저 부여
                      </button>
                    )
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
