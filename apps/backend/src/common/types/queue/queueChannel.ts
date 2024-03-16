export interface QueueMessagePayload {
  data: Record<string, unknown>;
  eventName: string;
}

export interface QueueChannel {
  getMessages(): Promise<QueueMessagePayload[]>;
}
