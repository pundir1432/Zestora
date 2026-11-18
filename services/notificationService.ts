import { MOCK_NOTIFICATIONS, HospitalityNotification } from '@/mock/notifications';
import { MOCK_SYNC_QUEUE, SyncQueueItem } from '@/mock/sync';

/**
 * Notification & Offline Sync Service Interface (Mock)
 */
export const notificationService = {
  getNotifications(): HospitalityNotification[] {
    return MOCK_NOTIFICATIONS;
  },
  getSyncQueue(): SyncQueueItem[] {
    return MOCK_SYNC_QUEUE;
  },
};
