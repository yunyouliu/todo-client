// src/models/offline.ts
import { Effect } from 'umi';
import { OfflineQueue } from '@/lib/db/offlineSync';
import { SyncStrategies } from '@/lib/db/syncStrategies';

export interface OfflineModelType {
  namespace: 'offline';
  effects: {
    retryFailed: Effect;
    syncWithStrategy: Effect;
  };
  state: typeof initialState;
}

const initialState = {
  isConnected: false,
  queueSize: 0,
};

const OfflineModel: OfflineModelType = {
  state: initialState,
  namespace: 'offline',

  effects: {
    *retryFailed(_, { call, put, select }) {
      const { isConnected }: { isConnected: boolean } = yield select((state: { websocket: { isConnected: boolean } }) => state.websocket);
      if (isConnected) {
        yield call([OfflineQueue, OfflineQueue.retryFailed]);
        yield put({ type: 'websocket/updateQueueSize', payload: 0 });
      }
    },

    *syncWithStrategy({ payload }, { call }) {
      const { local, remote, strategy } = payload;
      const shouldUpdate = SyncStrategies.resolve(local, remote, strategy);
      if (shouldUpdate) {
        yield call([OfflineQueue, OfflineQueue.enqueue], {
          type: 'update',
          task: remote,
          timestamp: Date.now(),
          retries: 0
        });
      }
    }
  }
};

export default OfflineModel;