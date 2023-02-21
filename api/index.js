const express = require("express");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require("pg");

require('dotenv').config()

const PORT = 3000
const SECRET = process.env.SECRET_KEY

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});
console.log("Connexion réussie à la base de données");

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

const checkTokenMiddleware = (req, res, next) => {
  // Récupération du token
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

  console.log("1");
  // Présence d'un token
  if (!token) {
      return res.status(401).json({ message: 'Error. Need a token' })
  }

  // Véracité du token
  jwt.verify(token, SECRET, (err, decodedToken) => {
    if (err) {
      console.log("3");
      res.status(401).json({ message: 'Error. Bad token' })
    } else {
        console.log("2");
        console.log(decodedToken);
        res.locals.id_user_profile = decodedToken.id_user_profile;
        return next();
      }
  })
}


// const users = [
//   { id: 1, username: 'admin', password: 'password123' },
//   { id: 2, username: 'test', password: 'password123' },
//   { id: 3, username: 'test2', password: 'password123' }
// ]

app.listen(PORT, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

app.get("/", (req, res) => {
  res.send("Bonjour le monde...1123");
});

app.post('/api/user/signup', (req, res) => {
  // Pas d'information à traiter
  
  if (!req.body.usermail || !req.body.passWord) {
      return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
  }

  const sql =  "SELECT email FROM userlogin WHERE email = $1"
  
  pool.query(sql, [req.body.usermail], (err, result) => {
    
    if (result.rowCount > 0) {
      return res.status(400).json({ message: 'Error. Mail already use ' })
    }
    const sql = "INSERT INTO userlogin (email, passw, active, id_user_profile) VALUES ($1, $2, $3, $4)";
    const log = [req.body.usermail, req.body.passWord, false, null]
    pool.query(sql, log, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      return res.json({ text: "nouveau login cree" })
    });
    
  })

})

app.post('/api/user/login', (req, res) => {
  // Pas d'information à traiter
  
  if (!req.body.usermail || !req.body.passWord) {
      return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
  }

  const sql =  "SELECT id_user_profile FROM userlogin WHERE email = $1 AND passw = $2 AND active = TRUE"
  
  pool.query(sql, [req.body.usermail, req.body.passWord], (err, result) => {

    if (result.rowCount == 0 || err) {
      return res.status(400).json({ message: 'Error. Wrong login or password' })
    }
    console.log(`ID user profile : ${result.id_user_profile}`);
    const token = jwt.sign({
      id_user_profile: result.rows[0].id_user_profile
    }, SECRET, { expiresIn: '3 hours' })

    return res.json({ access_token: token })
  })

})

app.delete('/api/user/:id', (req, res) => {
  const sql =  "DELETE FROM userlogin WHERE id_user_profile = $1"
  
  console.log(`User ${req.params.id}`);
  pool.query(sql, [req.params.id], (err, result) => {

    if (err) {
      return res.status(400).json({ message: 'Error. Wrong id' })
    }

    return res.json({ text: "user delete" })
  })
})

app.get('/api/user/test/me', checkTokenMiddleware, (req, res) => {
  res.json({
    message: `User logged with id ${res.locals.id_user_profile}`
  })
});

app.get('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' })
})


app.get("/api/user/profile/me", checkTokenMiddleware, (req, res) => {
  const sql =  "SELECT * FROM userprofile WHERE id = $1"
  pool.query(sql, [req.params.id], (err, result) => {

    if (err) {
      return res.status(400).json({ message: 'Error. Wrong id' })
    }

    return res.json(result)
  })

})

app.post("/api/user/profile/me", checkTokenMiddleware, (req, res) => {
  const sql = "INSERT INTO userprofile (first_name, last_name, genre, preference, biograpy, tags, loc, rating, photo1, photo2, photo3, photo4, photo5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
  pool.query(sql, [req.params.id], (err, result) => {

    if (err) {
      return res.status(400).json({ message: 'Error. Wrong id' })
    }

    return res.json(result)
  })
})