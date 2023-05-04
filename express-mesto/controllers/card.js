import Card from '../models/card';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenError from '../errors/ForbiddenError';
import BadRequestError from '../errors/BadRequestError';

export function getAllCards(req, res, next) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
}

export function createCard(req, res, next) {
  const {
    name,
    link,
  } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((result) => result.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданны некорректные данные при создании карточки: ${Object.values(err.errors)[0].message}`));
      } else {
        next(err);
      }
    });
}

export function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Данной карточки нет');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удаление не возможно. Вы не являетесь создателем данной карточки');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .populate(['owner', 'likes'])
          .then((result) => {
            res.send(result);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
}

export function likeCard(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError(`Передан несуществующий id=${req.params.cardId} карточки.`);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: id=${req.params.cardId} для постановки лайка.`));
      } else {
        next(err);
      }
    });
}

export function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError(`Передан несуществующий id=${req.params.cardId} карточки.`);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: id=${req.params.cardId} для снятия лайка.`));
      } else {
        next(err);
      }
    });
}
