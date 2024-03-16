export interface PostDraft {
  readonly id: string;
  readonly content: string;
  readonly userId: string;
  readonly groupId: string;
  readonly createdAt: Date;
}

export interface PostState {
  content: string;
  readonly userId: string;
  readonly groupId: string;
}

export interface SetConentPayload {
  readonly content: string;
}

export class Post {
  private readonly id: string;
  private readonly createdAt: Date;
  private readonly state: PostState;

  public constructor(draft: PostDraft) {
    const { id, groupId, content, userId, createdAt } = draft;

    this.id = id;

    this.createdAt = createdAt;

    this.state = {
      groupId,
      content,
      userId,
    };
  }

  public getId(): string {
    return this.id;
  }

  public getContent(): string {
    return this.state.content;
  }

  public getState(): PostState {
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

  public setContent(payload: SetConentPayload): void {
    this.state.content = payload.content;
  }
}
