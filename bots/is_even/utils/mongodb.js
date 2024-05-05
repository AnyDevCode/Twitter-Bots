const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.TWITTER_IS_EVEN_BOT_MONGODB_URI)
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));

const tweets = require('./schemas/tweets')
module.exports = {
    mongoose,
    tweets
}