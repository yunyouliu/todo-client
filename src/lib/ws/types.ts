export type WSOperationType = 
  | 'TASK_CREATE' 
  | 'TASK_UPDATE' 
  | 'TASK_DELETE'
  | 'SYNC'
  | 'INIT_SYNC';

export interface WSSyncMessage<T = unknown> {
  type: WSOperationType;
  payload: T;
  clientId: string;
  timestamp: number;
  version?: number;
}