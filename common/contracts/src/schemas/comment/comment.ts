export interface Comment {
  readonly id: string;
  readonly userId: string;
  readonly postId: string;
  readonly content: string;
  readonly createdAt: string;
}
