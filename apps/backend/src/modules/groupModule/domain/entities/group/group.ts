export interface GroupDraft {
  readonly id: string;
  readonly name: string;
  readonly addressId: string;
}

export interface GroupState {
  name: string;
  addressId: string;
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
    const { id, name, addressId } = draft;

    this.id = id;

    this.state = {
      name,
      addressId,
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

  public getAddressId(): string {
    return this.state.addressId;
  }

  public setName(payload: SetNamePayload): void {
    const { name } = payload;

    this.state.name = name;
  }

  public setAddressId(payload: SetAddressIdPayload): void {
    const { addressId } = payload;

    this.state.addressId = addressId;
  }
}
