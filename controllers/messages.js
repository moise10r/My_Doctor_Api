const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { Conversation } = require('../models/conversation');
const { Doctor } = require('../models/doctor');
const { Message } = require('../models/message');
const { User } = require('../models/user');

router.post('/', [verifyToken], async (req, res) => {
  const { conversationId, text, recipientId } = req.body;
  const senderId = req.user._id;
  const sender = req.user;
  const recipient =
    (await User.findById(recipientId)) || (await Doctor.findById(recipientId));

  if (!recipient)
    return res.status(404).send({ message: 'Recipient not found' });

  if (!conversationId || !text) {
    return res.status(400).send({ message: 'Bad request' });
  }

  let conversation;

  if (conversationId === 'new') {
    conversation = await Conversation.create({
      participents: [
        {
          _id: sender._id,
          name: sender.name,
          lastName: sender.lastName,
          email: sender.email,
          profileImage: sender.profileImage,
        },
        {
          _id: recipient._id,
          name: recipient.name,
          lastName: recipient.lastName,
          email: recipient.email,
          profileImage: recipient.profileImage,
        },
      ],
    });
  } else {
    conversation = await Conversation.findById(conversationId);
    if (!conversation)
      return res.status(404).send({ message: 'Conversation not found' });
  }

  let message = await Message.create({
    conversationId: conversation._id,
    senderId,
    text,
  });

  conversation = await conversation.save();
  message = await message.save();
  if (!message || !conversation)
    return res.status(500).send({ message: 'Internal server error' });

  const messages = await Message.find({
    conversationId: conversation._id,
  });

  const newConversation = {
    ...conversation._doc,
    messages,
    lastMessage: message._doc,
  };

  res.send({ message, newConversation, conversationId });
});

module.exports = router;
