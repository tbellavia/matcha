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

app.get("/api/user/profile/me", checkTokenMiddleware, (req, res) => {
  const sql =  "SELECT * FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1"
  pool.query(sql, [res.locals.id_user], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message })
    }

    return res.json(result.rows[0])
  })

})

app.get("/api/user/profile/:target", checkTokenMiddleware, (req, res) => {

  const sql =  "SELECT id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
  pool.query(sql, [res.locals.id_user], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message })
    }
    const idProfile = result.rows[0].id

    const sql2 =  "SELECT id FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)) AND (user1like = 'TRUE' AND user2like = 'TRUE')"
    
    pool.query(sql2, [res.locals.id_user, req.params.target], (err2, result2) => {

    if (err2) {
      return res.status(400).json({ message: err2.message })
    }
    else if(result.rowCount < 1){
      return res.json({ "erreur": 'pas de match avec cette personne' })
    }
    
    const sql3 =  "SELECT * FROM userprofile WHERE id = $1"
    pool.query(sql3, [req.params.target], (err3, result3) => {
  
      if (err) {
        return res.status(400).json({ message: err3.message })
      }
  
      return res.json(result3.rows[0])
    })

    })
  })

})

app.get('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' })
})




app.post("/api/user/profile/me", checkTokenMiddleware, (req, res) => {
  let idMax = 0
  const sql = "INSERT INTO userprofile (first_name, last_name, genre, preference, biograpy, tags, loc, rating, photo1, photo2, photo3, photo4, photo5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ";
  const arg = [req.body.first_name, req.body.last_name,req.body.genre,req.body.preference, 
    req.body.biograpy, req.body.tags, req.body.loc, req.body.rating,
    req.body.photo1, req.body.photo2, req.body.photo3, req.body.photo4, req.body.photo5]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
  })
  const sql2 = "SELECT MAX(id) AS id FROM userprofile";
  pool.query(sql2, [] , (err2, result2) => {
    
    if (err2) {
      return res.status(400).json({ message: err2.message })
    }
    // return res.json(result2)
    idMax = result2.rows[0].id
    
    const sql3 = "UPDATE userlogin SET id_user_profile = $1 WHERE id = $2";
    pool.query(sql3, [idMax + 1, res.locals.id_user] , (err3, result3) => {
      
      if (err3) {
        return res.status(400).json({ message: err3.message })
      }
      // return res.json(result2)
      return res.json({"message" : "profile cree"})
    })
  })

})


app.put("/api/user/profile/me", checkTokenMiddleware, (req, res) => {
  // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biograpy = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
  const sql = "UPDATE userprofile SET first_name = $1, last_name = $2, genre = $3, preference = $4, biograpy = $5, tags = $6, loc = $7, rating = $8, photo1 = $9, photo2 = $10, photo3 = $11, photo4 = $12, photo5 = $13 FROM userlogin WHERE userprofile.id = userlogin.id_user_profile AND userlogin.id = $14";
  const arg = [req.body.first_name, req.body.last_name,req.body.genre,req.body.preference, 
    req.body.biograpy, req.body.tags, req.body.loc, req.body.rating,
    req.body.photo1, req.body.photo2, req.body.photo3, req.body.photo4, req.body.photo5,res.locals.id_user]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({"message" : "profile modifier"})
  })

})

app.post('/api/user/like/me/:target', (req, res) => {
  

})