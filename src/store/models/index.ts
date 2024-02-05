import { Models } from "@rematch/core"
import { characterModel } from './character';

export interface RootModel extends Models<RootModel> {
  characterModel: typeof characterModel;
}

export const models: RootModel = { characterModel }
