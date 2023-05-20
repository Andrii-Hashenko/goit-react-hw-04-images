import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './Searchbar.styled.js';
import {
  Searchbar,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './Searchbar.styled';

export default function SearchBar(props) {
  const [searchImage, setSearchImage] = useState('');
  
  const handleNameChange = event => {
    setSearchImage(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();
    
    if (searchImage.trim() === '') {
      toast.error('Please enter your query');
      return;
    }
    props.inSubmit(searchImage);
    
  };

  return (
    <Searchbar>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <SearchFormButtonLabel>Search</SearchFormButtonLabel>
        </SearchFormButton>
        <SearchFormInput
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchImage}
          onChange={handleNameChange}
        />
      </SearchForm>
    </Searchbar>
  );
}

SearchBar.propTypes = {
  searchImage: PropTypes.string,
};
