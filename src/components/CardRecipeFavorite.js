import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
// import { maxWidth } from '@mui/system';
import React from 'react';
import PropTypes from 'prop-types';

function CardRecipeFavorite({
  nationality,
  category,
  alcoholicOrNot,
  name,
  image,
  index,
}) {
  const getCaption = () => {
    const captionOptions = [nationality, category, alcoholicOrNot];
    const captionString = captionOptions.filter((option) => option !== '').join(' - ');
    return captionString;
  };

  return (
    <Card sx={ { maxWidth: 500 } }>
      <CardMedia
        component="img"
        height="140"
        image={ image }
        data-testid={ `${index}-horizontal-image` }
      />
      <CardContent>
        <Divider>
          <Typography
            variant="caption"
            display="block"
            data-testid={ `${index}-horizontal-top-text` }
          >
            { getCaption() }
          </Typography>
        </Divider>
        <Typography
          variant="h6"
          component="div"
          data-testid={ `${index}-horizontal-name" ` }
        >
          { name }
        </Typography>
        <CardActions>
          <IconButton
            aria-label="share"
            data-testid={ `${index}-horizontal-share-btn` }
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            aria-label="favorite"
            data-testid={ `${index}-horizontal-share-btn` }
          >
            <FavoriteIcon />
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  );
}

CardRecipeFavorite.propTypes = {
  nationality: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  alcoholicOrNot: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default CardRecipeFavorite;
