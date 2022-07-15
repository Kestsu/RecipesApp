import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';

function Recipes() {
  const history = useHistory();
  const { data, search, recipesData } = useContext(RecipesContext);

  console.log(recipesData);

  useEffect(() => {
    const pathName = history.location.pathname;
    data(pathName, search.option, search.text);
  }, [search]);

  return (
    <div>Olá</div>
  );
}

export default Recipes;
