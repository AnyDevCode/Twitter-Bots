
const {Schema, model} = require('mongoose');

const TweetSchema = new Schema({
    text: String,
    id: String,
    user_id: String,
    date: Date,
});

// create a model using tweetSchema
const TweetModel = model('TweetSchema', TweetSchema);

// create a module.exports using tweetSchema and make function to add, or delete, and get, and has function
module.exports = {
    addTweet: async (text, id, user_id)=> {
        const date = new Date();
       await TweetModel.create({text, id, user_id, date});
    },
    deleteTweet: async (id)=> {
        await TweetModel.findOneAndDelete({id});
    },
    getTweet: async (id)=> {
        return await TweetModel.findOne({id});
    },
    getLastTweet: async ()=> {
        console.log("gettin twuits")
        return (await TweetModel.findOne().sort({date: -1}))[0];
    },
    hasTweet: async (id)=> {
        return await TweetModel.exists({id});
    }
};