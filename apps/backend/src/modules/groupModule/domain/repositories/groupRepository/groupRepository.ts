import { type GroupState, type Group } from '../../entities/group/group.js';

export interface FindGroupPayload {
  readonly id?: string;
  readonly name?: string;
}

export interface SaveGroupPayload {
  readonly group: GroupState | Group;
}

export interface FindGroupsByIds {
  readonly ids: string[];
}

export interface DeleteGroupPayload {
  readonly id: string;
}

export interface GroupRepository {
  findGroup(payload: FindGroupPayload): Promise<Group | null>;
  findGroupsByIds(payload: FindGroupsByIds): Promise<Group[]>;
  findAllGroups(): Promise<Group[]>;
  saveGroup(payload: SaveGroupPayload): Promise<Group>;
  deleteGroup(payload: DeleteGroupPayload): Promise<void>;
}
