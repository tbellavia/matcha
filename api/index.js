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

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service:'Outlook',
  auth:{
    user:process.env.MAIL,
    pass:process.env.MAIL_PASSWORD
  }
})

// const transporter = nodemailer.createTransport({
//   // host:"sntp-mail.outlook.com",
//   host:"http://localhost:8080",
//   secureConnetion:false,
//   port:587,
//   tls:{
//     ciphers: "SSLv3"
//   },
//   auth:{
//     user:process.env.MAIL,
//     pass:process.env.MAIL_PASSWORD
//   }
// })



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
        res.locals.id_user = decodedToken.id_user;
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

function makeRandString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

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

    randString = makeRandString(125)
    const sql = "INSERT INTO userlogin (email, passw, active, id_user_profile,mailvalidation) VALUES ($1, $2, $3, $4, $5)";
    const log = [req.body.usermail, req.body.passWord, false, null,randString]
    pool.query(sql, log, (err, result) => {
      
      if (err) {
        return res.json({ text: err.message })
      }

      const mailOptions={
        from:process.env.MAIL,
        to:"mainhivvt@gmail.com",
        subject:"Matcha mail d'otentification",
        text:"Lien d'activation : http://localhost:3000/api/user/validation/" + randString
      }
      
      
      transporter.sendMail(mailOptions,(error, info)=>{
        if (error){
          console.log(error)
          return console.error(error.message);
        
        }else{
          console.log("e-mail envoyé" + info.response)
      }
      })

      return res.json({ text: "nouveau login cree" })
    });
    
  })

})

app.get("/api/user/validation/:stringValidation", (req, res) => {

  const sql =  "UPDATE userlogin SET active = 'TRUE' , mailvalidation = NULL WHERE mailvalidation = $1"

  pool.query(sql, [req.params.stringValidation], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({ text: "user valide" })
  })
}) 

app.post('/api/user/login', (req, res) => {
  // Pas d'information à traiter
  
  if (!req.body.usermail || !req.body.passWord) {
      return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
  }

  const sql =  "SELECT id FROM userlogin WHERE email = $1 AND passw = $2 AND active = TRUE"
  
  pool.query(sql, [req.body.usermail, req.body.passWord], (err, result) => {
    console.log(process.env.POSTGRES_HOST)
    console.log(err);
    if (err || result.rowCount == 0) {
      return res.status(400).json({ message: 'Error. Wrong login or password' })
    }
    console.log(`ID user profile : ${result.rows[0].id}`);
    const token = jwt.sign({
      id_user: result.rows[0].id
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
    message: `User logged with id ${res.locals.id_user}`
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
  const sql = "INSERT INTO userprofile (first_name, last_name, genre, preference, biograpy, tags, loc, rating, photo1, photo2, photo3, photo4, photo5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) SELECT @@IDENTITY AS 'id'";
  const arg = [req.body.first_name, req.body.last_name,req.body.genre,req.body.preference, 
    req.body.biograpy, req.body.tags, req.body.loc, req.body.rating,
    req.body.photo1, req.body.photo2, req.body.photo3, req.body.photo4, req.body.photo5]
  pool.query(sql, arg , (err, result) => {

    if (err) {
      return res.status(400).json({ message: 'Error. Wrong id' })
    }

    return res.json(result)
  })
})




