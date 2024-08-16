import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';

import { Text } from '../ui';

interface Props {
  items: string[];
  onItemClick: (item: string) => void;
  getItemClass: (item: string) => string | undefined;
}

const DropdownMenu: FC<Props> = ({ items, onItemClick, getItemClass }) => {
  const [visible, setVisible] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className='cb-dropdown-menu'
        ref={menuRef}
      >
        <div
          className='cb-dropdown-menu-trigger'
          onClick={() => setVisible(!visible)}
        >
          ...
        </div>
        {visible && (
          <div className='cb-dropdown-menu-container'>
            {items.map((item, index) => (
              <div
                key={index}
                className={`cb-dropdown-menu-item ${getItemClass(item)}`}
                onClick={() => onItemClick(item)}
              >
                <Text>{item}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownMenu;
