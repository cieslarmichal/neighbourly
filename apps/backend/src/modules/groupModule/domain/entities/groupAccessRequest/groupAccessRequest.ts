export interface GroupAccessRequestDraft {
  readonly id: string;
  readonly userId: string;
  readonly groupId: string;
  readonly createdAt: Date;
}

export interface GroupAccessRequestState {
  readonly userId: string;
  readonly groupId: string;
}

export interface SetConentPayload {
  readonly content: string;
}

export class GroupAccessRequest {
  private readonly id: string;
  private readonly createdAt: Date;
  private readonly state: GroupAccessRequestState;

  public constructor(draft: GroupAccessRequestDraft) {
    const { id, groupId, userId, createdAt } = draft;

    this.id = id;

    this.createdAt = createdAt;

    this.state = {
      groupId,
      userId,
    };
  }

  public getId(): string {
    return this.id;
  }

  public getState(): GroupAccessRequestState {
    return this.state;
  }

  public getUserId(): string {
    return this.state.userId;
  }

  public getGroupId(): string {
    return this.state.groupId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
