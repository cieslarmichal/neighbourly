import { type QueueChannel } from './queueChannel.js';
import { type QueuePath } from './queuePath.js';

export interface QueueController {
  getQueuePaths(): QueuePath[];
  getChannels(): QueueChannel[];
}
