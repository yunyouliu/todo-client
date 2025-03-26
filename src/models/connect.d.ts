
import { ActiveState, ActiveModelType } from './active';
import { WebSocketState, WebSocketModelType } from './websocket';

export interface ConnectState {
  active: ActiveState;
  websocket: WebSocketState;
}

export type CombinedModelType = ActiveModelType | WebSocketModelType;