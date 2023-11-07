import React from 'react';
import css from './Button.module.css';
import { useImage } from '../../hooks/ImageContext';

export default function Button() {
  const { handleClick } = useImage();

  return (
    <div className={css.divForButton}>
      <button className={css.button} onClick={handleClick}>
        Load more
      </button>
    </div>
  );
}
