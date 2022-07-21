import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
// import { maxWidth } from '@mui/system';
import React from 'react';
import PropTypes from 'prop-types';

function CardRecipeDone({
  nationality,
  category,
  alcoholicOrNot,
  name,
  image,
  doneDate,
  tags,
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
        <IconButton
          aria-label="share"
          data-testid={ `${index}-horizontal-share-btn` }
        >
          <ShareIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          data-testid={ `${index}-horizontal-name" ` }
        >
          { name }
        </Typography>
        <Typography
          variant="body2"
          data-testid={ `${index}-horizontal-done-date` }
        >
          { doneDate }
        </Typography>
        { tags.map((tag) => (
          <Chip key={ tag } label={ tag } size="small" />
        ))}
      </CardContent>
    </Card>
  );
}

CardRecipeDone.propTypes = {
  nationality: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  alcoholicOrNot: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  doneDate: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  index: PropTypes.number.isRequired,
};

export default CardRecipeDone;
