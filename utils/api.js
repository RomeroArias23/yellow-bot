const axios = require('axios');
const { API_BASE } = require('../config/config');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  validateStatus: () => true // evita que axios bloquee respuestas 4xx/5xx
});

module.exports = api;
