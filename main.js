// Import required modules
const express = require('express');
const helmet = require('helmet');
const initBot = require('./bot.js');
// Create an instance of Express
const app = express();
const port = 3000;
app.use(helmet());

const bot = initBot(); // maybe config.config


/**
 * GET GET_CHANNEL_MESSAGES
 * POST SEND_MESSAGE
 * 
 */

// Define your routes
// Example GET route
app.get('/api/twitch/channelmessages', (req, res) => {
  // Logic to fetch users from the database or any other data source
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ];

  // Send the users as a JSON response
  res.json(users);
});

// Example POST route
app.post('/api/users', (req, res) => {
  // Logic to create a new user
  res.send('User created successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
