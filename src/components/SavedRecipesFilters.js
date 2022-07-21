import { Button, ButtonGroup } from '@mui/material';
import React from 'react';

function SavedRecipesFilters() {
  return (
    <div>
      <ButtonGroup color="secondary" aria-label="medium secondary button group">
        <Button
          data-testid="filter-by-all-btn"
        >
          All
        </Button>
        <Button
          data-testid="filter-by-food-btn"
        >
          Food
        </Button>
        <Button
          data-testid="filter-by-drink-btn"
        >
          Drinks
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default SavedRecipesFilters;
