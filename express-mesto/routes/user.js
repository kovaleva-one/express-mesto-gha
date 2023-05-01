import { Router } from 'express';

import { celebrate, Joi } from 'celebrate';
import {
  getMe,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/user.js';
import urlRegex from '../utils/constants.js';

const usersRouter = Router();

usersRouter.get('/', getUsers);

usersRouter.get('/me', getMe);

usersRouter.get('/:userId', celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required()
        .hex()
        .length(24),
    }),
}), getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
    }),
}), updateUserInfo);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .regex(urlRegex)
        .uri({ scheme: ['http', 'https'] }),
    }),
}), updateUserAvatar);

export default usersRouter;
