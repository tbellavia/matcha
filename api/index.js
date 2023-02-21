const express = require("express");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = 3000
const SECRET = 'secret'

const app = express();

app.use(cors())                                 
app.use(morgan('tiny'))                         
app.use(express.json())                         
app.use(express.urlencoded({ extended: true }))

const extractBearerToken = headerValue => {
  if (typeof headerValue !== 'string') {
      return false
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i)
  return matches && matches[2]
}


const users = [
  { id: 1, username: 'admin', password: 'password123' },
  { id: 2, username: 'test', password: 'password123' },
  { id: 3, username: 'test2', password: 'password123' }
]

app.listen(PORT, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

app.get("/", (req, res) => {
  res.send("Bonjour le monde...");
});

app.get('/login', (req, res) => {
  // Pas d'information à traiter
  if (!req.query.username || !req.query.password) {
      return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
  }

  // Checking
  const user = users.find(u => u.username === req.query.username && u.password === req.query.password)

  // Pas bon
  if (!user) {
      return res.status(400).json({ message: 'Error. Wrong login or password' })
  }

  const token = jwt.sign({
      id: user.id,
      username: user.username
  }, SECRET, { expiresIn: '3 hours' })

  return res.json({ access_token: token })
})

app.get('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' })
})
