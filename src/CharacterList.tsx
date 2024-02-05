import type { ICharacter } from '@/store/models/character';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import { useAppContext } from '@/context/appContext';

const BoldLetter = ({ sentence, search }: { sentence: string; search: string }) => {
  const regex = new RegExp(search, 'gi');
  const boldSentence = sentence.replace(regex, (match) => `<b>${match}</b>`);

  return <div dangerouslySetInnerHTML={{ __html: boldSentence }} />;
};

export const CharacterList = ({character}: {character: ICharacter[]}) => {
  const selectedIndex = useKeyboardNavigation(character.length);
  const { findId, updateCheckedList, search } = useAppContext();

  return (
    <div
      className="mt-4 shadow shadow-slate-200 bg-slate-100 border border-slate-600 rounded-xl max-h-[500px] overflow-y-auto">
      {character.map((item: ICharacter, index) => (
        <div
          tabIndex={index}
          key={item.id}
          className={`flex flex-row items-center px-4 py-4 gap-4 border-b border-slate-600 ${selectedIndex === index ? 'bg-slate-600' : ''}`}
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
  );
};
