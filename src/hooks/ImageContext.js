import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const apiKey = process.env.REACT_APP_API_KEY;

const ImageContext = createContext();

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [prevQuery, setPrevQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shownModal, setShownModal] = useState(false);
  const [query, setQuery] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [largeImageAlt, setLargeImageAlt] = useState('');

  const onSubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const query = form.elements.query.value;

    switch (query) {
      case '':
        Notify.warning(`Please complete this field`);
        break;
      case prevQuery:
        Notify.info(
          `We're sorry, but result for the ${prevQuery} have already been found. Please try finding something else.`
        );
        break;
      default:
        setPrevQuery(query);
        setCurrentPage(1);
        setImages([]);
        setQuery(query);

        break;
    }
  };

  const getImages = useCallback(async () => {
    const searchParams = new URLSearchParams({
      q: query,
      page: currentPage,
      key: apiKey,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: 12,
    });

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://pixabay.com/api/?${searchParams}`
      );
      const newImages = await response.data.hits;

      if (newImages.length === 0) {
        Notify.failure(
          `Sorry, there are no images matching your search ${query}. Please try again.`
        );
      }
      setImages(images => [...images, ...newImages]);
    } catch (error) {
      setError({ error: error.toString() });
    } finally {
      setIsLoading(false);
    }
  }, [query, currentPage]);

  const handleClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleModal = event => {
    if (event.target.nodeName !== 'IMG') {
      return;
    }
    setShownModal(true);
    setLargeImage(event.target.dataset.source);
    setLargeImageAlt(event.target.getAttribute('alt'));
  };

  function handleCloseModalESC(event) {
    if (event.key === 'Escape') {
      setShownModal(false);
    }
  }

  function handleCloseModalClick(event) {
    if (event.target.id === 'close') {
      setShownModal(false);
    }
  }

  useEffect(() => {
    if (currentPage !== 1) {
      getImages();
    }
  }, [getImages, currentPage]);

  useEffect(() => {
    if (query !== '') {
      getImages();
    }
  }, [getImages, query]);

  return (
    <ImageContext.Provider
      value={{
        currentPage,
        images,
        error,
        prevQuery,
        isLoading,
        shownModal,
        query,
        largeImage,
        largeImageAlt,
        handleClick,
        handleModal,
        handleCloseModalESC,
        handleCloseModalClick,
        onSubmit,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

ImageContext.Provider.propTypes = {
  value: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        webformatURL: PropTypes.string.isRequired,
        largeImageURL: PropTypes.string.isRequired,
      })
    ),
    error: PropTypes.string.isRequired,
    prevQuery: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    shownModal: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    largeImage: PropTypes.string.isRequired,
    largeImageAlt: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    handleModal: PropTypes.func.isRequired,
    handleCloseModalESC: PropTypes.func.isRequired,
    handleCloseModalClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }),
};
