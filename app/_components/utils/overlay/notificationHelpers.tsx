import { openModal } from './overlayHelpers';
import NotificationModal from '@/app/_components/modals/NotificationModal';

interface NotificationOptions {
  onConfirm?: () => void;
  confirmText?: string;
}

export const showSuccessNotification = (message: string, options?: NotificationOptions) => {
  return openModal(
    <NotificationModal 
      message={message} 
      type="success"
      onConfirm={options?.onConfirm}
      confirmText={options?.confirmText}
    />
  );
};

export const showErrorNotification = (message: string, options?: NotificationOptions) => {
  return openModal(
    <NotificationModal 
      message={message} 
      type="error"
      onConfirm={options?.onConfirm}
      confirmText={options?.confirmText}
    />
  );
};

export const showWarningNotification = (message: string, options?: NotificationOptions) => {
  return openModal(
    <NotificationModal 
      message={message} 
      type="warning"
      onConfirm={options?.onConfirm}
      confirmText={options?.confirmText}
    />
  );
};

export const showInfoNotification = (message: string, options?: NotificationOptions) => {
  return openModal(
    <NotificationModal 
      message={message} 
      type="info"
      onConfirm={options?.onConfirm}
      confirmText={options?.confirmText}
    />
  );
};