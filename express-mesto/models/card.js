// eslint-disable-next-line import/no-unresolved
const validator = require('validator');

// eslint-disable-next-line no-undef
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },

  owner: {
    // eslint-disable-next-line no-undef
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [{
    // eslint-disable-next-line no-undef
    type: mongoose.Types.ObjectId,
    ref: 'user',
    default: [],
  }],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// eslint-disable-next-line no-undef
module.exports = mongoose.model('card', cardSchema);
