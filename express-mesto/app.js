const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-unresolved
const { celebrate, Joi, errors } = require('celebrate');
const HttpError = require('./utils/HttpError.js');

const { PORT = 3000 } = process.env;

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');

app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/(www\.)?)[\w\-._~:/?#[\]@!$&'()*+,;]+\.[\w\-._~:/?#[\]@!$&'()*+,;]+#?$/),
  }),
}), createUser);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);

// eslint-disable-next-line no-unused-vars
app.get('*', (req, res) => {
  throw new HttpError(404, 'notFoundError', 'Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { code = 500, message } = err;
  res.status(code).send({ message: code === 500 ? 'Ошибка сервера' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
