import { type UserGroupRole } from '@common/contracts';

export interface UserGroupDraft {
  readonly id: string;
  readonly userId: string;
  readonly groupId: string;
  readonly role: UserGroupRole;
}

export interface UserGroupState {
  readonly userId: string;
  readonly groupId: string;
  role: UserGroupRole;
}

export interface SetRolePayload {
  readonly role: UserGroupRole;
}

export class UserGroup {
  private readonly id: string;
  private readonly state: UserGroupState;

  public constructor(draft: UserGroupDraft) {
    const { id, userId, groupId, role } = draft;

    this.id = id;

    this.state = {
      userId,
      groupId,
      role,
    };
  }

  public getState(): UserGroupState {
    return this.state;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.state.userId;
  }

  public getGroupId(): string {
    return this.state.groupId;
  }

  public getRole(): UserGroupRole {
    return this.state.role;
  }

  public setRole(payload: SetRolePayload): void {
    const { role } = payload;

    this.state.role = role;
  }
}
