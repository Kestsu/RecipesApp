import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import fetchDetailsDrink from '../helpers/mockar';
import App from '../App';

const copy = require('clipboard-copy');

jest.mock('clipboard-copy');

const EMAIL_INPUT = 'email-input';
const PASSWORD_INPUT = 'password-input';
const LOGIN_SUBMIT_BTN = 'login-submit-btn';
const EMAIL = 'grupo14@gmail.com';
const RECIPE_CARD = '0-recipe-card';
const SIX = 6;

describe('Testando página de RecipeDetails', () => {
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

    const firstIngredient = await screen.findByTestId(
      '0-ingredient-name-and-measure',
    );
    const recipeImg = screen.getByTestId('recipe-photo');
    const buttonShare = screen.getByTestId('share-btn');
    const buttonFavorites = screen.getByTestId('favorite-btn');
    const recipeTitle = screen.getByTestId('recipe-title');
    const recipeCategory = screen.getByTestId('recipe-category');
    const ingredients = screen.getByRole('list');
    const instructions = screen.getByTestId('instructions');
    const video = screen.getByTestId('video');
    const recomendations = screen.getAllByRole('link');
    const startButton = screen.getByRole('button', { name: 'Start Recipe' });

    expect(firstIngredient).toBeInTheDocument();
    expect(recipeImg).toBeInTheDocument();
    expect(buttonShare).toBeInTheDocument();
    expect(buttonFavorites).toBeInTheDocument();
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeCategory).toBeInTheDocument();
    expect(ingredients).toBeInTheDocument();
    expect(instructions).toBeInTheDocument();
    expect(video).toBeInTheDocument();
    expect(recomendations).toHaveLength(SIX);
    expect(startButton).toBeInTheDocument();
  });
  it('Testando se os elementos são renderizados corretamente para bebidas', async () => {
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
    const firstIngredient = await screen.findByTestId(
      '0-ingredient-name-and-measure',
    );
    const recipeImg = screen.getByTestId('recipe-photo');
    const recipeTitle = screen.getByTestId('recipe-title');
    const buttonShare = screen.getByTestId('share-btn');
    const buttonFavorites = screen.getByTestId('favorite-btn');
    const recipeCategory = screen.getByTestId('recipe-category');
    const ingredients = screen.getByRole('list');
    const instructions = screen.getByTestId('instructions');
    const recomendations = screen.getAllByRole('link');
    const startButton = screen.getByRole('button', { name: 'Start Recipe' });

    expect(firstIngredient).toBeInTheDocument();
    expect(recipeImg).toBeInTheDocument();
    expect(buttonShare).toBeInTheDocument();
    expect(buttonFavorites).toBeInTheDocument();
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeCategory).toBeInTheDocument();
    expect(ingredients).toBeInTheDocument();
    expect(instructions).toBeInTheDocument();
    expect(recomendations).toHaveLength(SIX);
    expect(startButton).toBeInTheDocument();
  });
  it(`Testando se ao clicar no  botão Share 
     a mensagem "Link copied!" é renderizada para a página de comidas`, async () => {
    jest.spyOn(global, 'fetch');
    const { history } = renderWithRouter(<App />);
    const email = screen.getByTestId(EMAIL_INPUT);
    const password = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByTestId(LOGIN_SUBMIT_BTN);
    userEvent.type(email, EMAIL);
    userEvent.type(password, '1234567');
    userEvent.click(button);
    await waitFor(
      () => {
        const h3Recipe = screen.queryByRole('heading', {
          name: /corba/i,
        });
        expect(h3Recipe).toBeInTheDocument();
        userEvent.click(h3Recipe);
      },
      { timeout: 4000 },
    );
    const buttonShare = screen.getByTestId('share-btn');
    expect(buttonShare).toBeInTheDocument();
    userEvent.click(buttonShare);
    expect(copy).toHaveBeenCalled();
    const mensage = screen.queryByText(/Link copied/i);
    expect(mensage).toBeInTheDocument();
    const BTN_START_FOODS = screen.getByTestId('start-recipe-btn');
    expect(BTN_START_FOODS).toBeInTheDocument();
    userEvent.click(BTN_START_FOODS);
    const URL = history.location.pathname.includes('/foods/52977/in-progress');
    expect(URL).toBe(true);
    history.goBack();
    await waitFor(() => {
      const BTN_CONTINUE = screen.getByText(/continue recipe/i);
      expect(BTN_CONTINUE).toBeInTheDocument();
    });
  });

  it(`Testando se ao clicar no  botão Share 
  a mensagem "Link copied!" é renderizada para a página de bebidas`, async () => {
    jest.spyOn(global, 'fetch');
    const { history, debug } = renderWithRouter(<App />);
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
    const buttonShare = screen.getByTestId('share-btn');
    expect(buttonShare).toBeInTheDocument();
    userEvent.click(buttonShare);
    expect(copy).toHaveBeenCalled();
    const mensage = screen.queryByText(/Link copied/i);
    expect(mensage).toBeInTheDocument();

    const BTN_START_DRINKS = screen.getByText(/Start Recipe/i);
    expect(BTN_START_DRINKS).toBeInTheDocument();
    userEvent.click(BTN_START_DRINKS);

    console.log(history.location.pathname);
    const URL = history.location.pathname.includes('/drinks/15997/in-progress');
    expect(URL).toBe(true);

    history.goBack();
    debug();
    await waitFor(() => {
      const BTN_CONTINUE = screen.getByText(/continue recipe/i);
      expect(BTN_CONTINUE).toBeInTheDocument();
    });

    history.goBack();
    global.fetch = jest.fn(async () => ({
      json: async () => fetchDetailsDrink,
    }));
    await waitFor(
      () => {
        const ggRecipe = screen.getByTestId(RECIPE_CARD);
        userEvent.click(ggRecipe);
      },
      { timeout: 4000 },
    );
    await waitFor(
      () => {
        const name = screen.getByRole('heading', { name: /gg/i });
        expect(name).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
    const FAVORITAR = screen.getByTestId('btn-favorite');
    expect(FAVORITAR).toBeInTheDocument();
    userEvent.click(FAVORITAR);
    const LOCAL_FIRST = JSON.parse(localStorage.getItem('favoriteRecipes'));
    expect(LOCAL_FIRST).toHaveLength(1);
    userEvent.click(FAVORITAR);
    const LOCAL_SECOND = JSON.parse(localStorage.getItem('favoriteRecipes'));
    expect(LOCAL_SECOND).toHaveLength(0);
    userEvent.click(FAVORITAR);
    history.goBack();
    await waitFor(
      () => {
        const ggRecipe = screen.getByTestId(RECIPE_CARD);
        userEvent.click(ggRecipe);
      },
      { timeout: 4000 },
    );
    expect(screen.getByRole('img', { name: /blackhearticon/i })).toBeInTheDocument();
  });
});
