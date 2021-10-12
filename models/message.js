const mongoose = require('mongoose');
const Joi = require('joi');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Room',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  attachments: {
    type: [String],
    default: [],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message,
};
