const Card = require('../models/card');
const HttpError = require('../utils/HttpError');

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
    .orFail(new HttpError(404, 'idError', 'Карточка по указанному id не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .populate(['owner', 'likes'])
          .then((delCard) => res.send(delCard))
          .catch(next);
      } else {
        throw new HttpError(403, 'forbiddenError', 'Нет прав для удаления');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new HttpError(404, 'idError', 'Карточка по указанному id не найдена'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new HttpError(404, 'idError', 'Карточка по указанному id не найдена'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};
