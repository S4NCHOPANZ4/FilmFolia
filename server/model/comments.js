const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  movie: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  interactions: {
    interactions_likes: {
        type: Number,
        default: 0,
      },
    likes: [
      {
        clicked: {
          type: Boolean,
          default: false,
        },
        like: {
          type: Boolean,
          default: false,
        },
        user: {
          type: Object,
          required: true,
        },
      },
    ],

    comments: [
      {
        comments: {
          type: String,
        },
        userId: {
          type: String,
        },
        userName: {
          type: String,
        },
        interactions_likes: {
          type: Number,
          default: 0,
        },
        likes: [
          {
            clicked: {
              type: Boolean,
              default: false,
            },
            like: {
              type: Boolean,
              default: false,
            },
            user: {
              type: Object,
              required: true,
            },
          },
        ],
    
      },
    ],
  },
});

module.exports = mongoose.model("Comments", orderSchema);
