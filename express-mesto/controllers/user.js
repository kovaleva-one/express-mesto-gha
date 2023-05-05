const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

dotenv.config();

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
}

module.exports = { getUsers };

function findUserById(id, res, next) {
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`Пользователь с указанным _id=${id} не найден.`);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные: _id=${id} при запросе информации о пользователе.`));
      } else {
        next(err);
      }
    });
}

function getUserById(req, res, next) {
  findUserById(req.params.userId, res, next);
}

module.exports = {
  getUserById,
};

function getMe(req, res, next) {
  findUserById(req.user._id, res, next);
}

module.exports = {
  getMe,
};

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const userOutOfPassword = user.toObject();
      delete userOutOfPassword.password;
      res.send(userOutOfPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя: ${Object.values(err.errors)[0].message}`));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный email уже занят'));
      } else {
        next(err);
      }
    });
}

module.exports = { createUser };

function updateUserInfo(req, res, next) {
  const {
    name,
    about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`Пользователь c указанным _id=${req.user._id} не найден.`);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные при обновлении пользователя: ${Object.values(err.errors)[0].message}`));
      } else {
        next(err);
      }
    });
}
module.exports = { updateUserInfo };

function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`Пользователь c указанным _id=${req.user._id} не найден.`);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
}

module.exports = { updateUserAvatar };

function login(req, res, next) {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => next(err));
}

module.exports = { login };
