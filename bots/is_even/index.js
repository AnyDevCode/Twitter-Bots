const { Rettiwt } = require('rettiwt-api');
const colors = require('colors');

const { tweets: Tweet } = require('./utils/mongodb');


const rettiwt = new Rettiwt({ apiKey: process.env.TWITTER_IS_EVEN_BOT_TOKEN });

(async () => {

    try {
        for await (const tweet of rettiwt.tweet.stream({ mentions: ["is_even_bot"] }, 1000 * 60 * 2)) {
            // If tweet exists, check if the tweet is a number or a list of numbers
            if (await Tweet.hasTweet(tweet.id)) continue;
            if (tweet.tweetBy.userName.toLocaleLowerCase() === "is_even_bot") continue;

            // Console log with color informing found a new tweet
            console.log(colors.green("Found a new tweet!"));

            //Remove tagged persons from the tweet
            tweet.fullText = tweet.fullText.replace(/@\w+/g, "");

            //Remove hashtags from the tweet
            tweet.fullText = tweet.fullText.replace(/#\w+/g, "");

            //Remove urls from the tweet
            tweet.fullText = tweet.fullText.replace(/https?:\/\/\S+/g, "");

            // The text of the tweet is like "@is_even_bot 1234567890" or "1234567890 @is_even_bot", "123 @is_even_bot 456", etc.
            // If have a number, check if the number is even or odd and reply to the tweet
            // If have more than one number, check all the numbers and reply to the tweet
            // If not, ignore the tweet
            let numbers = tweet.fullText.match(/\d+/g);
            if (!numbers) {
                await Tweet.addTweet(tweet.fullText, tweet.id, tweet.tweetBy.userName)
                continue;
            }

            // If the array have repeated numbers, remove the repeated numbers
            numbers = numbers.filter((number, index) => numbers.indexOf(number) === index);
            const tweetId = tweet.id;
            const tweetNumbers = numbers.map(Number);
            const isEven = tweetNumbers.map(number => number % 2 === 0);
            let reply = tweetNumbers.map((number, index) => `${number} is ${isEven[index] ? "even" : "odd"}`).join(", ");
            // If the tweet is more than 280 characters, only show thre answer of the numbers that fit in the tweet
            if (reply.length > 280) {
                const evenNumbers = [];
                const oddNumbers = [];
                for (let i = 0; i < tweetNumbers.length; i++) {
                    if (reply.length + tweetNumbers[i].toString().length + 8 > 280) {
                        break;
                    }
                    if (isEven[i]) {
                        evenNumbers.push(tweetNumbers[i]);
                    } else {
                        oddNumbers.push(tweetNumbers[i]);
                    }
                }

                const evenReply = evenNumbers.map(number => `${number} is even`).join(", ");
                const oddReply = oddNumbers.map(number => `${number} is odd`).join(", ");
                reply = `${evenReply}${evenReply && oddReply ? ", " : ""}${oddReply}`;
            }
            await rettiwt.tweet.favorite(tweetId);
            await rettiwt.tweet.tweet(reply, [], tweetId);
            await Tweet.addTweet(tweet.fullText, tweet.id, tweet.tweetBy.userName)
        }
    } catch (error) {
        console.error(error);
    }

    console.log("Super mega usefull bot \"is_even_bot\" is now on!")

})();

