
const pool = require("../db/db");

async function getProfileId(userId) {
  const sql = "SELECT userprofile.id FROM userprofile INNER JOIN userlogin ON userlogin.id_user_profile = userprofile.id WHERE userlogin.id = $1 "
  try {
    const res = await pool.query(sql, [userId]);
    if (res.rowCount < 1) {


      return null
    }
    const id = res.rows[0].id
    console.log(res.rows[0].id)

    return id;
  } catch (err) {
    console.log(err.message)
    return null
  }
}

async function isUserBlock(user1, user2) {
  const sql = "SELECT * FROM blocked WHERE ((user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1))"
  try {
    const res = await pool.query(sql, [user1, user2]);
    if (res.rowCount > 0) {
      return true
    }
    return false;
  } catch (err) {
    console.log(err.message)
    return true
  }
}

async function isAlreadyAnswered(user1, user2) {
  const sql = "SELECT * FROM liketable \
    WHERE ((user1 = $1 AND user2 = $2 AND (user1Like IS NOT NULL)) OR (user1 = $2 AND user2 = $1 AND (user2Like IS NOT NULL)))"

  try {
    const res = await pool.query(sql, [user1, user2]);
    if (res.rowCount < 1) {
      return "undefined"
    }
    else if (res.rows[0].user1like == true && res.rows[0].user2like == true) {
      return "match"
    }
    return "alreadyAnswered";
  } catch (err) {
    console.log(err.message)
    return false
  }
}

async function rating(user) {
  const sql = "  SELECT u.id, \
    (SELECT COALESCE(COUNT(*),0) FROM liketable WHERE ((user1 = u.id AND user2like = TRUE) OR (user2 = u.id AND user1like = TRUE)) ) AS countlike,\
    (SELECT COALESCE(COUNT(*),1) FROM views WHERE id_user2 = u.id) AS countviews\
  FROM userprofile u\
  WHERE u.id = $1"
  try {
    const res = await pool.query(sql, [user]);
    if (res.rowCount < 1) {
      return 0
    }
    return ((res.rows[0].countlike * 1.0) / res.rows[0].countviews);
  } catch (err) {
    console.log(err.message)
    return 0
  }
}

async function getChatId(user1, user2) {
  const sql = "SELECT id FROM chat WHERE (id_user1 = $1 AND id_user2 = $2) OR (id_user1 = $2 AND id_user2 = $1)"

  try {
    const res = await pool.query(sql, [user1, user2]);
    if (res.rowCount < 1) {

      return null
    }
    const id = res.rows[0].id
    console.log(res.rows[0].id)

    return id;
  } catch (err) {
    console.log(err.message)
    return null
  }
}

async function creatNewChat(user1, user2) {
  idChat = await getChatId(user1, user2)
  if (idChat != null) {

    return false
  }
  else {
    const sql = "INSERT INTO chat (id_user1, id_user2) VALUES ($1, $2)"
    pool.query(sql, [user1, user2], (err, result) => {
      if (err) {
        return false
      }
      return true
    })
  }
}

function encodeGender(gender) {
  const genders = {
    "male": 1,
    "female": 2,
    "non-binary": 4,
  };

  return genders[gender];
}

function encodePreferences(preferences) {
  let encodedPreferences = 0;

  for (const preference of preferences)
    encodedPreferences += encodeGender(preference);
  return encodedPreferences;
}

function getSaveNewTags(newTags) {
  const sql = "INSERT INTO tag (tag) VALUES ($1)";

  for (var i = 0, lth = newTags.length; i < lth; i++) {
    pool.query(sql, newTags[i], (err, result) => {
      if (err) {
        return { message: err.message }
      }
    })
  }
  return { "message": "nouveaux tags enregistrer" }
}

function getPhotos(tabPhoto) {
  for (var i = tabPhoto.length; i < 5; i++) {
    tabPhoto.push(null)
  }
  return tabPhoto
}

function saveNewTags(tags) {
  const sql = "SELECT tag FROM tag"
  pool.query(sql, [], (err, res) => {
    if (err) {
      return false
    }

    tagExisting = res.rows.map((row) => row.tag)
    newTags = tags.filter(elem => !tagExisting.includes(elem))

    newTags.forEach(newElem => {
      const sql2 = 'INSERT INTO tag (tag) VALUES ($1)'
      pool.query(sql2, [newElem], (err2, res2) => {
        if (err2) {
          return false
        }
        console.log(`${newElem} ajouter a la table tag`)
      })
    })
    return true
  })
}

function addNotifViews(from, to) {
  console.log(from)
  idProfile = from
  if (idProfile == undefined) {
    return
  }
  sql = "SELECT notifsviews \
    FROM userprofile \
    WHERE id = $1"
  const arg = [to]
  pool.query(sql, arg, (err, result) => {
    if (err) {
      return { message: err.message }
    }
    let views = JSON.parse(result.rows[0].notifsviews)

    views[from.toString()] = true

    sql2 = "UPDATE userprofile SET notifsviews= $2 WHERE id = $1"
    const arg2 = [to, JSON.stringify(views)]
    pool.query(sql2, arg2, (err2, result2) => {
      if (err2) {
        return { message: err.message }
      }
      return { "views": "views ajouté" }
      // return res.json({ "views": "views ajouté"})
    })
  })
}

function addNotifLike(from, to) {
  sql = "SELECT notifslikes \
    FROM userprofile \
    WHERE id = $1"
  const arg = [to]
  pool.query(sql, arg, (err, result) => {
    if (err) {
      return { message: err.message }
    }
    let likes = JSON.parse(result.rows[0].notifslikes)

    likes[from] = true

    sql2 = "UPDATE userprofile SET notifslikes= $2 WHERE id = $1"
    const arg2 = [to, JSON.stringify(likes)]
    pool.query(sql2, arg2, (err2, result2) => {
      if (err2) {
        return { message: err.message }
      }
      return { "likes": "likes ajouté" }
    })
  })
}

function addNotifMessages(from, to) {
  sql = "SELECT notifsmessages \
    FROM userprofile \
    WHERE id = $1"
  const arg = [to]
  pool.query(sql, arg, (err, result) => {
    if (err) {
      return { message: err.message }
    }
    let message = JSON.parse(result.rows[0].notifsmessages)
    console.log(result.rows[0])
    message[from] = message[from] ? message[from] + 1 : 1

    sql2 = "UPDATE userprofile SET notifsmessages= $2 WHERE id = $1"
    const arg2 = [to, JSON.stringify(message)]
    pool.query(sql2, arg2, (err2, result2) => {
      if (err2) {
        return { message: err.message }
      }
      return { "message": "message ajouté" }
    })
  })
}

module.exports = {
  getProfileId,
  creatNewChat,
  getChatId,
  getPrefTabToInt: encodePreferences,
  getSaveNewTags,
  getPhotos,
  getGenreStringToInt: encodeGender,
  saveNewTags,
  isUserBlock,
  isAlreadyAnswered,
  rating,
  addNotifViews,
  addNotifLike,
  addNotifMessages
}
