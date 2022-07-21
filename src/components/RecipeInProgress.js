import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import IngredientsList from './IngredientsList';
import { fetchDetailsDrink, fetchDetailsFood } from '../data';
import {
  readStorageFavoriteRecipes,
  readStorageInProgressRecipes,
  saveStorageDoneRecipes,
  saveStorageFavoriteRecipes,
  saveStorageInProgressRecipes,
} from '../services/recipesLocalStorage';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import '../styles/RecipeDetails.css';

function RecipeInProgress() {
  const [details, setDetails] = useState({});
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [indexIngredients, setIndexIngredients] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const history = useHistory();
  const isFood = history.location.pathname.includes('/food');

  const { id } = useParams();

  useEffect(() => {
    const getDetails = async () => {
      if (isFood) {
        const foodDetails = await fetchDetailsFood(id);
        setDetails(foodDetails.meals[0]);
      } else {
        const drinkDetails = await fetchDetailsDrink(id);
        setDetails(drinkDetails.drinks[0]);
      }
    };

    getDetails();
  }, []);

  useEffect(() => {
    const inProgressLocalStorage = readStorageInProgressRecipes();

    if (isFood && inProgressLocalStorage.meals[id]) {
      setIndexIngredients(inProgressLocalStorage.meals[id]);
    }

    if (!isFood && inProgressLocalStorage.cocktails[id]) {
      setIndexIngredients(inProgressLocalStorage.cocktails[id]);
    }
  }, []);

  useEffect(() => {
    const favorites = readStorageFavoriteRecipes();

    const checkFavorite = favorites.some((favorite) => favorite.id === id);
    if (checkFavorite) {
      setIsFavorite(true);
    }
  }, []);

  useEffect(() => {
    if (isFood) {
      saveStorageInProgressRecipes('meals', id, indexIngredients);
    } else {
      saveStorageInProgressRecipes('cocktails', id, indexIngredients);
    }

    const ingredientsList = { ...details };

    Object.keys(ingredientsList).forEach((key) => {
      if (!key.includes('strIngredient')) {
        delete ingredientsList[key];
      }
    });

    const ingredientsFiltered = Object.values(ingredientsList).filter(
      (ingredient) => ingredient && ingredient.length > 0,
    );

    if (
      ingredientsFiltered.length > 0
      && ingredientsFiltered.length === indexIngredients.length
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [indexIngredients]);

  const setFavoritesRecipes = () => {
    const favorites = readStorageFavoriteRecipes();

    const checkFavorite = favorites.some((favorite) => favorite.id === id);
    if (!checkFavorite) {
      setIsFavorite(true);
      const favoriteObj = {
        id: details.idMeal || details.idDrink,
        type: isFood ? 'food' : 'drink',
        nationality: details.strArea || '',
        category: details.strCategory || '',
        alcoholicOrNot: details.strAlcoholic || '',
        name: details.strMeal || details.strDrink,
        image: details.strMealThumb || details.strDrinkThumb,
      };
      saveStorageFavoriteRecipes(favoriteObj);
    } else {
      setIsFavorite(false);
      const removeFavorite = favorites.filter((favorite) => favorite.id !== id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(removeFavorite));
    }
  };

  const clickShare = () => {
    if (isFood) {
      clipboardCopy(`http://localhost:3000/foods/${id}`);
    } else {
      clipboardCopy(`http://localhost:3000/drinks/${id}`);
    }
    setCopied(true);
  };

  const handleClickFinish = () => {
    const recipeObj = {
      id: details.idMeal || details.idDrink,
      type: isFood ? 'food' : 'drink',
      nationality: details.strArea || '',
      category: details.strCategory || '',
      alcoholicOrNot: details.strAlcoholic || '',
      name: details.strMeal || details.strDrink,
      image: details.strMealThumb || details.strDrinkThumb,
      doneDate: new Date().toLocaleDateString(),
      tags:
        details.strTags && details.strTags.length > 0
          ? details.strTags.split(',')
          : [],
    };
    saveStorageDoneRecipes(recipeObj);

    history.push('/done-recipes');
  };

  return (
    <div>
      <img
        data-testid="recipe-photo"
        src={ details.strMealThumb || details.strDrinkThumb }
        alt="Imagem da receita"
      />
      <h3 data-testid="recipe-title">{details.strMeal || details.strDrink}</h3>
      <button type="button" data-testid="share-btn" onClick={ clickShare }>
        <img src={ shareIcon } alt="compartilhar" />
      </button>
      <button type="button" onClick={ setFavoritesRecipes }>
        {isFavorite ? (
          <img
            src={ blackHeartIcon }
            alt="blackHeartIcon"
            data-testid="favorite-btn"
          />
        ) : (
          <img
            src={ whiteHeartIcon }
            alt="whiteHeartIcon"
            data-testid="favorite-btn"
          />
        )}
      </button>
      {copied && <span>Link copied!</span>}
      <h5 data-testid="recipe-category">
        {isFood ? details.strCategory : details.strAlcoholic}
      </h5>
      <IngredientsList
        details={ details }
        indexIngredients={ indexIngredients }
        setIndexIngredients={ setIndexIngredients }
        inProgress
      />
      <h4>Instructions</h4>
      <p data-testid="instructions">{details.strInstructions}</p>
      <button
        type="button"
        data-testid="finish-recipe-btn"
        disabled={ disabled }
        onClick={ handleClickFinish }
      >
        Finish
      </button>
    </div>
  );
}

export default RecipeInProgress;
