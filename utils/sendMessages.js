const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);
const sendMessage = (to, body) => {
  client.messages
    .create({
      body: body,
      to: to,
      from: '+14322397439',
    })
    .then((message) => console.log(message.sid));
};

module.exports = sendMessage;
