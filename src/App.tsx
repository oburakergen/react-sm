import React, { ChangeEventHandler, KeyboardEventHandler, useCallback, useRef } from 'react';
import './App.css';
import { Command, CommandInput } from '@/components/ui/command';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/store/store';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Empty } from '@/components/Empty';
import { CharacterList } from '@/components/CharacterList';
import { useAppContext } from '@/context/appContext';

function App() {
  const dispatch = useDispatch<Dispatch>();
  const character = useSelector((state: RootState) => state.characterModel);
  const input = useRef<HTMLInputElement>(null);
  const { checked, search, setSearch, removeChecked } = useAppContext();

  const searchHandle: KeyboardEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();

    if (!input?.current?.disabled && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      dispatch.characterModel.fetchCurrent(search);
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setSearch(event.target.value);
    input.current?.focus();
  }, [setSearch]);

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
          autoFocus
        >
          {checked.map((item) => (
            <Badge
              key={item.id}
              className={cn(
                badgeVariants({
                  variant: 'default',
                  className: 'flex m-1 h-14 text-ellipsis whitespace-break-spaces overflow-hidden'
                })
              )}
            >
              {item.name}
              <Button
                size="icon"
                onClick={() => removeChecked(item)}
                className={cn(buttonVariants({ variant: 'link', size: 'icon', className: 'ml-1 w-6 h-6 text-white' }))}
              >
                <Cross1Icon />
              </Button>
            </Badge>
          ))}
        </CommandInput>
        {character?.status === 'loading' && <div>Loading...</div>}
        {search && character?.status === 'idle' && (character.data.length === 0 ? <Empty /> : <CharacterList character={character.data} />)}
      </Command>
    </div>
  );
}

export default App;
