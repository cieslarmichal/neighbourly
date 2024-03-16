export interface CommentDraft {
  readonly id: string;
  readonly content: string;
  readonly userId: string;
  readonly postId: string;
  readonly createdAt: Date;
}

export interface CommentState {
  content: string;
  readonly userId: string;
  readonly postId: string;
}

export interface SetConentPayload {
  readonly content: string;
}

export class Comment {
  private readonly id: string;
  private readonly createdAt: Date;
  private readonly state: CommentState;

  public constructor(draft: CommentDraft) {
    const { id, postId, content, userId, createdAt } = draft;

    this.id = id;

    this.createdAt = createdAt;

    this.state = {
      postId,
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

  public getState(): CommentState {
    return this.state;
  }

  public getUserId(): string {
    return this.state.userId;
  }

  public getPostId(): string {
    return this.state.postId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setContent(payload: SetConentPayload): void {
    this.state.content = payload.content;
  }
}
