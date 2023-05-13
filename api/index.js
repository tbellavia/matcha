const express = require("express");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require("pg");
const {
  ERROR_MAIL,
  ERROR_PASSWORD,
  ERROR_INVALID_LOGIN,
  ERROR_USER_ALREADY_EXIST,
  ERROR_NEED_TOKEN,
  ERROR_BAD_TOKEN,
  ERROR_PROFILE,
  ERROR_CHAT
} = require("./common/messages")
require('dotenv').config()
const {
  validateEmail,
  validatePassword
} = require("./common/validation")

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
app.use(express.json({ limit: '100mb'}))
app.use(express.urlencoded({ extended: true }));

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
  if (!token) {
      return res.status(401).json({ message: ERROR_NEED_TOKEN })
  }

  // Véracité du token
  jwt.verify(token, SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: ERROR_BAD_TOKEN })
    } else {
        console.log(decodedToken);
        res.locals.id_user = decodedToken.id_user;
        res.locals.profile_created = decodedToken.profile_created;
        return next();
      }
  })
}

const checkProfileCreatedMiddleware = (req, res, next) => {
  console.log(res.locals.profile_created)
  
  if(res.locals.profile_created){
    return next()
  }
  res.status(401).json({ message: ERROR_PROFILE })
}

app.get("/api/test", checkTokenMiddleware, checkProfileCreatedMiddleware, (req, res) => {
  console.log(`Request: ${req}`);
  return res.json({ text: "user valide" })
})

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
      return res.status(400).json({ message: ERROR_INVALID_LOGIN })
  }
  if (!validateEmail(req.body.usermail)){
      return res.status(400).json({ message: ERROR_MAIL })
  }
  if (!validatePassword(req.body.passWord)){
    return res.status(400).json({ message: ERROR_PASSWORD })
  }
  const sql =  "SELECT email FROM userlogin WHERE email = $1"
  
  pool.query(sql, [req.body.usermail], (err, result) => {
    
    if (result.rowCount > 0) {
      return res.status(400).json({ message: ERROR_USER_ALREADY_EXIST })
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
      return res.status(400).json({ message: ERROR_INVALID_LOGIN })
  }

  const sql =  "SELECT id, id_user_profile FROM userlogin WHERE email = $1 AND passw = $2 AND active = TRUE"
  
  pool.query(sql, [req.body.usermail, req.body.passWord], (err, result) => {
    console.log(process.env.POSTGRES_HOST)
    console.log(err);
    if (err || result.rowCount == 0) {

      return res.status(400).json({ message: ERROR_INVALID_LOGIN })
    }
    console.log(`ID user profile : ${result.rows[0].id}`);
    const token = jwt.sign({
      profile_created: !(result.rows[0].id_user_profile === null),
      id_user: result.rows[0].id
    }, SECRET, { expiresIn: '3 hours' })

    return res.json({ access_token: token })
  })

})

app.delete('/api/user/me', checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res) => {

  idProfile = await getProfileId(res.locals.id_user)

  const sql = "DELETE FROM message USING chat WHERE  (chat.id_user1 = $1 OR chat.id_user2 = $1) AND chat.id = message.id_chat"
  pool.query(sql, [idProfile], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message})
    }
  })

  const sql2 = "DELETE FROM chat WHERE  (chat.id_user1 = $1 OR chat.id_user2 = $1)"
  pool.query(sql2, [idProfile], (err2, result2) => {

    if (err2) {
      return res.status(400).json({ message: err2.message})
    }
  })

  const sql3 = "DELETE FROM liketable WHERE  (liketable.user1 = $1 OR liketable.user2 = $1)"
  pool.query(sql3, [idProfile], (err3, result3) => {

    if (err3) {
      return res.status(400).json({ message: err3.message})
    }
  })

  const sql4 = "DELETE FROM userprofile WHERE userprofile.id = $1"
  pool.query(sql4, [idProfile], (err4, result4) => {

    if (err4) {
      return res.status(400).json({ message: err4.message})
    }
  })

  const sql5 = "DELETE FROM userlogin WHERE userprofile.id_user_profile = $1"
  pool.query(sql5, [idProfile], (err5, result5) => {

    if (err5) {
      return res.status(400).json({ message: err5.message})
    }
  })

  return res.json({ text: "user delete" })
})

app.get('/api/user/test/me', checkTokenMiddleware, (req, res) => {
  res.json({
    message: `User logged with id ${res.locals.id_user}`
  })
});

app.get("/api/user/profile/me", checkTokenMiddleware, checkProfileCreatedMiddleware,(req, res) => {
  const sql =  "SELECT * FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1"
  pool.query(sql, [res.locals.id_user], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message })
    }

    return res.json(result.rows[0])
  })

})

app.get("/api/user/profile/:target", checkTokenMiddleware, checkProfileCreatedMiddleware,(req, res) => {

  const sql =  "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
  pool.query(sql, [res.locals.id_user], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message })
    }
    const idProfile = result.rows[0].id

    const sql2 =  "SELECT id FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)) AND (user1like = 'TRUE' AND user2like = 'TRUE')"
    
    pool.query(sql2, [idProfile, req.params.target], (err2, result2) => {

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

function getGenreStringToInt(genre){
  const tabGenre = ["homme","femme","non binaire"]

  for(var i = 0, lth = tabGenre.length; i < lth; i++){  
    if (genre == tabGenre[i]){
      return(1 << i)
    }
  }
  return(1 << i)
}

function getPrefTabToInt(TabPref){
  let countPref = 0

  for(var i = 0, lth = TabPref.length; i < lth; i++){  
    constPref &= getGenreStringToInt(TabPref[i])
  }
  if (countPref == 0){
    return (1 << 0)
  }
  return countPref
}

function getSaveNewTags(newTags){
  const sql = "INSERT INTO tag (tag) VALUES ($1)";

  for(var i = 0, lth = newTags.length; i < lth; i++){
    pool.query(sql, newTags[i] , (err, result) => {
      if (err) {
        return res.status(400).json({ message: err.message })
      }
    })
  }
  return res.json({"message":"nouveaux tags enregistrer"})
}

function getPhotos(tabPhoto){
  for(var i = tabPhoto.length; i < 5; i++){
    tabPhoto.push(null)
  }
  return tabPhoto
}

app.post("/api/user/profile/me", checkTokenMiddleware, (req, res) => {
  let idMax = 0
  const genre = getGenreStringToInt(req.body.genre)
  const pref = getPrefTabToInt(req.body.preference)
  getSaveNewTags(req.body.newTags)
  const photos = getPhotos(req.body.photos)
  const sql = "INSERT INTO userprofile (first_name, last_name, genre, preference, biograpy, tags, loc, rating, photo1, photo2, photo3, photo4, photo5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ";
  const arg = [req.body.first_name, req.body.last_name,genre,pref, 
    req.body.biograpy, req.body.tags.toString(), req.body.loc, req.body.rating,
    photos[0], photos[1], photos[2], photos[3], photos[4]]
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


app.put("/api/user/profile/me", checkTokenMiddleware, checkProfileCreatedMiddleware,(req, res) => {
  // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biograpy = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
  const genre = getGenreStringToInt(req.body.genre)
  const pref = getPrefTabToInt(req.body.preference)
  getSaveNewTags(req.body.newTags)
  const photos = getPhotos(req.body.photos)
  const sql = "UPDATE userprofile SET first_name = $1, last_name = $2, genre = $3, preference = $4, biograpy = $5, tags = $6, loc = $7, rating = $8, photo1 = $9, photo2 = $10, photo3 = $11, photo4 = $12, photo5 = $13 FROM userlogin WHERE userprofile.id = userlogin.id_user_profile AND userlogin.id = $14";
  const arg = [req.body.first_name, req.body.last_name,genre,pref, 
    req.body.biograpy, req.body.tags, req.body.loc, req.body.rating,
    photos[0], photos[1], photos[2], photos[3], photos[4],res.locals.id_user]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({"message" : "profile modifier"})
  })

})

async function getProfileId(userId){
  const sql =  "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
  try {
    const res = await pool.query(sql, [userId]); 
    if (res.rowCount < 1){
   
      return null
    }
    const id = res.rows[0].id
    console.log( res.rows[0].id)
   
    return id;
  } catch (err){
    console.log(err.message)
    return null
  }
}

async function getChatId(user1, user2){
  const sql = "SELECT id FROM chat WHERE (id_user1 = $1 AND id_user2 = $2) OR (id_user1 = $2 AND id_user2 = $1)"

  try {
    const res = await pool.query(sql, [user1, user2]); 
    if (res.rowCount < 1){
   
      return null
    }
    const id = res.rows[0].id
    console.log( res.rows[0].id)
   
    return id;
  } catch (err){
    console.log(err.message)
    return null
  }
}

async function creatNewChat(user1, user2){
  idChat = await getChatId(user1, user2)
  if( idChat != null){
    
    return false
  }
  else{
    const sql = "INSERT INTO chat (id_user1, id_user2) VALUES ($1, $2)"
    pool.query(sql, [user1, user2] , (err, result) => {
      if (err) {
        return false
      }
      return true
    })
  }

}

app.post('/api/user/like/me/:target', checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {

  const idProfile = await getProfileId(res.locals.id_user)

  if (idProfile == null){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }

  const sql2 =  "SELECT id, user1like, user2like, user1 FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1))"
  pool.query(sql2, [idProfile, req.params.target], async(err2, result2) => {

    if (err2) {
      return res.status(400).json({ message: err2.message })
    }
    else if(result2.rowCount < 1){
      const sql3 = "INSERT INTO liketable (user1, user2, user1like) VALUES ($1, $2, 'TRUE')"
      pool.query(sql3, [idProfile, req.params.target], (err3, result3) => {
    
        if (err3) {
          return res.status(400).json({ message: err3.message })
        }
        return res.json({"message": "like ajouté"})
      })
    }
    else{
      const idLike = result2.rows[0].id
      if (result2.rows[0].user1 == idProfile){
        const sql4 = "UPDATE liketable SET user1like = 'TRUE' WHERE id = $1"
        pool.query(sql4, [idLike], (err4, result4) => {
          if (err4) {
            return res.status(400).json({ message: err4.message })
          }
        })
        if (result2.rows[0].user2like == true){
          if (await creatNewChat(idProfile, req.params.target)){
            res.json({"message": "match nouvelle conversation ajouté"})
          }
        }
      }
      else{
        const sql4 = "UPDATE liketable SET user2like = 'TRUE' WHERE id = $1"      
        pool.query(sql4, [idLike], (err4, result4) => {
    
          if (err4) {
            return res.status(400).json({ message: err4.message })
          }      
        })

        if (result2.rows[0].user1like == true){

          if (await creatNewChat(idProfile, req.params.target)){
          
            res.json({"message": "match nouvelle conversation ajouté"})
          }
        }
      }
      return res.json({"message": "like ajouté"}) 
    }
  })
})

app.post('/api/user/unlike/me/:target', checkTokenMiddleware, checkProfileCreatedMiddleware,(req, res) => {
  

  const sql =  "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
  pool.query(sql, [res.locals.id_user], (err, result) => {

    if (err) {
      return res.status(400).json({ message: err.message })
    }
    else if(result.rowCount < 1){
      return res.json({ "message": "profile non defini" })
    }
    const idProfile = result.rows[0].id

    const sql2 =  "SELECT id, user1like, user2like, user1 FROM liketable WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1))"
    
    
    pool.query(sql2, [idProfile, req.params.target], (err2, result2) => {

    if (err2) {
      return res.status(400).json({ message: err2.message })
    }
    else if(result2.rowCount < 1){
      const sql3 = "INSERT INTO liketable (user1, user2, user1like) VALUES ($1, $2, 'FALSE')"
      pool.query(sql3, [idProfile, req.params.target], (err3, result3) => {
    
        if (err3) {
          return res.status(400).json({ message: err3.message })
        }
        return res.json({"message": "unlike ajouté"})
        })
    }
    else{

      const idLike = result2.rows[0].id
      if (result2.rows[0].user1 == idProfile){
        const sql4 = "UPDATE liketable SET user1like = 'FALSE' WHERE id = $1"
        pool.query(sql4, [idLike], (err4, result4) => {
    
          if (err3) {
            return res.status(400).json({ message: err4.message })
          }
          })
      }
      else{
        const sql4 = "UPDATE liketable SET user2like = 'FALSE' WHERE id = $1"      
        pool.query(sql4, [idLike], (err4, result4) => {
    
        if (err3) {
          return res.status(400).json({ message: err4.message })
        }
        
        })
      }
      return res.json({"message": "unlike ajouté"}) 
    }
    })
  })
})



app.post("/api/user/chat/message/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res) => {
  // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biograpy = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
  idProfile = await getProfileId(res.locals.id_user)
  if (idProfile == null){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }

  idChat = await getChatId(idProfile, req.params.target)
  if (idProfile == null){
    return res.status(400).json({ message: ERROR_CHAT })
  }

  const sql = "INSERT INTO message (id_chat, date_envoi, mess, userwrite) VALUES ($1, NOW(), $2, $3)";

  const arg = [idChat, req.body.message, idProfile]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({"message" : "message ajouter"})
  })

})

app.get("/api/user/chat/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res)=>{
  
  idProfile = await getProfileId(res.locals.id_user)
  if (idProfile == undefined){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }
  
  idChat = await getChatId(idProfile, req.params.target)
  if (idChat == null){
    return res.status(400).json({message: ERROR_CHAT})
  }

  sql = "SELECT * FROM message WHERE id_chat = $1 ORDER BY date_envoi DESC OFFSET $2 LIMIT $3"
  const arg = [idChat, req.query.skip, req.query.limit]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({"chatId": idChat,"result" : result.rows})
  })
})

app.delete("/api/user/chat/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res)=>{
  
  idProfile = await getProfileId(res.locals.id_user)
  if (idProfile == undefined){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }
  
  idChat = await getChatId(idProfile, req.params.target)
  if (idChat == null){
    return res.status(400).json({message: ERROR_CHAT})
  }

  sql = "DELETE FROM message WHERE message.id_chat = $1"
  const arg = [idChat]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
  })

  sql2 = "DELETE FROM chat WHERE chat.id = $1"
  const arg2 = [idChat]
  pool.query(sql2, arg2 , (err2, result2) => {
    if (err2) {
      return res.status(400).json({ message: err2.message })
    }
  })

  sql3 = "UPDATE liketable SET user1like = 'FALSE', user2like = 'FALSE' WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)"
  const arg3 = [idProfile, req.params.target]
  pool.query(sql3, arg3 , (err3, result3) => {
    if (err3) {
      return res.status(400).json({ message: err3.message })
    }
  })

  return res.json({"result" : "conversation et like suprimer"})
})

// function getDegLatitudeToAdd(nbrOfKm){
//   return nbrOfKm/111.12
// }

// function getDegLongitudeToAdd(nbrOfKm){
//   return nbrOfKm/(111.12*Math.cos(nbrOfKm))
// }

app.get("/api/user/profile", checkTokenMiddleware,  checkProfileCreatedMiddleware,(req, res)=>{
  
  
  const sql =  "SELECT userprofile.id , userprofile.latitude , userprofile.longitude , userprofile.distmax , userprofile.preference, userprofile.agemin, userprofile.agemax FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
  const arg = [res.locals.id_user]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message }) 
    }
    if (result.rowCount == 0) {
      return res.json({"message":"id non trouver"})}
    // addLongitude = getDegLongitudeToAdd(result.rows[0].distmax)
    // addLatitude = getDegLatitudeToAdd(result.rows[0].distmax)
    // AND $1 != p.id AND (($2 & p.genre) != 0) / AND $1 != p.id
    // const sql2 = "SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))"
    // const sql2 =  "SELECT p.*  FROM userprofile p WHERE NOT EXISTS (SELECT 1 FROM liketable l WHERE ($1 = l.user1 AND l.user2 = p.id) OR ($1 = l.user2 AND l.user1 = p.id)) UNION SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))"
    const sql2 =  "SELECT *, (DATE_PART('days', NOW() - subq.birth) / 365) AS age, \
    6371 * 2 * ASIN(SQRT( \
      POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
      COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
      POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) \
  )) AS distance \
    FROM (\
      SELECT p.*  \
      FROM userprofile p \
      WHERE NOT EXISTS (\
        SELECT 1 FROM liketable l \
        WHERE ($1 = l.user1 AND l.user2 = p.id) \
        OR ($1 = l.user2 AND l.user1 = p.id)) \
      UNION SELECT p.* \
      FROM userprofile p \
      INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 \
      WHERE (($1 = l.user1 AND l.user1like IS NULL) OR ($1 = l.user2  AND l.user2like IS NULL))\
    ) AS subq \
    WHERE subq.id != $1 AND (($2 & subq.genre) != 0) AND (DATE_PART('days', NOW() - subq.birth) / 365) > $3 AND (DATE_PART('days', NOW() - subq.birth) / 365) < $4 \
    AND (6371 * 2 * ASIN(SQRT(POWER(SIN((subq.latitude - $5) * PI() / 180 / 2), 2) + \
      COS($5 * PI() / 180) * COS(subq.latitude * PI() / 180) * \
      POWER(SIN((subq.longitude - $6) * PI() / 180 / 2), 2) ))) < $7 LIMIT $8"
    
    // const sql2 = "SELECT  FROM userprofile "
    // const sql2 =  "SELECT p.* FROM userprofile p WHERE NOT EXISTS (SELECT 1 FROM liketable l WHERE ($1 = l.user1 AND l.user2 = p.id) OR ($1 = l.user2 AND l.user1 = p.id)) AND $1 != p.id "
    // const sql2 =  "SELECT p.* FROM userprofile p INNER JOIN liketable l ON p.id = l.user1 OR p.id = l.user2 WHERE ($1 = l.user1 OR $1 = l.user2) AND $1 != p.id"
    const arg2 = [result.rows[0].id, result.rows[0].preference, result.rows[0].agemin, result.rows[0].agemax, result.rows[0].latitude, result.rows[0].longitude, result.rows[0].distmax, req.query.limit]
    pool.query(sql2, arg2 , (err2, result2) => {
    // pool.query(sql2, [] , (err2, result2) => {
      if (err2) {
        return res.status(400).json({ message: err2.message })
      }

      return res.json({"result" : result2})
    })
    // return res.json({"result" : result.rows[0].longitude})
  })
})

app.get("/api/user/chat/me", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res)=>{
  
  idProfile = await getProfileId(res.locals.id_user)
  if (idProfile == undefined){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }

  sql = "SELECT p.id AS idProfileUser, p.first_name, m.mess, p.photo1, c.id AS idChat , m.date_envoi \
  FROM userprofile p \
  JOIN chat c ON c.id_user1 = p.id OR c.id_user2 = p.id \
  LEFT JOIN message m ON c.id = m.id_chat \
  WHERE m.id = ( SELECT MAX(id) \
    FROM message m2 \
    WHERE m2.id_chat = c.id) \
  AND (c.id_user1 = $1 OR c.id_user2 = $1) AND p.id != $1 \
  UNION SELECT p.id AS idProfileUser, p.first_name, NULL AS mess, p.photo1, c.id AS idChat , NULL AS date_envoi \
  FROM userprofile p \
  JOIN chat c ON c.id_user1 = p.id OR c.id_user2 = p.id \
  WHERE NOT EXISTS ( \
    SELECT 1 \
    FROM message m \
    WHERE m.id_chat = c.id ) AND (c.id_user1 = $1 OR c.id_user2 = $1) AND p.id != $1 "
  const arg = [idProfile]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({"result" : result.rows})
  })
})


app.post("/api/user/blocked/me/:target", checkTokenMiddleware, checkProfileCreatedMiddleware, async (req, res) => {
  // const sql = "UPDATE userprofile JOIN userlogin ON userlogin.id_user_profile	= userprofile.id SET userprofile.first_name = $1, userprofile.last_name = $2, userprofile.genre = $3, userprofile.preference = $4, userprofile.biograpy = $5, userprofile.tags = $6, userprofile.loc = $7, userprofile.rating = $8, userprofile.photo1 = $9, userprofile.photo2 = $10, userprofile.photo3 = $11, userprofile.photo4 = $12, userprofile.photo5 = $13 WHERE userlogin.id = $14";
  idProfile = await getProfileId(res.locals.id_user)
  if (idProfile == undefined){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }
  
  idChat = await getChatId(idProfile, req.params.target)
  if (idChat == null){
    return res.status(400).json({message: ERROR_CHAT})
  }

  sql = "DELETE FROM message WHERE message.id_chat = $1"
  const arg = [idChat]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
  })

  sql2 = "DELETE FROM chat WHERE chat.id = $1"
  const arg2 = [idChat]
  pool.query(sql2, arg2 , (err2, result2) => {
    if (err2) {
      return res.status(400).json({ message: err2.message })
    }
  })

  sql3 = "UPDATE liketable SET user1like = 'FALSE', user2like = 'FALSE' WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)"
  const arg3 = [idProfile, req.params.target]
  pool.query(sql3, arg3 , (err3, result3) => {
    if (err3) {
      return res.status(400).json({ message: err3.message })
    }
  })

  const sql4 = "INSERT INTO blocked (user1, user2) VALUES ($1, $2)";

  const arg4 = [idProfile, req.params.target]
  pool.query(sql4, arg4 , (err4, result4) => {
    if (err4) {
      return res.status(400).json({ message: err4.message })
    }

    return res.json({"message" : "profile blocker"})
  })

})

app.put("/api/user/filtre/me", checkTokenMiddleware, checkProfileCreatedMiddleware,async (req, res) => {

  idProfile = await getProfileId(res.locals.id_user)
  if (idProfile == undefined){
    return res.status(400).json({ message: ERROR_BAD_TOKEN })
  }

  const sql = "UPDATE userprofile SET agemin = $1, agemax = $2, distmax = $3, preference = $4 WHERE id = $5";
  const arg = [req.body.ageMin, req.body.ageMax,req.body.distMax,req.body.preference, idProfile]
  pool.query(sql, arg , (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    return res.json({"message" : "filtre modifier"})
  })

})

app.get('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' })
})
