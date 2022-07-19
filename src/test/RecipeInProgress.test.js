import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';
import FoodRecipeInProgress from '../pages/FoodRecipeInProgress';

const copy = require('clipboard-copy');

jest.mock('clipboard-copy');

const EMAIL_INPUT = 'email-input';
const PASSWORD_INPUT = 'password-input';
const LOGIN_SUBMIT_BTN = 'login-submit-btn';
const EMAIL = 'grupo14@gmail.com';
const RECIPE_CARD = '0-recipe-card';

describe('Testando página RecipeInProgress', () => {
  afterEach(() => jest.restoreAllMocks());

  it('Testando se os elementos são renderizados corretamente para comidas', async () => {
    jest.spyOn(global, 'fetch');

    renderWithRouter(<App />);

    const email = screen.getByTestId(EMAIL_INPUT);
    const password = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByTestId(LOGIN_SUBMIT_BTN);

    userEvent.type(email, EMAIL);
    userEvent.type(password, '1234567');

    userEvent.click(button);

    await waitFor(
      () => {
        const corbaRecipe = screen.getByTestId(RECIPE_CARD);
        userEvent.click(corbaRecipe);
      },
      { timeout: 4000 },
    );

    const buttonStart = screen.getByTestId('start-recipe-btn');
    expect(buttonStart).toBeInTheDocument();

    userEvent.click(buttonStart);

    const recipeImg = screen.getByTestId('recipe-photo');
    const recipeTitle = screen.getByTestId('recipe-title');
    const buttonShare = screen.getByTestId('share-btn');
    const buttonFavorites = screen.getByTestId('favorite-btn');
    const recipeCategory = screen.getByTestId('recipe-category');
    const ingredientTitle = screen.getByRole('heading', { name: /ingredients/i });
    const instructionsTitle = screen.getByRole('heading', { name: /instructions/i });
    const instructions = screen.getByTestId('instructions');

    const buttonFinish = screen.getByRole('button', {
      name: /finish/i,
    });

    expect(recipeImg).toBeInTheDocument();
    expect(recipeTitle).toBeInTheDocument();
    expect(buttonShare).toBeInTheDocument();
    expect(buttonFavorites).toBeInTheDocument();
    expect(recipeCategory).toBeInTheDocument();
    expect(ingredientTitle).toBeInTheDocument();
    expect(instructionsTitle).toBeInTheDocument();
    expect(instructions).toBeInTheDocument();
    expect(buttonFinish).toBeInTheDocument();
  });

  it(`Testando se ao clicar no  botão Share 
  a mensagem "Link copied!" é renderizada para a página de comidas`, async () => {
    jest.spyOn(global, 'fetch');

    renderWithRouter(<App />);

    const email = screen.getByTestId(EMAIL_INPUT);
    const password = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByTestId(LOGIN_SUBMIT_BTN);

    userEvent.type(email, EMAIL);
    userEvent.type(password, '1234567');

    userEvent.click(button);

    await waitFor(
      () => {
        const corbaRecipe = screen.getByTestId(RECIPE_CARD);
        userEvent.click(corbaRecipe);
      },
      { timeout: 4000 },
    );

    const buttonShare = screen.getByTestId('share-btn');
    expect(buttonShare).toBeInTheDocument();
    userEvent.click(buttonShare);
    expect(copy).toHaveBeenCalled();

    const mensage = screen.queryByText(/Link copied/i);
    expect(mensage).toBeInTheDocument();
  });

  it(`Testando se o Botão de finalizar receita
      só é Habilitado após todos os check-Box serem preenchidos`, async () => {
    jest.spyOn(global, 'fetch');

    renderWithRouter(<App />);

    const email = screen.getByTestId(EMAIL_INPUT);
    const password = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByTestId(LOGIN_SUBMIT_BTN);

    userEvent.type(email, EMAIL);
    userEvent.type(password, '1234567');

    userEvent.click(button);

    const drinkButton = screen.getByTestId('drinks-bottom-btn');

    userEvent.click(drinkButton);

    await waitFor(
      () => {
        const ggRecipe = screen.getByTestId(RECIPE_CARD);
        userEvent.click(ggRecipe);
      },
      { timeout: 4000 },
    );

    const buttonStart = screen.getByTestId('start-recipe-btn');
    expect(buttonStart).toBeInTheDocument();

    userEvent.click(buttonStart);

    const checkBoxGaliano = await screen.findByTestId('Galliano');
    const checkBoxGingerAle = await screen.findByTestId('Ginger ale');
    const checkBoxIce = await screen.findByTestId('Ice');

    expect(checkBoxGaliano).toBeInTheDocument();
    expect(checkBoxGingerAle).toBeInTheDocument();
    expect(checkBoxIce).toBeInTheDocument();

    const buttonFinish = screen.getByTestId('finish-recipe-btn');
    expect(buttonFinish).toBeInTheDocument();
    expect(buttonFinish).toBeDisabled();

    userEvent.type(checkBoxGaliano);
    userEvent.type(checkBoxGingerAle);
    userEvent.type(checkBoxIce);

    expect(buttonFinish).toBeEnabled();

    userEvent.click(buttonFinish);

    const doneRecipesTitle = screen.getByRole('heading', {
      name: /done recipes/i,
    });

    expect(doneRecipesTitle).toBeInTheDocument();
  });

  it(`Testando se ao clicar no  botão Favorites 
  a a receita é marcada como favoritada`, async () => {
    jest.spyOn(global, 'fetch');

    renderWithRouter(<FoodRecipeInProgress />);

    const buttonFavoritesWhiteHeart = screen.getByRole('button', {
      name: /whitehearticon/i,
    });
    expect(buttonFavoritesWhiteHeart).toBeInTheDocument();

    userEvent.click(buttonFavoritesWhiteHeart);

    const buttonFavoritesBlackHeart = screen.getByRole('button', {
      name: /blackhearticon/i,
    });

    expect(buttonFavoritesBlackHeart).toBeInTheDocument();

    userEvent.click(buttonFavoritesWhiteHeart);
    expect(buttonFavoritesWhiteHeart).toBeInTheDocument();
  });
});
// npm run test-coverage -- --collectCoverageFrom=src/components/RecipeInProgress.js;
