const { Rettiwt } = require('rettiwt-api');
const cron = require('node-cron');
const colors = require('colors');

const { publishALyricQuote } = require('./utils/utils');

const rettiwt = new Rettiwt({ apiKey: process.env.TWITTER_LYRICS_BOT_TOKEN });

// Every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    console.log('Publishing a new lyric quote');
    // Wait 15 to 60 seconds
    const resolveTime = Math.floor(Math.random() * 45000) + 15000;
    console.log("The tweet will be published in " + colors.green(Math.floor(resolveTime/1000)) + " seconds")
    await new Promise(resolve => setTimeout(resolve, resolveTime));
    try {
      await publishALyricQuote(rettiwt);
      console.log('Lyric quote published');
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
},
{
  scheduled: true,
  timezone: "America/Lima"
});
;

console.log(colors.green('Lyrics bot is running'));
console.log(colors.yellow('Timezone: America/Lima'));
console.log(colors.blue('Interval: Every 15 minutes'));
