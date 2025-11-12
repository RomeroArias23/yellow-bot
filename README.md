# 💛 { YELLOW } — Discord Bot

> “import { YELLOW } from ./CVLTVRE”  
> A creative and modular Discord bot built with Node.js and Discord.js that connects to a custom API for anonymous messages, letter searches, and a chill radio feature.

---

## 🌟 Overview

{ YELLOW } is a modular, easy-to-maintain Discord bot designed for creative community engagement.  
It allows users to:

- 💌 Create anonymous “letters” stored in your API  
- 🔍 Search existing letters by addressee  
- 🧠 Use a clean and extensible modular structure (commands, events, utils)
---

## 🧩 Features

| Command | Description |
|----------|--------------|
| `!carta <Destinatario> | <Mensaje>` | Creates and stores an anonymous letter (max 300 chars) |
| `!buscar <Destinatario>` | Searches letters by addressee |
| *(more commands coming soon)*

---

## 🏗️ Project Structure

bot-yellow/
├── commands/ # Bot commands
│ ├── carta.js
│ ├── buscar.js
│ └── radio.js
│
├── events/ # Discord event handlers
│ ├── ready.js
│ └── messageCreate.js
│
├── utils/ # Helper functions (e.g., API client)
│ └── api.js
│
├── config/ # Configuration and environment variables
│ └── config.js
│
├── index.js # Main bot entry point
├── package.json
├── .env # Environment variables (never commit this!)
└── README.md
