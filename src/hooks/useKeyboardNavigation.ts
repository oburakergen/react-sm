import { useState, useEffect } from 'react';

const useKeyboardNavigation = (totalItems: number) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prevIndex) => (prevIndex === 0 ? totalItems - 1 : prevIndex - 1));
      } else if (event.key === 'ArrowDown') {
        setSelectedIndex((prevIndex) => (prevIndex === totalItems - 1 ? 0 : prevIndex + 1));
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalItems]);

  return selectedIndex;
};

export default useKeyboardNavigation;
