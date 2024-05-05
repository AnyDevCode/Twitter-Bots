const { Rettiwt } = require('rettiwt-api');
const cron = require('node-cron');
const axios = require('axios');

const rettiwt = new Rettiwt({ apiKey: process.env.TWITTER_THE_ANY_BOT_TOKEN });

// Every day to 8 AM
// API https://frasedeldia.azurewebsites.net/api/phrase {"phrase":"Hay palabras que suben como el humo, y otras que caen como la lluvia.","author":"Madame de Sévigné"}
cron.schedule('0 8 * * *', async () => {
  try {
    const response = await axios.get('https://frasedeldia.azurewebsites.net/api/phrase');
    const { phrase, author } = response.data;
    const tweet = `"${phrase}"\n\n- ${author}`;
    await rettiwt.tweet.tweet(tweet);
  } catch (error) {
    console.error(error);
  }
},
  {
    scheduled: true,
    timezone: "America/Lima"
  });