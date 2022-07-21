import clipboardCopy from 'clipboard-copy';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import {
  readStorageFavoriteRecipes,
} from '../services/recipesLocalStorage';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import '../styles/DoneRecipes.css';

function FavoriteRecipes() {
  const [copied, setCopied] = useState(false);
  const [favoritesRecipes, setFavoritesRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const favorite = readStorageFavoriteRecipes();
    setFavoritesRecipes(favorite);
  }, [update]);

  useEffect(() => {
    if (filter !== 'all') {
      const favoriteFiltered = favoritesRecipes.filter(
        (recipe) => recipe.type === filter,
      );
      setFilteredRecipes(favoriteFiltered);
    }
  }, [filter]);

  const goToDetails = (type, id) => {
    if (type === 'food') {
      return `/foods/${id}`;
    }
    return `/drinks/${id}`;
  };

  const clickShare = (recipe) => {
    if (recipe.type === 'food') {
      clipboardCopy(`http://localhost:3000/foods/${recipe.id}`);
    } else {
      clipboardCopy(`http://localhost:3000/drinks/${recipe.id}`);
    }
    setCopied(true);
  };

  const recipesToShow = () => {
    if (filter === 'all') {
      return favoritesRecipes;
    }
    return filteredRecipes;
  };

  const updateFavoritesRecipes = (id) => {
    const removeFavorite = favoritesRecipes.filter((favorite) => favorite.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(removeFavorite));

    if (update) {
      setUpdate(false);
    } else {
      setUpdate(true);
    }
  };

  return (
    <div>
      <Header pageTitle="Favorite Recipes" showSearchIcon={ false } />
      <button
        type="button"
        data-testid="filter-by-all-btn"
        name="all"
        onClick={ ({ target }) => setFilter(target.name) }
      >
        All
      </button>
      <button
        type="button"
        data-testid="filter-by-food-btn"
        name="food"
        onClick={ ({ target }) => setFilter(target.name) }
      >
        Food
      </button>
      <button
        type="button"
        data-testid="filter-by-drink-btn"
        name="drink"
        onClick={ ({ target }) => setFilter(target.name) }
      >
        Drinks
      </button>
      {recipesToShow().map((recipe, index) => (
        <div key={ recipe.id } className="card-container">
          <Link to={ () => goToDetails(recipe.type, recipe.id) }>
            <img
              src={ recipe.image }
              data-testid={ `${index}-horizontal-image` }
              alt="Foto da receita"
            />
            <h3 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h3>
          </Link>
          <h5 data-testid={ `${index}-horizontal-top-text` }>
            {recipe.type === 'food'
              ? `${recipe.nationality} - ${recipe.category}`
              : recipe.alcoholicOrNot}
          </h5>
          <button type="button" onClick={ () => updateFavoritesRecipes(recipe.id) }>
            {favoritesRecipes.some((favorite) => favorite.id === recipe.id) ? (
              <img
                src={ blackHeartIcon }
                alt="favoritar"
                data-testid={ `${index}-horizontal-favorite-btn` }
              />
            ) : (
              <img
                src={ whiteHeartIcon }
                alt="favoritar"
                data-testid={ `${index}-horizontal-favorite-btn` }
              />
            )}
          </button>
          <button type="button" onClick={ () => clickShare(recipe) }>
            <img
              data-testid={ `${index}-horizontal-share-btn` }
              src={ shareIcon }
              alt="compartilhar"
            />
          </button>
          {copied && <span>Link copied!</span>}
        </div>
      ))}
    </div>
  );
}

export default FavoriteRecipes;
