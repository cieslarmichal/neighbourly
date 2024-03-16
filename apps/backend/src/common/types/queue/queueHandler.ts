export interface QueueHandlerPayload {
  data: Record<string, unknown>;
  eventName: string;
}

export type QueueHandler = (payload: QueueHandlerPayload) => Promise<unknown>;
