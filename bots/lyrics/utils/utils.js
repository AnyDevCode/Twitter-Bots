const axios = require('axios');
const fs = require('node:fs');

const artists = ["The Living Tombstone", "Andrew Underberg", "Set It Off", "Fall Out Boys", "CG5", "Silva Hound", "DaGames", "Black Gryph0n", "STARSET", "Taylor Swift", "Ariana Grande", "Lady Gaga", "Imagine Dragons", "Panic! At The Disco", "Twenty One Pilots", "Billie Eilish", "The Weeknd", "Dua Lipa", "Selena Gomez", "Justin Bieber", "Shawn Mendes", "Camila Cabello", "Ed Sheeran", "Katy Perry", "Corazon Serran", "Kawai Sprite", "TWICE", "Stray Kids", "New Jeans", "Marshmello", "Daddy Yankee", "Luis Fonsi", "Toby Fox", "Peso Pluma", "Natanael Cano", "Bad Bunny", "J Balvin", "Ozuna", "Anuel AA", "Karol G", "OR3O", "Or3o funked up", "The Stupendium"]

async function publishALyricQuote(rettiwt) {
    const artist = artists[Math.floor(Math.random() * artists.length)];
    const response = await axios.get(`https://lyric.mackle.im/api?artist=${encodeURIComponent(artist)}`);
    let { lyrics, title, image } = response.data.info;
    const tweet = `"${lyrics}"\n\n- ${title}`;
    if (lyrics.length > 280) {
        await publishALyricQuote(rettiwt);
        return;
    }
    // Download temporary image
    // Title format to make the image name
    title = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const imagePath = `./${title}.png`;
    const writer = fs.createWriteStream(imagePath);
    const imageResponse = await axios.get(image, { responseType: 'stream' });
    imageResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
    await rettiwt.tweet.tweet(tweet, [{ path: imagePath }]);
    fs.unlinkSync(imagePath);
}

module.exports = {
    publishALyricQuote
}