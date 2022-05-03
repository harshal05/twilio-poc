const AccessToken = require("twilio").jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const VideoGrant = AccessToken.VideoGrant;

// Used when generating any kind of tokens
const twilioAccountSid = "AC2a51c438d5a0a4be53931ddb4f84c8a5";
const twilioApiKey = "SKd7219289620e0bfd12176815904d5c42";
//const twilioApiSecret = 'sC7mUmRdP1dJtdl0XNmh0wFfjDtJ6doV';
const twilioApiSecret = "MlTAfUlJdvUH4tG8iJvbxr7pJoOlA5fY";

// Used specifically for creating Chat tokens
const serviceSid = "AC2a51c438d5a0a4be53931ddb4f84c8a5";
const identity = "harshal.patil@iqvia.com";

// Create a "grant" which enables a client to use Chat as a given user,
// on a given device
const chatGrant = new ChatGrant({
  serviceSid: serviceSid,
});
const videoGrant = new VideoGrant({
  serviceSid: serviceSid,
});

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, {
  identity: identity,
});

token.addGrant(chatGrant);
token.addGrant(videoGrant);

// Serialize the token to a JWT string
console.log(token.toJwt());
