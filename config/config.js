require('dotenv').config();

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,   // ✅ match Railway variable name
  API_BASE: process.env.API_BASE || 'https://yellow-project-api.onrender.com'
};
