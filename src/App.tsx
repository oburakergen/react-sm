import React, { ChangeEventHandler, KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import './App.css';
import { Command, CommandInput } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/store/store';
import type { ICharacter } from '@/store/models/character';
import { Badge } from '@/components/ui/badge';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';

const BoldLetter = ({ sentence, search }: { sentence: string; search: string }) => {
  const regex = new RegExp(search, 'gi');
  const boldSentence = sentence.replace(regex, (match) => `<b>${match}</b>`);

  return <div dangerouslySetInnerHTML={{ __html: boldSentence }} />;
};

function App() {
  const dispatch = useDispatch<Dispatch>();
  const character = useSelector((state: RootState) => state.characterModel);
  const [search, setSearch] = useState<string>('');
  const [checked, setChecked] = useState<ICharacter[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const selectedIndex = useKeyboardNavigation(character.data.length);
  const searchHandle: KeyboardEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const target: HTMLInputElement = event.target as HTMLInputElement;

    if (target && !(target as HTMLButtonElement).disabled) {
      dispatch.characterModel.fetchCurrent(search);
    }
  };

  const removeChecked = (data: ICharacter) => {
    setChecked(checked.filter((item) => item.id !== data.id));
  };

  const findId = useCallback(
    (id: number): boolean => {
      return !!checked.find((item) => item.id === id);
    },
    [checked]
  );

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setSearch(event.target.value);
    input.current?.focus();
  }, []);

  const updateCheckedList = (data: ICharacter) => {
    if (findId(data.id)) {
      removeChecked(data);
    } else {
      setChecked([...checked, data]);
    }
  };

  return (
    <div className="App">
      <Command>
        <CommandInput
          placeholder="Type a search..."
          onKeyUp={searchHandle}
          value={search}
          onChangeCapture={handleInputChange}
          disabled={character.status === 'loading'}
          ref={(input) => input && input.focus()}
        >
          {checked.map((item, index) => (
            <Badge key={item.id} className="flex m-1 h-14 text-ellipsis whitespace-break-spaces overflow-hidden">
              {item.name}
              <Button
                size="icon"
                onClick={() => removeChecked(item)}
                className="w-6 h-6 bg-slate-500 text-white ml-3"
                variant="link"
              >
                <Cross1Icon />
              </Button>
            </Badge>
          ))}
        </CommandInput>
        {character?.status === 'loading' && <div>Loading...</div>}
        {search && character?.status === 'idle' && character.data.length === 0 && <div>No data found</div>}
        {character?.data?.length > 0 && (
          <div className="mt-4 shadow shadow-slate-200 bg-slate-100 border border-slate-600 rounded-xl max-h-[500px] overflow-y-auto">
            {character.data.map((item: ICharacter, index) => (
              <div
                tabIndex={index}
                key={item.id}
                className={`flex flex-row items-center px-4 py-4 gap-4 border-b border-slate-600 ${selectedIndex === index ? 'border-slate-800' : ''}`}
              >
                <div className="justify-center">
                  <Checkbox checked={findId(item.id)} onClick={() => updateCheckedList(item)} />
                </div>
                <div className="relative">
                  <img src={item.image} alt={item.name} className="rounded-xl max-w-[3rem]" />
                </div>
                <div>
                  <BoldLetter sentence={item.name} search={search} />
                  <div>{`Episodes ${item.episodes}`}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Command>
    </div>
  );
}

export default App;
