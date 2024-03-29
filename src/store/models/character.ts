import { createModel, RematchDispatch } from '@rematch/core';
import { RootModel } from './';

enum Status {
  idle = 'idle',
  loading = 'loading',
  error = 'error'
}

export interface ICharacter {
  id: number;
  name: string;
  episodes: number;
  image: string;
}

type CharacterState = {
  data: ICharacter[];
  status: Status;
};

export const characterModel = createModel<RootModel>()({
  state: {
    data: [] as ICharacter[],
    status: 'idle' as 'idle' | 'loading'
  } as CharacterState,
  reducers: {
    updateStatus: (state: CharacterState, payload: Status): CharacterState => {
      return {
        ...state,
        status: payload
      };
    },
    updateData: (state: CharacterState, payload: [ICharacter]): CharacterState => {
      return {
        ...state,
        data: payload
      };
    },
  },
  effects: (dispatch: RematchDispatch<RootModel>) => ({
    async fetchCurrent(name: string) {
      const { characterModel } = dispatch;

      characterModel.updateStatus(Status.loading);

      const data = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`).then((res: any) => {
        return res.json();
      }).catch(() => {
        characterModel.updateStatus(Status.error);
      });

      characterModel.updateStatus(Status.idle);

      if (data) {
        const items = data?.hasOwnProperty('error') ? [] : data.results || [];

        const lists: [ICharacter] = items.map((character: any) => {
          return {
            id: character.id,
            name: character.name,
            episodes: character.episode.length,
            image: character.image
          };
        });

        characterModel.updateData(lists);
      }
    }
  })
});
