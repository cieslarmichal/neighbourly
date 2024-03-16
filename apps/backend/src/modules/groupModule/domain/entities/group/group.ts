import { type AccessType } from '@common/contracts';

export interface GroupDraft {
  readonly id: string;
  readonly name: string;
  readonly accessType: AccessType;
}

export interface GroupState {
  name: string;
  accessType: AccessType;
}

export interface SetNamePayload {
  readonly name: string;
}

export interface SetAccessTypePayload {
  readonly accessType: AccessType;
}

export class Group {
  private readonly id: string;
  private readonly state: GroupState;

  public constructor(draft: GroupDraft) {
    const { id, name, accessType } = draft;

    this.id = id;

    this.state = {
      name,
      accessType,
    };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getAccessType(): AccessType {
    return this.state.accessType;
  }

  public getState(): GroupState {
    return this.state;
  }

  public setName(payload: SetNamePayload): void {
    const { name } = payload;

    this.state.name = name;
  }

  public setAccessType(payload: SetAccessTypePayload): void {
    const { accessType } = payload;

    this.state.accessType = accessType;
  }
}
