const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  deleteCard,
  dislikeCard,
  getAllCards,
  likeCard,
} = require('../controllers/card');

const cardRouter = Router();

cardRouter.get('/', getAllCards);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object({
    cardId: Joi.string()
      .required()
      .hex()
      .length(24),
  }),
}), deleteCard);
cardRouter.post('/', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .regex(/^(http[s]?|ftp):\/\/?([w]{3}\.)?[a-z0-9\-.]+\.[a-z]{2,}(\/.*)?$/)
        .uri(),
    }),
}), createCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string()
      .required()
      .hex()
      .length(24),
  }),
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string()
      .required()
      .hex()
      .length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
