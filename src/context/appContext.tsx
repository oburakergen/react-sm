import React, { Context, createContext, useCallback, useContext, useState } from 'react';
import type { ICharacter } from '@/store/models/character';

export interface IAppContext {
  checked: ICharacter[];
  setChecked: (data: ICharacter[]) => void;
  search: string;
  setSearch: (data: string) => void;
  removeChecked: (data: ICharacter) => void;
  findId: (id: number) => boolean;
  updateCheckedList: (data: ICharacter) => void;
}

const AppContext: Context<IAppContext> = createContext({} as IAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState<string>('');
  const [checked, setChecked] = useState<ICharacter[]>([]);

  const removeChecked = (data: ICharacter) => {
    setChecked(checked.filter((item) => item.id !== data.id));
  };

  const findId = useCallback((id: number): boolean => {
    return !!checked.find((item) => item.id === id);
  }, [checked]);

  const updateCheckedList = (data: ICharacter) => {
    if (findId(data.id)) {
      removeChecked(data);
    } else {
      setChecked([...checked, data]);
    }
  };
  return (
    <AppContext.Provider
      value={{ checked, setChecked, removeChecked, search, setSearch, findId, updateCheckedList }}
    >
      {children}
    </AppContext.Provider>
  );
};
