if(process.env.NODE_ENV !== "production") require("dotenv").config({ path: require("node:path").join(__dirname, ".env.local") })

const cron = require('node-cron');
const colors = require('colors');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

// read the folder bots and require all the files (index.js)
const normalizedPath = path.join(__dirname, "bots");
const oldConsoleLog = console.log;

console.log = (...msg) => {
  // get the file and line
  const stack = new Error().stack.split("\n");
  const file = stack[2].split("/").pop().split(":")[1];
  const line = stack[2].split("/").pop().split(":")[2];
  // get the bot folder, the next folder in \bots\$folder ($folder is the folder duh)
  var botFolder = file.split("\\");
  botFolder = botFolder[botFolder.indexOf("bots") + 1];

  const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  oldConsoleLog(`[${colors.green(date)}] [${colors.yellow(botFolder || "Unknown")}] [${file.includes(botFolder) ? colors.blue(`${file.split(botFolder)[1]}:${line}`) : colors.blue(`${file}:${line}`)}]:`, ...msg);
}

fs.readdirSync(normalizedPath).forEach((file) => {
  if (file !== "index.js") {
    // read bot.json data
    const botData = require(path.join(normalizedPath, file, "bot.json"));
    // get the bot file
    if (botData.disabled) return;
    console.log(`Trying open bot ${botData.name} (${botData.version}) by ${botData.author}...`)
    require(path.join(normalizedPath, file, botData.entryPoint));
    console.log(`Bot ${botData.name} (${botData.version}) by ${botData.author} is running!`)
  }
})

cron.schedule('*/5 * * * *', async () => {
  try {
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const cpuUsagePercentage = Math.floor((cpuUsage.user + cpuUsage.system) / 1000000 / 1000 * 100);
    console.log(`CPU Usage: ${cpuUsagePercentage}%`);
    console.log(`Memory Usage: ${Math.floor(memoryUsage.heapUsed / 1000000)}MB used, ${Math.floor(memoryUsage.heapTotal / 1000000)}MB total`);
    console.log(`Total Memory: ${Math.floor(totalMemory / 1000000)}MB, Free Memory: ${Math.floor(freeMemory / 1000000)}MB`);
  } catch (error) {
    console.error(error);
  }
})