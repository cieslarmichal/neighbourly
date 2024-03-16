import { type AddressState } from './addressState.js';

interface AddressProps {
  id: string;
  state: AddressState;
}

export class Address {
  private id: string;
  private state: AddressState;

  public constructor(props: AddressProps) {
    const { id, state } = props;

    this.id = id;

    this.state = state;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string | null {
    return this.state.userId;
  }

  public getGroupId(): string | null {
    return this.state.groupId;
  }

  public getLatitude(): number {
    return this.state.latitude;
  }

  public getLongitude(): number {
    return this.state.longitude;
  }
}
