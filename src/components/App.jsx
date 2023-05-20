import { useState, useEffect } from 'react';
import pixabayAPI from '../services/pixabay-api';
import SearchBar from 'components/Searchbar';
import Loader from './Loader';
import ButtonLoadMore from './Button';
import PixabayImageGallery from './ImageGallery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [searchImage, setSearchImage] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const per_page = 12;

  useEffect(() => {
    if (!searchImage) {
      return;
    }
    setStatus('pending');
    const loadImages = () => {
      pixabayAPI
        .fetchPixabayImage(searchImage, page, per_page)
        .then(responce => {
          if (responce.hits.length === 0) {
            toast.info(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            setStatus('idle');
          } else {
            if (page * per_page > responce.total) {
              toast.info(
                'Sorry, there are no more images matching your search query.'
              );
              setImages(images => [...images, ...responce.hits]);
              setStatus('idle');
            } else {
              setImages(images => [...images, ...responce.hits]);
              setStatus('resolved');
            }
          }
          scrollToBottom();
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        });
    };

    const loadImagesBySearch = () => {
            loadImages();
    };
    loadImagesBySearch();
  }, [page, searchImage]);

  const handleFormSubmit = searchImage => {
    console.log(searchImage);
    resetPage();
    setSearchImage(searchImage);
    setImages([]);
  };

  const resetPage = () => {
    setPage(1);
  };

  const onButtonClick = () => {
    setPage(page + 1);
  };
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <div>
      <SearchBar inSubmit={handleFormSubmit} />
      <ToastContainer
        position={'top-center'}
        autoClose={4000}
        theme={'colored'}
      />
      {images.length !== 0 && <PixabayImageGallery images={images} />}
      {status === 'pending' && (
        <div>
          <Loader images={images} />
        </div>
      )}
      {status === 'rejected' && (
        <div role="alert">
          <p>{error.message}</p>
        </div>
      )}
      {status === 'resolved' && (
        <div>
          <ButtonLoadMore onClick={() => onButtonClick()} />
        </div>
      )}
    </div>
  );
}
