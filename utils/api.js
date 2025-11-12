const axios = require('axios');
const { API_BASE } = require('../config/config');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

module.exports = api;
