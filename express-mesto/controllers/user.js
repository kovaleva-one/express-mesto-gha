const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../errors/HTTPError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .orFail(new HttpError(404, 'idError', 'Пользователь по указанному id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new HttpError(404, 'idError', 'Пользователь по указанному id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    })
      .then((user) => res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }))
      .catch((err) => {
        if (err.name === 'MongoServerError' && err.code === 11000) {
          next(new HttpError(409, 'ConflictError', 'Пользоватьель с таким email уже существует'));
        } else {
          next(new HttpError(400, 'ValidationError', 'Переданы некорректные данные при создании пользователя'));
        }
      }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new HttpError(404, 'idError', 'Пользователь по указанному id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(new HttpError(404, 'idError', 'Пользователь по указанному id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true }).send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};
