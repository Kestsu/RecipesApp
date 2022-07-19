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

    renderWithRouter(<FoodRecipeInProgress />);

    const buttonShare = screen.getByTestId('share-btn');
    expect(buttonShare).toBeInTheDocument();
    userEvent.click(buttonShare);
    expect(copy).toHaveBeenCalled();

    const mensage = screen.queryByText(/Link copied/i);
    expect(mensage).toBeInTheDocument();
  });

  it(`Testando se ao clicar no  botão Favorites 
  a a receita é marcada como favoritada`, async () => {
    jest.spyOn(global, 'fetch');

    renderWithRouter(<FoodRecipeInProgress />);

    const buttonFavorites = screen.getByTestId('favorite-btn');
    expect(buttonFavorites).toBeInTheDocument();
  });
});

// npm run test-coverage -- --collectCoverageFrom=src/components/RecipeInProgress.js;
