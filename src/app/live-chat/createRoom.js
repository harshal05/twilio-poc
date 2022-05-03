const accountSid = 'AC2a51c438d5a0a4be53931ddb4f84c8a5';
const authToken = '5d63dea933797bf8a7e98c9892743258';
const client = require('twilio')(accountSid, authToken);

client.video.rooms.create({type: 'go', uniqueName: 'My First Video Room'})
                  .then(room => console.log(room.sid));