import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouter from './renderWithRouter';

const copy = require('clipboard-copy');

jest.mock('clipboard-copy');

const PATH_FOODS = '/foods/52768/in-progress';
const PATH_DRINKS = '/drinks/15997/in-progress';
const FAVORITE_BTN = 'favorite-btn';
const FINISH_RECIPE_BTN = 'finish-recipe-btn';
const WHITE_HEART_ICON = 'whiteHeartIcon.svg';
const BLACK_HEART_ICON = 'blackHeartIcon.svg';
const FOUR = 4;
const SEVEN = 7;
const NINE = 9;

const setAllLocalStorageKeys = () => {
  localStorage.setItem('doneRecipes', JSON.stringify([]));
  localStorage.setItem('favoriteRecipes', JSON.stringify([]));
  localStorage.setItem(
    'inProgressRecipes',
    JSON.stringify({ cocktails: {}, meals: {} }),
  );
};

describe('Testando a página de receitas em progresso', () => {
  beforeEach(() => setAllLocalStorageKeys());
  afterEach(() => localStorage.clear());
  afterEach(() => jest.restoreAllMocks());

  it('Testando se a página é renderizada corretamente', async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_FOODS);
    await waitFor(
      () => {
        const recipeImg = screen.getByTestId('recipe-photo');
        expect(recipeImg).toHaveAttribute(
          'src',
          'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg',
        );
      },
      { timeout: 4000 },
    );
    const recipeName = screen.getByTestId('recipe-title');
    const shareButton = screen.getByTestId('share-btn');
    const favoriteButton = screen.getByTestId(FAVORITE_BTN);
    const recipeCategory = screen.getByTestId('recipe-category');
    const ingredients = screen.getAllByTestId(/ingredient-step/i);
    const intructions = screen.getByTestId('instructions');
    const finishButton = screen.getByTestId(FINISH_RECIPE_BTN);
    expect(recipeName).toBeInTheDocument();
    expect(shareButton).toBeInTheDocument();
    expect(favoriteButton).toBeInTheDocument();
    expect(recipeCategory).toBeInTheDocument();
    expect(ingredients).toHaveLength(NINE);
    expect(intructions).toBeInTheDocument();
    expect(finishButton).toBeInTheDocument();
  });

  it('Testando a funcionalidade do botão share para a página de comidas', async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_FOODS);
    const shareButton = screen.getByTestId('share-btn');
    userEvent.click(shareButton);
    expect(copy).toHaveBeenCalled();
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();
  });

  it('Testando a funcionalidade do botão share para a página de bebidas', async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_DRINKS);
    const shareButton = screen.getByTestId('share-btn');
    userEvent.click(shareButton);
    expect(copy).toHaveBeenCalled();
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();
  });

  it('Testando a funcionalidade do botão favoritar para comidas', async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_FOODS);
    await waitFor(
      () => {
        screen.getByText(/Apple Frangipan Tart/i);
      },
      { timeout: 3000 },
    );
    const favoriteButton = screen.getByTestId(FAVORITE_BTN);
    expect(favoriteButton).toHaveAttribute('src', WHITE_HEART_ICON);
    userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('src', BLACK_HEART_ICON);
    userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('src', WHITE_HEART_ICON);
  });

  it('Testando a funcionalidade do botão favoritar para bebidas', async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_DRINKS);
    await waitFor(
      () => {
        screen.getByRole('heading', { name: 'GG', level: 3 });
      },
      { timeout: 3000 },
    );
    const favoriteButton = screen.getByTestId(FAVORITE_BTN);
    expect(favoriteButton).toHaveAttribute('src', WHITE_HEART_ICON);
    userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('src', BLACK_HEART_ICON);
    userEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('src', WHITE_HEART_ICON);
  });

  it('Testando se ao recarregar a página o botão de favorito permanece', async () => {
    jest.spyOn(global, 'fetch');

    localStorage.setItem(
      'favoriteRecipes',
      JSON.stringify([
        {
          id: '52768',
          type: 'food',
          nationality: 'British',
          category: 'Dessert',
          alcoholicOrNot: '',
          name: 'Apple Frangipan Tart',
          image:
            'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg',
        },
      ]),
    );

    const { history } = renderWithRouter(<App />);
    history.push(PATH_FOODS);
    await waitFor(
      () => {
        screen.getByText(/Apple Frangipan Tart/i);
      },
      { timeout: 3000 },
    );
    const favoriteButton = screen.getByTestId(FAVORITE_BTN);
    expect(favoriteButton).toHaveAttribute('src', BLACK_HEART_ICON);
  });

  it(`Testando se o botão finish é habilitado quando todos
  os ingredientes estão selecionados para comidas`, async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_FOODS);
    await waitFor(
      () => {
        screen.getByText(/Apple Frangipan Tart/i);
      },
      { timeout: 3000 },
    );
    const finishButton = screen.getByTestId(FINISH_RECIPE_BTN);
    expect(finishButton).toBeDisabled();
    const ingredients = screen.getAllByRole('checkbox');
    ingredients.forEach((ingredient) => userEvent.click(ingredient));
    ingredients.forEach((ingredient) => expect(ingredient).toBeChecked());
    expect(finishButton).not.toBeDisabled();
    userEvent.click(finishButton);
    expect(history.location.pathname).toBe('/done-recipes');
  });

  it(`Testando se o botão finish é habilitado quando todos
  os ingredientes estão selecionados para bebidas`, async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    history.push(PATH_DRINKS);
    await waitFor(
      () => {
        screen.getByRole('heading', { name: 'GG', level: 3 });
      },
      { timeout: 3000 },
    );
    const finishButton = screen.getByTestId(FINISH_RECIPE_BTN);
    expect(finishButton).toBeDisabled();
    const ingredients = screen.getAllByRole('checkbox');
    ingredients.forEach((ingredient) => userEvent.click(ingredient));
    ingredients.forEach((ingredient) => expect(ingredient).toBeChecked());
    expect(finishButton).not.toBeDisabled();
    userEvent.click(finishButton);
    expect(history.location.pathname).toBe('/done-recipes');
  });

  it(`Testando se ao renderizar a página os ingredientes
   anteriores continuam selecionados para comida`, async () => {
    jest.spyOn(global, 'fetch');

    localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({
        cocktails: {},
        meals: { 52768: [0, FOUR, SEVEN] },
      }),
    );

    const { history } = renderWithRouter(<App />);
    history.push(PATH_FOODS);
    await waitFor(
      () => {
        screen.getByText(/Apple Frangipan Tart/i);
      },
      { timeout: 3000 },
    );
    const ingredients = screen.getAllByRole('checkbox');
    expect(ingredients[0]).toBeChecked();
    expect(ingredients[FOUR]).toBeChecked();
    expect(ingredients[SEVEN]).toBeChecked();
  });

  it(`Testando se ao renderizar a página os ingredientes
   anteriores continuam selecionados para bebida`, async () => {
    jest.spyOn(global, 'fetch');

    localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({
        cocktails: { 15997: [0] },
        meals: {},
      }),
    );

    const { history } = renderWithRouter(<App />);
    history.push(PATH_DRINKS);
    await waitFor(
      () => {
        screen.getByRole('heading', { name: 'GG', level: 3 });
      },
      { timeout: 3000 },
    );
    const ingredients = screen.getAllByRole('checkbox');
    expect(ingredients[0]).toBeChecked();
  });
});
