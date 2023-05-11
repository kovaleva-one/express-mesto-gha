const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');

const ForbiddenError = require('../errors/ForbiddenError');

const BadRequestError = require('../errors/BadRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
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
};

module.exports.likeCard = (req, res, next) => {
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
};

module.exports.dislikeCard = (req, res, next) => {
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
};
