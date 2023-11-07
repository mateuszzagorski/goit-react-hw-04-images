import React from 'react';
import css from './App.module.css';

// Components:

import Searchbar from './searchbar/Searchbar';
import ImageGallery from './imageGallery/ImageGallery';
import Button from './button/Button';
import Loader from './loader/Loader';
import Modal from './modal/Modal';
import { useImage } from '../hooks/ImageContext';

export function App() {
  const { images, isLoading, shownModal } = useImage();
  return (
    <div className={css.app}>
      <Searchbar />
      <ImageGallery />
      {images.length > 0 && <Button />}
      {isLoading && <Loader />}
      {shownModal && <Modal />}
    </div>
  );
}
