import mongoose from 'mongoose';
// eslint-disable-next-line import/named
import { URL_REGEX } from '../utils/constants.js';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Поле имя [{VALUE}] содержит менее 2 символов!'],
    maxLength: [30, 'Поле имя [{VALUE}] содержит более 30 символов!'],
    required: [true, 'Поле "имя" не заполнено!'],
  },
  link: {
    type: String,
    required: [true, 'Поле ссылки на картинку не заполнено!'],
    validate: {
      validator: (url) => URL_REGEX.test(url),
      message: 'В поле ссылка на картинку [{VALUE}] не является ссылкой!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('card', cardSchema);
