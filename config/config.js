require('dotenv').config();

module.exports = {
  TOKEN: process.env.DISCORD_TOKEN,
  API_BASE: process.env.API_BASE || 'https://yellow-project-api.onrender.com'
};
