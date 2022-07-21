export const readStorageDoneRecipes = () => {
  if (!localStorage.getItem('doneRecipes')) {
    localStorage.setItem('doneRecipes', JSON.stringify([]));
  }

  return JSON.parse(localStorage.getItem('doneRecipes'));
};

export const saveStorageDoneRecipes = (recipe) => {
  if (!localStorage.getItem('doneRecipes')) {
    localStorage.setItem('doneRecipes', JSON.stringify([recipe]));
  } else {
    const oldData = JSON.parse(localStorage.getItem('doneRecipes'));
    const newData = [...oldData, recipe];
    localStorage.setItem('doneRecipes', JSON.stringify(newData));
  }
};

export const readStorageInProgressRecipes = () => {
  if (!localStorage.getItem('inProgressRecipes')) {
    localStorage.setItem(
      'inProgressRecipes',
      JSON.stringify({
        cocktails: {},
        meals: {},
      }),
    );
  }

  return JSON.parse(localStorage.getItem('inProgressRecipes'));
};

export const saveStorageInProgressRecipes = (group, id, list) => {
  const inLocalStorage = readStorageInProgressRecipes();

  const newData = {
    ...inLocalStorage,
    [group]: { ...inLocalStorage[group], [id]: list },
  };
  localStorage.setItem('inProgressRecipes', JSON.stringify(newData));
};

export const readStorageFavoriteRecipes = () => {
  if (!localStorage.getItem('favoriteRecipes')) {
    localStorage.setItem('favoriteRecipes', JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem('favoriteRecipes'));
};

export const saveStorageFavoriteRecipes = (recipe) => {
  if (!localStorage.getItem('favoriteRecipes')) {
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));
  } else {
    const oldData = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newData = [...oldData, recipe];
    localStorage.setItem('favoriteRecipes', JSON.stringify(newData));
  }
};
