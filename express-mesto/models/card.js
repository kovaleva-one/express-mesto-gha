const mongoose = require('mongoose');

const validator = require('validator');

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
      validator: (link) => validator.isURL(link),
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

module.exports = mongoose.model('card', cardSchema);
