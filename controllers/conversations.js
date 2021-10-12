const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { Conversation } = require('../models/conversation');
const { Message } = require('../models/message');

router.get('/', [verifyToken], async (req, res) => {
  const user = req.user;
  const conversations = await Conversation.find({
    participents: {
      $elemMatch: {
        _id: user._id,
      },
    },
  });

  const getConversation = async (conversationId) => {
    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: 1 });

    return messages;
  };

  let newConversations = conversations.map(async (conv) => {
    const newConv = { ...conv.toJSON() };
    const messages = await getConversation(newConv._id);
    if (messages.length > 0) {
      newConv.lastMessage = messages[messages.length - 1];
    } else {
      newConv.lastMessage = null;
    }
    newConv.messages = messages;
    return newConv;
  });

  newConversations = await Promise.all(newConversations);
  // sort the conversations by last message createdAt
  newConversations = newConversations.sort((a, b) => {
    if (a.lastMessage && b.lastMessage) {
      return b.lastMessage.createdAt - a.lastMessage.createdAt;
    }
    return 0;
  });

  res.send(newConversations);
});

module.exports = router;
