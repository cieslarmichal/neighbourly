export interface GroupDraft {
  readonly id: string;
  readonly name: string;
}

export interface GroupState {
  name: string;
}

export interface SetNamePayload {
  readonly name: string;
}

export interface SetAddressIdPayload {
  readonly addressId: string;
}

export class Group {
  private readonly id: string;
  private readonly state: GroupState;

  public constructor(draft: GroupDraft) {
    const { id, name } = draft;

    this.id = id;

    this.state = {
      name,
    };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.state.name;
  }

  public getState(): GroupState {
    return this.state;
  }

  public setName(payload: SetNamePayload): void {
    const { name } = payload;

    this.state.name = name;
  }
}
