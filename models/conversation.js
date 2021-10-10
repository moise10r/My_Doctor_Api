const mongoose = require('mongoose');
const { User } = require('./user');

const conversationSchema = new mongoose.Schema({
  participents: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      lastName: String,
      email: String,
      profileImage: String,
      name: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

const createConversation = async () => {
  const firstUser = await User.findOne({ email: 'user1@gmail.com' });
  const secondUser = await User.findOne({ email: 'user2@gmail.com' });
  const conv = new Conversation({
    participents: [
      {
        _id: firstUser._id,
        name: firstUser.name,
        lastName: firstUser.lastName,
        email: firstUser.email,
        profileImage: firstUser.profileImage,
      },
      {
        _id: secondUser._id,
        name: secondUser.name,
        lastName: secondUser.lastName,
        email: secondUser.email,
        profileImage: secondUser.profileImage,
      },
    ],
    lastMessage: {
      text: 'Hello',
      createdAt: Date.now(),
      senderId: firstUser._id,
    },
  });
  return conv.save();
};

module.exports = {
  Conversation,
};
