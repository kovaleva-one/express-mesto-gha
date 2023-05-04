import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { celebrate, errors, Joi } from 'celebrate';
import usersRouter from './routes/user';
import cardRouter from './routes/card';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import NotFoundError from './errors/NotFoundError';
import centralizedError from './middlewares/centralizedError';
import urlRegex from './utils/constants';
import { errorLogger, requestLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/mestodb')
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(`Connection to database was failed with error ${err}`);
  });

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
    }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .regex(urlRegex)
        .uri({ scheme: ['http', 'https'] }),
    }),
}), createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardRouter);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(centralizedError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listen on PORT ${PORT}`);
});
