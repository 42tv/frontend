'use client';

interface NotificationModalProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  closeModal?: () => void;
}

const NotificationModal = ({ 
  message, 
  type, 
  onConfirm,
  confirmText = '확인',
  closeModal 
}: NotificationModalProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (closeModal) {
      closeModal();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-green-500/10 text-green-600',
          icon: '✓',
          title: '성공'
        };
      case 'error':
        return {
          iconBg: 'bg-red-500/10 text-red-600',
          icon: '✕',
          title: '오류'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-500/10 text-yellow-600',
          icon: '⚠',
          title: '경고'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-500/10 text-blue-600',
          icon: 'ℹ',
          title: '알림'
        };
      default:
        return {
          iconBg: 'bg-gray-500/10 text-gray-600',
          icon: 'ℹ',
          title: '알림'
        };
    }
  };

  const { iconBg, icon, title } = getTypeStyles();

  return (
    <div className="bg-card border border-border rounded-lg p-6 min-w-80 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <p className="text-muted-foreground mb-4">{message}</p>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;