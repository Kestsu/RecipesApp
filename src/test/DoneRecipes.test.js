import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';

const copy = require('clipboard-copy');

jest.mock('clipboard-copy');

const setFavLocalStorageKey = () => {
  localStorage.setItem(
    'doneRecipes',
    JSON.stringify([
      {
        id: '52771',
        type: 'food',
        nationality: 'Italian',
        category: 'Vegetarian',
        alcoholicOrNot: '',
        name: 'Spicy Arrabiata Penne',
        image:
          'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
        doneDate: '20/07/2022',
        tags: ['Pasta', 'Curry'],
      },
      {
        id: '178319',
        type: 'drink',
        nationality: '',
        category: 'Cocktail',
        alcoholicOrNot: 'Alcoholic',
        name: 'Aquamarine',
        image:
          'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
        doneDate: '20/07/2022',
        tags: [],
      },
    ]),
  );
};

const PATH = '/done-recipes';
const FOOD_NAME = 'Spicy Arrabiata Penne';
const IMG_FOOD = 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg';
const IMG_DRINK = 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg';
const FILTER_ALL = 'filter-by-all-btn';
const ZERO_HORIZONTAL_IMAGE = '0-horizontal-image';
const UM_HORIZONTAL_IMAGE = '1-horizontal-image';

describe('Testando página de FavoriteRecipes', () => {
  beforeEach(() => setFavLocalStorageKey());
  afterEach(() => localStorage.clear());

  it('Verifica se os botões são renderizados corretamente', () => {
    const { history } = renderWithRouter(<App />);

    history.push(PATH);

    const allButton = screen.getByTestId(FILTER_ALL);
    const foodButton = screen.getByTestId('filter-by-food-btn');
    const drinksButton = screen.getByTestId('filter-by-drink-btn');

    expect(allButton).toBeInTheDocument();
    expect(foodButton).toBeInTheDocument();
    expect(drinksButton).toBeInTheDocument();
  });

  it('Verifica se as bebidas e comidas são renderizadas corretamente', () => {
    const { history } = renderWithRouter(<App />);

    history.push(PATH);

    const allButton = screen.getByTestId(FILTER_ALL);
    userEvent.click(allButton);

    const foodImg = screen.getByTestId(ZERO_HORIZONTAL_IMAGE);
    const foodName = screen.getByRole('heading', {
      name: FOOD_NAME,
    });

    const drinkImg = screen.getByTestId(UM_HORIZONTAL_IMAGE);
    const drinkName = screen.getByRole('heading', { name: 'Aquamarine' });

    expect(foodImg).toBeInTheDocument();
    expect(foodImg).toHaveAttribute(
      'src',
      IMG_FOOD,
    );
    expect(foodName).toBeInTheDocument();

    expect(drinkImg).toBeInTheDocument();
    expect(drinkImg).toHaveAttribute(
      'src',
      IMG_DRINK,
    );
    expect(drinkName).toBeInTheDocument();
  });

  it('Testa se o filtro food funciona como o esperado', () => {
    const { history } = renderWithRouter(<App />);

    history.push(PATH);

    const foodButton = screen.getByTestId('filter-by-food-btn');
    userEvent.click(foodButton);

    const foodImg = screen.getByTestId(ZERO_HORIZONTAL_IMAGE);
    const foodName = screen.getByRole('heading', {
      name: FOOD_NAME,
    });

    const drinkImg = screen.queryByTestId(UM_HORIZONTAL_IMAGE);
    const drinkName = screen.queryByRole('heading', { name: 'Aquamarine' });

    expect(foodImg).toBeInTheDocument();
    expect(foodImg).toHaveAttribute(
      'src',
      IMG_FOOD,
    );
    expect(foodName).toBeInTheDocument();

    expect(drinkImg).not.toBeInTheDocument();
    expect(drinkName).not.toBeInTheDocument();
  });

  it('Testa se o filtro drink funciona como o esperado', () => {
    const { history } = renderWithRouter(<App />);

    history.push(PATH);

    const drinkButton = screen.getByTestId('filter-by-drink-btn');
    userEvent.click(drinkButton);

    const foodImg = screen.queryByTestId(UM_HORIZONTAL_IMAGE);
    const foodName = screen.queryByRole('heading', {
      name: 'FOOD_NAME',
    });

    const drinkImg = screen.getByTestId(ZERO_HORIZONTAL_IMAGE);
    const drinkName = screen.getByRole('heading', { name: 'Aquamarine' });

    expect(foodImg).not.toBeInTheDocument();
    expect(foodName).not.toBeInTheDocument();

    expect(drinkImg).toBeInTheDocument();
    expect(drinkImg).toHaveAttribute(
      'src',
      IMG_DRINK,
    );
    expect(drinkName).toBeInTheDocument();
  });

  it(`Verifica se ao clicar no  botão Share 
  a mensagem "Link copied!" é renderizada`, () => {
    const { history } = renderWithRouter(<App />);

    history.push(PATH);

    const allButton = screen.getByTestId(FILTER_ALL);
    userEvent.click(allButton);

    const shareButtonFood = screen.getByTestId('0-horizontal-share-btn');
    userEvent.click(shareButtonFood);

    const messageFood = screen.getAllByText(/Link copied!/i);

    expect(copy).toHaveBeenCalled();
    expect(messageFood).toHaveLength(2);

    const shareButtonDrink = screen.getByTestId('1-horizontal-share-btn');
    userEvent.click(shareButtonDrink);

    const messageDrink = screen.getAllByText(/Link copied!/i);

    expect(copy).toHaveBeenCalled();
    expect(messageDrink).toHaveLength(2);
  });
});
